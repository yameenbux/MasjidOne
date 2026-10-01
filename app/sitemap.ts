import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * With `output: 'export'` Next writes this to out/sitemap.xml at build time.
 * Every indexable route is listed. The demo screens are deliberately absent —
 * they are a sales tool, not a page worth ranking.
 */
export const dynamic = "force-static";

/**
 * `lastModified` is the date of the last commit, not `new Date()`.
 *
 * With a build date, every deploy restamps every URL as freshly modified —
 * including the privacy policy nobody touched. A crawler that is told three
 * pages changed and finds three pages that did not learns to discount the
 * signal. The commit date is set by the deploy workflow; without it the field
 * is omitted entirely, which is better than a date that is wrong.
 */
const LAST_COMMIT = process.env.NEXT_PUBLIC_COMMIT_DATE;
const lastModified = LAST_COMMIT ? new Date(LAST_COMMIT) : undefined;

/** The module pages, in the order they are worth crawling. */
const MODULES = [
  "madrasah-software",
  "mosque-prayer-times-screens",
  "mosque-app",
  "mosque-website",
  "mosque-donations",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_ORIGIN}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    /* The one conversion on the site, so it outranks the module pages. */
    { url: `${SITE_ORIGIN}/request-a-demo/`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...MODULES.map((slug) => ({
      url: `${SITE_ORIGIN}/${slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_ORIGIN}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_ORIGIN}/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
