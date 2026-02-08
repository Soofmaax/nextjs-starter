import { NextResponse } from "next/server";
import { BASE_URL } from "@/config/site";
import { getPagesIndex, getPostsIndex } from "@/lib/content";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [pagesIndex, postsIndex] = await Promise.all([
    getPagesIndex(),
    getPostsIndex(),
  ]);

  const urls: string[] = [];

  for (const record of pagesIndex) {
    if (record.type === "page" || record.type === "category") {
      const url = record.url.startsWith("http")
        ? record.url
        : `${BASE_URL}${record.url}`;
      urls.push(url);
    }
  }

  for (const post of postsIndex) {
    const url = post.url || `${BASE_URL}/${post.slug}`;
    urls.push(url);
  }

  const uniqueUrls = Array.from(new Set(urls));

  const urlset = uniqueUrls
    .map((loc) => {
      const escapedLoc = escapeXml(loc);
      return `  <url>\n    <loc>${escapedLoc}</loc>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
