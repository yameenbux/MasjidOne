import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * With `output: 'export'` Next writes this to out/sitemap.xml at build time.
 * Every route on the site is listed; there are only four.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_ORIGIN}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_ORIGIN}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
