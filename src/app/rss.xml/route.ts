import { BASE_URL, siteConfig } from "@/config/site";
import { getPostsIndex } from "@/lib/content";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPostsIndex();

  const items = posts
    .map((post) => {
      const title = post.title ? escapeXml(post.title) : "";
      const description = post.metaDescription
        ? escapeXml(post.metaDescription)
        : "";
      const link = post.url || `${BASE_URL}/${post.slug}`;
      const pubDate = post.date
        ? new Date(post.date).toUTCString()
        : null;

      return `  <item>\n    <title>${title}</title>\n    <link>${escapeXml(
        link,
      )}</link>\n    <guid isPermaLink="true">${escapeXml(
        link,
      )}</guid>\n    <description>${description}</description>\n${
        pubDate ? `    <pubDate>${escapeXml(pubDate)}</pubDate>\n` : ""
      }  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(
      siteConfig.name,
    )}</title>\n    <link>${escapeXml(BASE_URL)}</link>\n    <description>${escapeXml(
      siteConfig.description,
    )}</description>\n${items}\n  </channel>\n</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
