import { NextResponse } from "next/server";

function extractMeta($: any, html: string) {
  const getMeta = (prop: string) => {
    const match = html.match(new RegExp(`<meta[^>]+${prop}[^>]+>`, "i"));
    if (match) {
      const content = match[0].match(/content=["']([^"']+)["']/);
      return content ? content[1] : "";
    }
    return "";
  };

  let title =
    getMeta('property="og:title"') ||
    getMeta('name="twitter:title"') ||
    html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ||
    "";

  let description =
    getMeta('property="og:description"') ||
    getMeta('name="description"') ||
    "";

  const images: string[] = [];
  const ogImage = getMeta('property="og:image"');
  if (ogImage) images.push(ogImage);

  // Extract all image URLs from the page
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith("http") && !images.includes(src) && images.length < 5) {
      images.push(src);
    }
  }

  let price = 0;
  const priceMeta =
    getMeta('property="product:price:amount"') ||
    getMeta('property="og:price:amount"');

  if (priceMeta) price = parseFloat(priceMeta) || 0;

  if (!price) {
    const pricePatterns = [
      /"price"\s*:\s*([\d.]+)/,
      /"priceAmount"\s*:\s*([\d.]+)/,
      /"originalPrice"\s*:\s*([\d.]+)/,
      /€\s*([\d.,]+)/,
      /\$\s*([\d.,]+)/,
      /US\s*\$([\d.,]+)/,
    ];
    for (const pattern of pricePatterns) {
      const m = html.match(pattern);
      if (m) {
        price = parseFloat(m[1].replace(/,/g, "")) || 0;
        if (price > 0) break;
      }
    }
  }

  // Try JSON-LD
  const jsonldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/);
  if (jsonldMatch) {
    try {
      const jsonld = JSON.parse(jsonldMatch[1]);
      const data = Array.isArray(jsonld) ? jsonld[0] : jsonld;
      if (!title && data.name) title = data.name;
      if (!description && data.description) description = data.description;
      if (!price && data.offers?.price) price = parseFloat(data.offers.price);
    } catch {}
  }

  // Try AliExpress specific data
  const aeDataMatch = html.match(/window\.runParams\s*=\s*({[^;]+})/);
  if (aeDataMatch) {
    try {
      const aeData = JSON.parse(aeDataMatch[1]);
      const data = aeData?.data?.product || aeData?.data;
      if (data) {
        if (!title) title = data.subject || "";
        if (!description) description = data.description || "";
        if (!price && data.price) price = parseFloat(String(data.price)) || 0;
      }
    } catch {}
  }

  const features: string[] = [];
  const bulletRegex = /<li[^>]*>([^<]{10,200})<\/li>/gi;
  while ((match = bulletRegex.exec(html)) !== null) {
    const text = match[1].trim().replace(/<[^>]+>/g, "");
    if (text.length > 10 && features.length < 6 && !features.includes(text)) {
      features.push(text);
    }
  }

  return {
    title: (title || "Unknown Product").substring(0, 200),
    description: (description || "").substring(0, 1000),
    images: images.filter((u) => u.startsWith("http")).slice(0, 5),
    price,
    features: features.slice(0, 6),
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
        "Cache-Control": "no-cache",
      },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const data = extractMeta(null, html);

    if (!data.title && !data.images.length) {
      return NextResponse.json(
        { error: "الموقع منع الاستيراد. أضيفي البيانات يدوياً — الاسم والصورة والسعر." },
        { status: 422 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "تعذر الاتصال بالموقع. أضيفي البيانات يدوياً." },
      { status: 422 }
    );
  }
}
