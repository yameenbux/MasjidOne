/**
 * THE PRICES. This file is the only place they are written down.
 *
 * WHY THEY LIVE HERE, under an Edge Function, rather than in lib/ with the
 * rest of the site's code. Two runtimes need these figures: the pricing page,
 * which renders them, and this function, which charges them. Of the two, the
 * function has the tighter constraint — a deployed Edge Function bundle is an
 * explicit list of files and cannot reach outside itself, so an import of
 * ../../../lib/anything is not deployable.
 *
 * So the data sits where the stricter runtime can reach it, and lib/pricing-bands.ts
 * re-exports from here. Every `@/lib/site` import across the site is unchanged.
 *
 * KEEP IT FREE OF IMPORTS AND ENVIRONMENT. It is read by Deno and by Next, and
 * the moment it needs anything from either one, the other cannot read it and a
 * second copy of the price list comes back — which is exactly how a masjid
 * ends up charged last quarter's figure.
 */

/**
 * The figures that do not vary by band.
 *
 * The invariant still holds and is the reason the yearly total is derived
 * rather than typed: MasjidOne never discounts the monthly, it waives the setup
 * fee. Twelve months is twelve times the monthly rate for the masjid's own
 * band, whatever that band is. The setup fee is the only figure that falls,
 * £499 -> £0.
 */
export const PRICING = {
  setup: 499,
  currency: "GBP",
} as const;



/**
 * The published prices, banded by the size of the madrasah.
 *
 * ADOPTED 4 October 2026, replacing a single flat rate. Reason, in one line:
 * every credible competitor prices by student count and a flat rate on a market
 * with a tenfold spread in institution size is wrong at both ends at once — it
 * overcharged the small maktab, which is the segment with the most prospects,
 * and undercharged the large madrasah. The entry price went DOWN.
 *
 * A band is NOT per-pupil pricing. Per-pupil means the bill moves every time a
 * child joins or leaves; a band means one number for the whole size range, and
 * it only changes when the madrasah crosses a threshold at renewal. That
 * distinction is the whole argument, because the current page sells flat
 * pricing as a virtue ("no per-pupil maths") and a committee will test it.
 *
 * Levels set against the verified competitive set, 2 October 2026 — see
 * founder/price-pressure-test-2026-10-02.md. The entry band goes DOWN, not up:
 * a 60-pupil maktab paid £79 here against £15-£59 elsewhere.
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

/**
 * The span of a plan across every band, for the places that quote a range
 * rather than one figure — the module pages and the structured data Google
 * reads. Derived, never typed, so it cannot drift from PRICING_BANDS.
 *
 * There is deliberately no `PRICING.madrasah` scalar any more. A single number
 * is exactly the thing that is no longer true, and leaving one in place would
 * let a page quietly print it as though it were the price.
 */
export const BAND_RANGE = {
  madrasah: {
    from: Math.min(...PRICING_BANDS.map((b) => b.madrasah)),
    to: Math.max(...PRICING_BANDS.map((b) => b.madrasah)),
  },
  complete: {
    from: Math.min(...PRICING_BANDS.map((b) => b.complete)),
    to: Math.max(...PRICING_BANDS.map((b) => b.complete)),
  },
} as const;

/** Twelve months at the same monthly rate. Not a cheaper rate — the same one. */
export function yearlyTotal(monthlyPounds: number): number {
  return monthlyPounds * 12;
}

/* Read by two things, deliberately: this function, which imports it directly
   and charges these figures; and every page, through lib/pricing-bands.ts and
   then lib/site.ts, which re-export all of the above. */
