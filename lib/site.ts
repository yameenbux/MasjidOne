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
 * The inbox a demo request lands in. STILL A PLACEHOLDER: until it is replaced,
 * the form below has nowhere to deliver and every route in is dead. One line.
 */
export const CONTACT_EMAIL = "REPLACE-ME@masjidone.example";

/**
 * The phone number on the contact page. Mosque committees ring rather than
 * write, so this is not decoration — for a good half of them it is the only
 * channel they will use. Empty string hides the line entirely rather than
 * printing a placeholder a committee might actually dial.
 */
export const CONTACT_PHONE = "";

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

/** The single destination for every "Request a demo" on the site. */
export const DEMO_HREF = "/request-a-demo/";

/** A plain mailto, for the places that offer the email itself as a courtesy. */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MasjidOne demo request")}`;

/**
 * The published prices. One source, because three places quote them — the
 * pricing cards, the structured data Google reads, and the comparison copy —
 * and a figure that drifts between them is a figure a committee can catch.
 *
 * CLAUDE.md states the invariant: MasjidOne never discounts the monthly, it
 * waives the setup fee. So the twelve-month figure is derived here rather than
 * typed, and cannot quietly become a discount. £79 -> £948, £179 -> £2,148.
 * The setup fee is the only figure that actually falls, £499 -> £0.
 */
export const PRICING = {
  madrasah: 79,
  complete: 179,
  setup: 499,
  currency: "GBP",
} as const;

/**
 * PREVIEW ONLY — banded pricing, not yet adopted.
 *
 * A band is NOT per-pupil pricing. Per-pupil means the bill moves every time a
 * child joins or leaves; a band means one number for the whole size range, and
 * it only changes when the madrasah crosses a threshold at renewal. That
 * distinction is the whole argument, because the current page sells flat
 * pricing as a virtue ("no per-pupil maths") and a committee will test it.
 *
 * Levels set against the verified competitive set, 2 October 2026 — see
 * founder/price-pressure-test-2026-10-02.md. The entry band goes DOWN, not up:
 * a 60-pupil maktab currently pays £79 here against £15-£59 elsewhere.
 */
export const PRICING_BANDS = [
  { id: "a", label: "Up to 100", short: "≤100",     madrasah: 49,  complete: 119 },
  { id: "b", label: "101 to 250", short: "101–250", madrasah: 79,  complete: 169 },
  { id: "c", label: "251 to 500", short: "251–500", madrasah: 119, complete: 219 },
  { id: "d", label: "Over 500",  short: "500+",     madrasah: 159, complete: 269 },
] as const;

export type PricingBand = (typeof PRICING_BANDS)[number];

/** The band a visitor sees first. The commonest UK madrasah size. */
export const DEFAULT_BAND = "b";

/** Twelve months at the same monthly rate. Not a cheaper rate — the same one. */
export function yearlyTotal(monthlyPounds: number): number {
  return monthlyPounds * 12;
}

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
