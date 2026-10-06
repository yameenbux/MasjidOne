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
 * The inbox a demo request lands in, and the address printed wherever the site
 * offers one. Live since 4 October 2026.
 *
 * `info@` rather than `hello@` or `enquiries@` because it is the convention a
 * UK mosque committee already expects, and this is not a product that benefits
 * from sounding like a startup.
 *
 * Setting this is what switches on the contact line, the privacy policy's
 * subject-access route and the terms' contact section — all three read
 * CONTACT_READY, which derives from it.
 */
export const CONTACT_EMAIL = "info@masjidone.co.uk";

/**
 * Where a masjid that is already a customer goes when something is wrong.
 *
 * Separate from CONTACT_EMAIL from the first day, which costs nothing now and
 * saves changing every document later: when support becomes somebody else's
 * job it becomes their mailbox, and no contract, leaflet or screen has to
 * change to follow it.
 */
export const SUPPORT_EMAIL = "support@masjidone.co.uk";

/**
 * Where a subject access request goes. Split from CONTACT_EMAIL on 4 October
 * 2026, the day the alias was created.
 *
 * It forwards to the general inbox today, so nothing is read in two places —
 * but the legal pages name their own address, which means the day a request
 * needs routing, filtering or handing to somebody else, that happens at the
 * mail host and no page changes. A request under UK GDPR carries a one-month
 * statutory deadline; it should be separable from demo enquiries by then,
 * not after.
 */
export const PRIVACY_EMAIL = "privacy@masjidone.co.uk";

/**
 * The phone number on the contact page. Mosque committees ring rather than
 * write, so this is not decoration — for a good half of them it is the only
 * channel they will use. Empty string hides the line entirely rather than
 * printing a placeholder a committee might actually dial.
 */
export const CONTACT_PHONE = "+44 7466 487591";

/** `+441234 567890` -> `+441234567890`, which is what a tel: href needs. */
export const CONTACT_PHONE_HREF = CONTACT_PHONE.replace(/[^+\d]/g, "");

/** True once CONTACT_EMAIL is a real address rather than the placeholder. */
export const CONTACT_READY = !CONTACT_EMAIL.endsWith("@masjidone.example");

/**
 * Where the demo request form POSTs.
 *
 * Deliberately an environment variable rather than a constant, because the
 * decision behind it is a hosting decision and has not been taken yet:
 *
 *   unset  — the form falls back to the visitor's own email client, carrying
 *            every answer prefilled in the body. No third party, no account,
 *            works today. The cost is that the visitor has to press send in
 *            their own mail app, and some will not.
 *   set    — the form POSTs there and the visitor never leaves the page. Any
 *            endpoint that accepts a form POST will do (Formspree and the like,
 *            or a Cloudflare Worker on a subdomain once one exists).
 *
 * Switching is a repository variable, not a code change, so the form does not
 * have to be rewritten the day the endpoint is chosen. Whatever is chosen has
 * to be named in the privacy policy as a processor before it goes live.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

/**
 * Where the Martyn's Law interest form posts. Derived from FORM_ENDPOINT so
 * there is one repository variable to set rather than two that can disagree —
 * the same Worker answers both paths.
 *
 * Falsy until the Worker is deployed, exactly like FORM_ENDPOINT, and the form
 * reads it the same way: empty means hand the answers to the visitor's own
 * mail client instead.
 */
export const INTEREST_ENDPOINT = FORM_ENDPOINT
  ? FORM_ENDPOINT.replace(/\/demo-request\/?$/, "") + "/martyns-law-interest"
  : "";

/**
 * Martyn's Law — the Terrorism (Protection of Premises) Act 2025.
 *
 * THE FIGURES AND DATES LIVE HERE AND NOWHERE ELSE, for the same reason the
 * pricing bands do: a number typed into prose is one the compiler cannot
 * check, and this page carries both a price and a commencement date that will
 * move. Grep for the £ sign after changing anything here.
 *
 * NOTHING IN THIS MODULE IS BUILT YET. The page says so in those words, the
 * pricing line is dated rather than present tense, and the plan below is NOT
 * in PRICING_BANDS — it must not reach the pricing cards or the structured
 * data as though a masjid could buy it today.
 */
export const MARTYNS_LAW = {
  /** Standalone plan, decided 4 October 2026. Monthly, like the others. */
  price: 25,
  /** When the tools are expected to be usable. Not when the law lands. */
  launch: "February 2027",
  /**
   * The Act had Royal Assent on 3 April 2025 with an implementation period the
   * Home Office has said will be AT LEAST 24 months. So this is an
   * expectation, not a date in the Act, and the copy must keep the hedge —
   * "expected in 2027", never "from April 2027".
   */
  expectedInForce: "2027",
  /** Standard tier applies where at least this many people may be present. */
  standardTierFrom: 200,
} as const;

/** The single destination for every "Request a demo" on the site. */
export const DEMO_HREF = "/request-a-demo/";

/** A plain mailto, for the places that offer the email itself as a courtesy. */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MasjidOne demo request")}`;

/* THE PRICES LIVE IN lib/pricing-bands.ts and are re-exported here, so that
   every page's existing `@/lib/site` import is unchanged. They moved because
   the edge function that drives Stripe must charge the same figures and cannot
   read this file — the reason is in that file's header. Do not re-declare them
   here. */
export {
  PRICING,
  PRICING_BANDS,
  DEFAULT_BAND,
  BAND_RANGE,
  yearlyTotal,
} from "./pricing-bands";
export type { PricingBand } from "./pricing-bands";

/**
 * The Open Graph block for one page.
 *
 * Next REPLACES `openGraph` rather than merging it, so a page that sets only
 * `url` silently drops the site name, the locale and the card image — the share
 * card loses its picture, which is most of the point of a share card. Every
 * page therefore builds its whole block from here.
 *
 * `title` and `description` are left out on purpose: with them absent Next
 * falls back to the page's own title and description, which is what a shared
 * module page should say. The home page passes its own, because its social copy
 * is deliberately not its search copy.
 */
export function openGraphFor(
  path: string,
  overrides?: { title?: string; description?: string },
) {
  return {
    type: "website" as const,
    siteName: "MasjidOne",
    locale: "en_GB",
    url: path,
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "MasjidOne — the madrasah and the congregation, on one system",
      },
    ],
    ...overrides,
  };
}
