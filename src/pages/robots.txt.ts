import type { APIRoute } from "astro";
import { AI_CRAWLERS, SITE_URL } from "../config";

export const GET: APIRoute = () => {
  const allowAi = AI_CRAWLERS.map((bot) => `User-agent: ${bot}\nAllow: /`).join("\n\n");

  const body = `# ShopEye — robots.txt
# We explicitly welcome AI answer engines so we can be cited (AEO/GEO/LLMO).

User-agent: *
Allow: /

${allowAi}

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
