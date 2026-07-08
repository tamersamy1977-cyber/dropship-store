import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function tryFetch(url: string, agent?: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": agent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timer);
    const text = await res.text();
    return text.length > 300 ? text : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function tryJina(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      signal: controller.signal,
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "text",
        "X-With-Links-Summary": "true",
      },
    });
    clearTimeout(timer);
    if (res.status === 200) {
      const text = await res.text();
      return text.length > 200 ? text : null;
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function extractFromCheerio(html: string) {
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  let price = 0;
  const priceMeta =
    $('meta[property="product:price:amount"]').attr("content") ||
    $('meta[property="og:price:amount"]').attr("content") ||
    $("[data-price]").first().attr("data-price") ||
    "";
  if (priceMeta) price = parseFloat(priceMeta) || 0;

  if (!price) {
    const priceEl =
      $('[class*="price"]').first().text().trim() ||
      $('[class*="Price"]').first().text().trim() ||
      $('[class*="amount"]').first().text().trim() ||
      "";
    const m = priceEl.match(/[\d,]+\.?\d*/);
    if (m) price = parseFloat(m[0].replace(/,/g, "")) || 0;
  }

  const images: string[] = [];
  const ogImg = $('meta[property="og:image"]').attr("content");
  if (ogImg) images.push(ogImg);
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (src.startsWith("http") && images.length < 5 && !images.includes(src)) {
      images.push(src);
    }
  });

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html() || "";
      const data = JSON.parse(raw);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item.name && !title) Object.assign({}, { title: item.name });
        if (item.description && !description)
          Object.assign({}, { description: item.description });
        if (item.offers?.price && !price)
          price = parseFloat(item.offers.price) || 0;
        if (item.image && images.length === 0) {
          if (typeof item.image === "string") images.push(item.image);
          else if (Array.isArray(item.image))
            images.push(...item.image.slice(0, 1));
        }
      }
    } catch {}
  });

  const features: string[] = [];
  $("li").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 10 && features.length < 6 && !features.includes(text)) {
      features.push(text);
    }
  });

  $('[class*="feature"], [class*="Feature"], [class*="bullet"], [class*="highlight"]').each(
    (_, el) => {
      const text = $(el).text().trim();
      if (
        text.length > 10 &&
        features.length < 6 &&
        !features.includes(text)
      ) {
        features.push(text);
      }
    }
  );

  return {
    title: title.substring(0, 200) || "",
    description: description.substring(0, 1000),
    images: images.filter((u) => u.startsWith("http")).slice(0, 5),
    price: Math.round(price * 100) / 100 || 0,
    features: features.slice(0, 6),
  };
}

function extractFromMarkdown(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let title = "";
  let description = "";
  let price = 0;
  const images: string[] = [];

  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i];
    if (!title && line.startsWith("#")) {
      title = line.replace(/^#+\s*/, "");
    }
    const pMatch = line.match(/\$?([\d,]+\.?\d{2})/);
    if (!price && pMatch) {
      price = parseFloat(pMatch[1].replace(/,/g, "")) || 0;
    }
    const imgMatch = line.match(/!\[.*?\]\(([^)]+)\)/);
    if (imgMatch && images.length < 3) {
      images.push(imgMatch[1]);
    }
  }

  for (const line of lines.slice(1)) {
    if (!description && line.length > 50 && !line.startsWith("#") && !line.startsWith("!")) {
      description = line.substring(0, 500);
      break;
    }
  }

  const features: string[] = [];
  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.replace(/^[-*]\s*/, "").trim();
      if (text.length > 10 && features.length < 6 && !features.includes(text)) {
        features.push(text);
      }
    }
  }

  return { title, description, price, images, features };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL مطلوب" }, { status: 400 });

    const results: { title?: string; description?: string; price?: number; images?: string[]; features?: string[] }[] = [];

    // 1. Jina AI Reader (bypasses Cloudflare)
    const jinaText = await tryJina(url);
    if (jinaText) {
      const data = extractFromMarkdown(jinaText);
      if (data.title) results.push(data);
    }

    // 2. Direct fetch with Cheerio parsing
    for (const agent of [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.6099.230 Mobile Safari/537.36",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    ]) {
      const html = await tryFetch(url, agent);
      if (html) {
        const data = extractFromCheerio(html);
        if (data.title) results.push(data);
      }
    }

    // 3. CORS proxies
    for (const proxy of [
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?url=",
    ]) {
      const html = await tryFetch(proxy + encodeURIComponent(url));
      if (html) {
        const data = extractFromCheerio(html);
        if (data.title) results.push(data);
      }
    }

    // Merge best data from all successful attempts
    const merged = {
      title: "",
      description: "",
      price: 0,
      images: [] as string[],
      features: [] as string[],
    };

    for (const r of results) {
      if (r.title && r.title.length > merged.title.length) merged.title = r.title;
      if (r.description && r.description.length > merged.description.length) merged.description = r.description;
      if (r.price && (!merged.price || r.price > merged.price)) merged.price = r.price;
      if (r.images) r.images.forEach((img) => { if (!merged.images.includes(img)) merged.images.push(img); });
      if (r.features) r.features.forEach((f) => { if (!merged.features.includes(f)) merged.features.push(f); });
    }

    if (merged.title) {
      merged.images = merged.images.filter((u) => u.startsWith("http")).slice(0, 5);
      merged.features = merged.features.slice(0, 6);
      return NextResponse.json(merged);
    }

    return NextResponse.json(
      {
        error: "تعذر استيراد البيانات من الرابط. استخدمي الاستيراد السحري (بوكمارك) أعلاه.",
        bookmarklet: true,
      },
      { status: 422 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "خطأ في الاتصال — جربي الاستيراد السحري",
        bookmarklet: true,
      },
      { status: 422 }
    );
  }
}
