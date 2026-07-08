import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    const html = await res.text();
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
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    const images: string[] = [];
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) images.push(ogImage);
    $('meta[property="og:image:secure_url"]').each((_, el) => {
      const src = $(el).attr("content");
      if (src && !images.includes(src)) images.push(src);
    });
    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (src && src.startsWith("http") && images.length < 5 && !images.includes(src)) {
        images.push(src);
      }
    });

    let price = 0;
    const priceMeta =
      $('meta[property="product:price:amount"]').attr("content") ||
      $('meta[property="og:price:amount"]').attr("content");
    if (priceMeta) price = parseFloat(priceMeta) || 0;

    if (!price) {
      const priceText = $('[class*="price"]').first().text().trim();
      const match = priceText.match(/[\d,.]+/);
      if (match) price = parseFloat(match[0].replace(/,/g, "")) || 0;
    }

    const features: string[] = [];
    $("li, .feature, [class*='feature'], .bullet").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 10 && text.length < 200 && features.length < 8) {
        features.push(text);
      }
    });

    return NextResponse.json({
      title: title.substring(0, 200),
      description: description.substring(0, 1000),
      images,
      price,
      features: features.slice(0, 6),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not fetch product data. Try pasting details manually." },
      { status: 422 }
    );
  }
}
