import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * Written to out/robots.txt at build time. The marketing copy is all public,
 * so only /demo/ is held back: it is a sales demonstration with a sign-in box
 * that authenticates nothing, and it has no business ranking for the brand
 * name. app/demo/layout.tsx also sends noindex, and app/sitemap.ts lists its
 * routes by hand, so the route is excluded three ways.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/demo/", "/admin/"] }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
