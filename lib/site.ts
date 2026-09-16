/**
 * One place for the site's absolute identity. Canonical URL, Open Graph tags,
 * the sitemap and robots.txt all derive from here.
 *
 * Set NEXT_PUBLIC_SITE_URL as a repository variable when a custom domain is in
 * place. Until then the GitHub Pages project URL is correct.
 *
 * This lives in lib/ rather than app/layout.tsx because a Next layout may only
 * export a default component and a fixed set of known names — any other named
 * export fails the build with a type error.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yameenbux.github.io"
).replace(/\/+$/, "");

/** Origin plus any project-page base path, with no trailing slash. */
export const SITE_ORIGIN = `${SITE_URL}${BASE_PATH}`;

export { BASE_PATH };

/**
 * Every "Request a demo" on the site opens an email here — there is no contact
 * section and no form, so this is the only route in. It is still a placeholder:
 * until it is replaced, all six CTAs open a message to an address that does not
 * exist. One line to change, deliberately.
 */
export const CONTACT_EMAIL = "REPLACE-ME@masjidone.example";

/** mailto with the subject prefilled, for the demo CTAs. */
export const DEMO_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MasjidOne demo request")}`;
