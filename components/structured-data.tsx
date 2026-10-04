import { PRICING, PRICING_BANDS, BAND_RANGE, SITE_ORIGIN } from "@/lib/site";

/**
 * The machine-readable version of the page, for Google.
 *
 * WHY THIS EXISTS. A crawler reads prose as prose. schema.org markup is the
 * one place you can state plainly "this is a company, in Bolton, selling this
 * product, at this price, to this country" — which is what decides whether the
 * brand gets an entity in Google's index rather than just a blue link.
 *
 * WHAT IS DELIBERATELY ABSENT, and why each one is a rule rather than an
 * oversight:
 *
 *   aggregateRating / review — CLAUDE.md forbids social proof, and there are
 *   no customers to rate anything. Invented ratings are also a manual action
 *   from Google, so this is not a corner anyone should cut later.
 *
 *   FAQPage — the page has an FAQ, but Google stopped showing FAQ rich results
 *   for ordinary commercial sites in 2023; it is markup that earns nothing.
 *   One of the answers also contradicts the Live badges above it, and marking
 *   up a claim that disagrees with its own page is worse than not marking it
 *   up at all. Revisit when that copy is settled.
 *
 *   Any compliance claim — ICO registration and the DPA are promised before a
 *   masjid is invoiced, not done. CLAUDE.md keeps them in the future tense and
 *   so does this.
 *
 * The prices come from lib/site.ts, the same constants the pricing cards use,
 * so the figure Google reads cannot drift from the figure on the page.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organisation`,
      name: "YSB Ventures Ltd",
      alternateName: "MasjidOne",
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/icon-512.png`,
      description:
        "YSB Ventures Ltd builds MasjidOne, a platform that runs a UK mosque's madrasah and its congregation on one system.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bolton",
        addressCountry: "GB",
      },
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: "MasjidOne",
      inLanguage: "en-GB",
      publisher: { "@id": `${SITE_ORIGIN}/#organisation` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_ORIGIN}/#product`,
      name: "MasjidOne",
      applicationCategory: "BusinessApplication",
      // Web only, stated honestly: a congregation app exists, but naming an
      // app store here would be a claim about a listing, not about software.
      operatingSystem: "Web browser",
      inLanguage: "en-GB",
      url: `${SITE_ORIGIN}/`,
      publisher: { "@id": `${SITE_ORIGIN}/#organisation` },
      description:
        "Mosque management software for UK masajid: madrasah registers and fees, prayer times, a congregation app, a managed website, prayer hall screens, and donations with Gift Aid at 0% commission — joined to one record of the same family.",
      featureList: [
        "Madrasah registers, drafted, submitted and locked",
        "Madrasah fees charged per family, with balances and reminders",
        "Prayer times and per-person jamāʿah reminders",
        "Managed mosque website",
        "Unlimited prayer hall screens",
        "Donations and Gift Aid at 0% commission",
        "Role-based committee access",
      ],
      offers: [
        {
          /* AggregateOffer, not Offer, and that is the point: the price is a
             range across four size bands, and stating one figure here while
             the page shows four would be the kind of mismatch a crawler is
             entitled to treat as a lie. lowPrice and highPrice are derived
             from PRICING_BANDS so they cannot drift from the cards. */
          "@type": "AggregateOffer",
          name: "Madrasah",
          description:
            "The madrasah portal and the parent portal: unlimited pupils and teachers, daily registers, and fees per family. Priced by the size of the madrasah.",
          lowPrice: BAND_RANGE.madrasah.from,
          highPrice: BAND_RANGE.madrasah.to,
          offerCount: PRICING_BANDS.length,
          priceCurrency: PRICING.currency,
          availability: "https://schema.org/InStock",
          eligibleRegion: { "@type": "Country", name: "United Kingdom" },
        },
        {
          /* AggregateOffer, not Offer, and that is the point: the price is a
             range across four size bands, and stating one figure here while
             the page shows four would be the kind of mismatch a crawler is
             entitled to treat as a lie. lowPrice and highPrice are derived
             from PRICING_BANDS so they cannot drift from the cards. */
          "@type": "AggregateOffer",
          name: "Masjid Complete",
          description:
            "Everything in Madrasah, plus the congregation app, the managed website, unlimited hall screens, and donations at 0% commission. Priced by the size of the madrasah.",
          lowPrice: BAND_RANGE.complete.from,
          highPrice: BAND_RANGE.complete.to,
          offerCount: PRICING_BANDS.length,
          priceCurrency: PRICING.currency,
          availability: "https://schema.org/InStock",
          eligibleRegion: { "@type": "Country", name: "United Kingdom" },
        },
        /* MasjidOne Safe (£25) is DELIBERATELY ABSENT, and leaving it out is
           the honest choice rather than an oversight. Every offer here carries
           availability: InStock, and Safe is not — it does not exist and
           cannot be bought until the launch date in MARTYNS_LAW. Publishing it
           would tell a crawler the range starts at 25 and that the thing is
           available now, which is two claims we cannot support. Add it on the
           day it ships, not before. */
        {
          "@type": "Offer",
          name: "Setup and migration",
          description:
            "Charged once at the start: your data imported, hall screens configured, committee and teachers trained. Waived on twelve months prepaid.",
          price: PRICING.setup,
          priceCurrency: PRICING.currency,
          availability: "https://schema.org/InStock",
          eligibleRegion: { "@type": "Country", name: "United Kingdom" },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      // The content is built from our own constants above — no user input
      // reaches it — and JSON.stringify escapes the strings.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
