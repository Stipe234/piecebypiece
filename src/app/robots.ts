import type { MetadataRoute } from "next";

const SITE_URL = "https://www.piecebypiecewear.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/owner", "/owner/", "/checkout/success", "/checkout/cancel"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: "/",
        disallow: ["/api/", "/owner", "/checkout/"],
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: "/",
        disallow: ["/api/", "/owner", "/checkout/"],
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: "/",
        disallow: ["/api/", "/owner", "/checkout/"],
      },
      {
        userAgent: ["Google-Extended", "Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: ["/api/", "/owner", "/checkout/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
