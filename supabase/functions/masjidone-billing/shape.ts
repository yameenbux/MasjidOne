// ===========================================================================
//  shape.ts — the arithmetic and the encoding, separated so they can be tested
//
//  WHY THIS IS ITS OWN FILE, and the precedent is giftaid.ts in the masjid's
//  repository: that file decides whether 25p in the pound is claimed, so it
//  was made pure and testable without a Stripe account, a card or a webhook
//  delivery. The same argument applies here with the sign reversed — this code
//  decides what a masjid is CHARGED.
//
//  Two things in particular cannot be eyeballed:
//
//  1. THE FORM ENCODER. Stripe's API is form-encoded nested keys,
//     line_items[0][price_data][unit_amount]=26900. Get the nesting wrong and
//     Stripe does not complain about the key it did not recognise — it creates
//     a subscription without it. A missing unit_amount is not an error, it is
//     a different price.
//
//  2. THE YEARLY INVARIANT. A year is twelve times the monthly rate for that
//     masjid's own band, never a cheaper rate; the only thing that falls is
//     the setup fee, and it falls to nothing rather than being reduced. That
//     is a commercial rule, it is asserted here, and it is the kind of rule
//     that gets quietly broken by somebody being helpful.
// ===========================================================================

import { PRICING, PRICING_BANDS } from "../../../lib/pricing-bands.ts";

export type Cycle = "monthly" | "yearly";

/** Pounds to pence. Rounded, never a float multiply left lying around. */
export function pence(pounds: number): number {
  return Math.round(pounds * 100);
}

/**
 * The monthly rate for a plan and band, in pence, or null.
 *
 * Null rather than a guess. A masjid onboarded before bands existed has no
 * band, and charging it the middle one because that seemed reasonable is how
 * a committee finds a figure nobody chose on their bank statement.
 */
export function monthlyPence(plan: string | null, band: string | null): number | null {
  if (plan !== "madrasah" && plan !== "complete") return null;
  const row = PRICING_BANDS.find((b) => b.id === band);
  if (!row) return null;
  return pence(row[plan]);
}

export function planName(plan: string | null): string {
  if (plan === "complete") return "Masjid Complete";
  if (plan === "madrasah") return "Madrasah";
  return String(plan);
}

const money = (p: number) => `£${(p / 100).toFixed(2)}`;

export type CheckoutLine = {
  quantity: number;
  price_data: {
    currency: string;
    unit_amount: number;
    recurring?: { interval: "month" | "year" };
    product_data: { name: string; description?: string };
  };
};

/**
 * The Checkout line items for one masjid.
 *
 * The recurring line is the plan. The setup fee is a SECOND, non-recurring
 * line added only when it is still due AND the cycle is monthly: twelve months
 * prepaid waives it, and a waiver means the line is absent, not reduced.
 */
export function checkoutLines(opts: {
  plan: string | null;
  band: string | null;
  cycle: Cycle;
  setupFeeState: string | null;
}): { lines: CheckoutLine[]; monthly: number | null } {
  const monthly = monthlyPence(opts.plan, opts.band);
  if (monthly === null) return { lines: [], monthly: null };

  const currency = String(PRICING.currency).toLowerCase();
  const yearly = opts.cycle === "yearly";

  const lines: CheckoutLine[] = [{
    quantity: 1,
    /* monthly * 12, written as a multiplication rather than as a second
       figure, so that a discount cannot be introduced by typing one. */
    price_data: {
      currency,
      unit_amount: yearly ? monthly * 12 : monthly,
      recurring: { interval: yearly ? "year" : "month" },
      product_data: {
        name: `MasjidOne — ${planName(opts.plan)}`,
        description: yearly
          ? `Twelve months at ${money(monthly)} a month`
          : `${money(monthly)} a month`,
      },
    },
  }];

  if (!yearly && opts.setupFeeState === "due") {
    lines.push({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: pence(PRICING.setup),
        product_data: { name: "MasjidOne — setup, one-off" },
      },
    });
  }

  return { lines, monthly };
}

/**
 * Stripe's form encoding: nested objects and arrays become bracketed keys.
 *
 * Null and undefined are DROPPED rather than sent as the strings "null" and
 * "undefined", which is what String(v) would do and which Stripe would store.
 */
export function form(obj: unknown, prefix = "", out = new URLSearchParams()): URLSearchParams {
  if (obj === null || obj === undefined) return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => form(v, `${prefix}[${i}]`, out));
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v === undefined || v === null) continue;
      form(v, prefix ? `${prefix}[${k}]` : k, out);
    }
  } else {
    out.append(prefix, String(obj));
  }
  return out;
}

/**
 * A failure no amount of retrying will change.
 *
 * Matched on what the database said, because the database is the thing that
 * knows. Anything not in this list is treated as transient and Stripe is asked
 * to try again — which is the safer default: a retried success is harmless
 * because every handler is idempotent, while a permanently-closed event that
 * was only transiently broken is a payment nobody ever hears about again.
 */
const PERMANENT = [
  "no masjid is linked",
  "still a draft",
  "has no number",
  "has no lines",
  "no unit amount",
  "has no word for",
  "there is no masjid called",
  /* 142. A dispute that matches no invoice will not match one tomorrow
     either, and the money has already gone — so it is closed WITH the reason
     written against the event, rather than retried for three days and then
     left silently unhandled. Somebody has to read it either way; this way the
     row says what happened. */
  "matches nothing",
  "has to name the payment",
];

export function isPermanent(message: string): boolean {
  const m = String(message ?? "").toLowerCase();
  return PERMANENT.some((p) => m.includes(p));
}
