import { NextResponse } from "next/server";

async function fetchViaProxy(url: string, proxy?: string): Promise<string> {
  const target = proxy ? `${proxy}${encodeURIComponent(url)}` : url;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(target, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    if (!proxy) return await res.text();
    const json = await res.json();
    return json.contents || json.body || "";
  } catch {
    clearTimeout(timeout);
    return "";
  }
}

function extractData(html: string) {
  const getMeta = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m?.[1]?.trim() || "";
  };

  let title =
    getMeta(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
    getMeta(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i) ||
    getMeta(/<title>([^<]+)<\/title>/i) ||
    "";

  let description =
    getMeta(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
    getMeta(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
    "";

  const images: string[] = [];
  const ogImage = getMeta(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogImage) images.push(ogImage);

  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1];
    if (src.startsWith("http") && !images.includes(src) && images.length < 5) {
      images.push(src);
    }
  }

  let price = 0;
  const priceMeta = getMeta(/<meta\s+property="product:price:amount"\s+content="([^"]+)"/i);
  if (priceMeta) price = parseFloat(priceMeta) || 0;

  if (!price) {
    const patterns = [
      /"price"\s*:\s*"?([\d.]+)"?/i,
      /"priceAmount"\s*:\s*"?([\d.]+)"?/i,
      /"originalPrice"\s*:\s*"?([\d.]+)"?/i,
      /data-price=["']([\d.]+)["']/i,
    ];
    for (const p of patterns) {
      const match = html.match(p);
      if (match) { price = parseFloat(match[1]) || 0; if (price > 0) break; }
    }
  }

  // JSON-LD
  const jm = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/);
  if (jm) {
    try {
      const jd = JSON.parse(jm[1]);
      const d = Array.isArray(jd) ? jd[0] : jd;
      if (!title && d.name) title = d.name;
      if (!description && d.description) description = d.description;
      if (!price && d.offers?.price) price = parseFloat(d.offers.price);
      if (!images.length && d.image) images.push(d.image);
    } catch {}
  }

  const features: string[] = [];
  const liRegex = /<li[^>]*>([^<]{10,200})<\/li>/gi;
  while ((m = liRegex.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text.length > 10 && features.length < 6 && !features.includes(text)) {
      features.push(text);
    }
  }

  return {
    title: title.substring(0, 200) || "Unknown Product",
    description: description.substring(0, 1000),
    images: images.filter((u) => u.startsWith("http") || u.startsWith("data:")).slice(0, 5),
    price: Math.round(price * 100) / 100,
    features: features.slice(0, 6),
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL مطلوب" }, { status: 400 });

    // Try direct fetch first
    let html = await fetchViaProxy(url);

    // Fallback: try CORS proxies
    if (!html || html.length < 500) {
      const proxies = [
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?url=",
      ];
      for (const proxy of proxies) {
        html = await fetchViaProxy(url, proxy);
        if (html && html.length > 500) break;
      }
    }

    if (!html || html.length < 200) {
      return NextResponse.json({
        error: "تعذر استيراد البيانات. الموقع بيمنع الاتصال الآلي.",
        bookmarklet: true,
      }, { status: 422 });
    }

    const data = extractData(html);

    if (!data.title && !data.images.length) {
      return NextResponse.json({
        error: "تعذر استخراج بيانات المنتج",
        bookmarklet: true,
      }, { status: 422 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      error: "خطأ في الاتصال",
      bookmarklet: true,
    }, { status: 422 });
  }
}
