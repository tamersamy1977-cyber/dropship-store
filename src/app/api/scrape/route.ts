import { NextResponse } from "next/server";

async function tryFetch(url: string, agent?: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": agent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
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

function extractData(html: string) {
  const getMeta = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m?.[1]?.trim() || "";
  };

  let title =
    getMeta(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
    getMeta(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i) ||
    getMeta(/<title[^>]*>([^<]+)<\/title>/i) ||
    "";

  let description =
    getMeta(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
    getMeta(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
    "";

  let price = 0;
  const pm =
    getMeta(/<meta\s+property="product:price:amount"\s+content="([^"]+)"/i) ||
    getMeta(/<meta\s+property="og:price:amount"\s+content="([^"]+)"/i);
  if (pm) price = parseFloat(pm) || 0;

  if (!price) {
    const patterns = [
      /["'](?:price|amount|salePrice)["']\s*[:=]\s*"?([\d.]+)"?/i,
      /data-price=["']([\d.]+)["']/i,
      /[\$\u00A3\u20AC]\s*([\d,]+\.?\d*)/,
      /([\d,]+\.?\d*)\s*(?:USD|EGP|جنية?)/,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) { price = parseFloat(m[1].replace(/,/g, "")) || 0; if (price > 0) break; }
    }
  }

  const images: string[] = [];
  const ogImg = getMeta(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogImg) images.push(ogImg);

  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1];
    if (src.startsWith("http") && images.length < 5 && !images.includes(src)) {
      images.push(src);
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
      if (!images.length && d.image) images.push(typeof d.image === "string" ? d.image : d.image[0]);
    } catch {}
  }

  const features: string[] = [];
  const liRegex = /<li[^>]*>([^<]{10,200})<\/li>/gi;
  while ((m = liRegex.exec(html)) !== null) {
    const t = m[1].replace(/<[^>]+>/g, "").trim();
    if (t.length > 10 && features.length < 6 && !features.includes(t)) features.push(t);
  }

  return {
    title: title.substring(0, 200) || "Unknown Product",
    description: description.substring(0, 1000),
    images: images.filter((u) => u.startsWith("http")).slice(0, 5),
    price: Math.round(price * 100) / 100,
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
    const pMatch = line.match(/^[^\d]*(\d+[.,]\d{2})/);
    if (!price && pMatch) {
      price = parseFloat(pMatch[1].replace(/,/g, "")) || 0;
    }
    const imgMatch = line.match(/!\[.*?\]\(([^)]+)\)/);
    if (imgMatch && images.length < 3) {
      images.push(imgMatch[1]);
    }
  }

  // Find a longer paragraph for description
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
      if (text.length > 10 && features.length < 6) features.push(text);
    }
  }

  return { title, description, price, images, features };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL مطلوب" }, { status: 400 });

    // 1. Try Jina AI Reader (bypasses Cloudflare, works with most sites)
    const jinaText = await tryJina(url);
    if (jinaText) {
      const data = extractFromMarkdown(jinaText);
      if (data.title) {
        return NextResponse.json(data);
      }
    }

    // 2. Try direct fetch with different user agents
    for (const agent of [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.6099.230 Mobile Safari/537.36",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ]) {
      const html = await tryFetch(url, agent);
      if (html) {
        const data = extractData(html);
        if (data.title) return NextResponse.json(data);
      }
    }

    // 3. Fallback: CORS proxies
    const proxies = [
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?url=",
    ];
    for (const proxy of proxies) {
      const html = await tryFetch(proxy + encodeURIComponent(url));
      if (html) {
        const data = extractData(html);
        if (data.title) return NextResponse.json(data);
      }
    }

    return NextResponse.json({
      error: "تعذر استيراد البيانات من الرابط. استخدمي الاستيراد السحري (بوكمارك) أعلاه.",
      bookmarklet: true,
    }, { status: 422 });
  } catch {
    return NextResponse.json({
      error: "خطأ في الاتصال — جربي الاستيراد السحري",
      bookmarklet: true,
    }, { status: 422 });
  }
}
