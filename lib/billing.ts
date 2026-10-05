/**
 * Turning a plan and a band into the lines of an invoice.
 *
 * WHY THIS FILE EXISTS AT ALL. The database holds an invoice ledger — raise,
 * send, record payment, void — and it deliberately does not know what anything
 * costs. `invoice_raise` takes the amount as an argument and refuses a line
 * without one, saying so in the error: amounts come from PRICING_BANDS, not
 * from Postgres.
 *
 * That is the standing rule kept intact, and the distinction is worth stating
 * because it looks like a loophole:
 *
 *   * A PRICE LIST says what a band costs TODAY. That is PRICING_BANDS in
 *     lib/site.ts, and it stays the single source.
 *   * AN INVOICE records what was charged ON A DATE. That is a historical fact
 *     and a legal document, and it must not move when the price list does.
 *
 * So this module is the ONLY bridge between the two, and it only ever runs at
 * the moment an invoice is raised. Nothing reads back through it.
 *
 * EVERYTHING HERE IS IN PENCE. The price list is in whole pounds because that
 * is how the pricing page quotes it; the database is in pence because every
 * other amount in that schema is, and because floating-point pounds is how a
 * billing system ends up a penny out on a hundredth invoice. The conversion
 * happens once, here, with integer arithmetic.
 */

import { PRICING, PRICING_BANDS } from "@/lib/site";

export type PlanCode = "madrasah" | "complete";
export type BandId = (typeof PRICING_BANDS)[number]["id"];

/** A line as `invoice_raise` wants it: description, quantity, unit in pence. */
export type InvoiceLine = {
  description: string;
  qty?: number;
  unit_amount_p: number;
};

/** Pounds to pence. Rounded, not truncated, and never via a float multiply. */
export function pence(pounds: number): number {
  return Math.round(pounds * 100);
}

/** £269.00, or £269 when it is a whole number of pounds. */
export function money(p: number): string {
  const neg = p < 0;
  const abs = Math.abs(p);
  const whole = Math.floor(abs / 100);
  const part = abs % 100;
  const body =
    part === 0
      ? `£${whole.toLocaleString("en-GB")}`
      : `£${whole.toLocaleString("en-GB")}.${String(part).padStart(2, "0")}`;
  return neg ? `−${body}` : body;
}

/**
 * The monthly rate for a plan and band, in pence.
 *
 * Returns null rather than a number when the band is unknown — including when
 * it is null, which is what a masjid onboarded before bands existed looks
 * like. A null here must stop an invoice being raised; guessing a band would
 * mean guessing a price, and guessing high or low are both wrong in ways a
 * committee notices.
 */
export function monthlyPence(plan: string | null, band: string | null): number | null {
  if (plan !== "madrasah" && plan !== "complete") return null;
  const row = PRICING_BANDS.find((b) => b.id === band);
  if (!row) return null;
  return pence(row[plan]);
}

/** The one-off setup fee, in pence. The only figure that is ever waived. */
export function setupPence(): number {
  return pence(PRICING.setup);
}

export function planName(plan: string | null): string {
  if (plan === "complete") return "Masjid Complete";
  if (plan === "madrasah") return "Madrasah";
  return plan ?? "no plan";
}

export function bandLabel(band: string | null): string {
  return PRICING_BANDS.find((b) => b.id === band)?.label ?? "no band";
}

/** "November 2026", for an invoice line a treasurer has to recognise. */
function monthLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The period a monthly or yearly invoice should cover, starting from a date. */
export function periodFrom(startIso: string, cycle: "monthly" | "yearly") {
  const start = new Date(startIso + "T00:00:00Z");
  const end = new Date(start);
  if (cycle === "yearly") end.setUTCFullYear(end.getUTCFullYear() + 1);
  else end.setUTCMonth(end.getUTCMonth() + 1);
  /* The period ends the day BEFORE the next one starts, so two consecutive
     invoices cannot both claim the same day. */
  end.setUTCDate(end.getUTCDate() - 1);
  return { start: startIso, end: end.toISOString().slice(0, 10) };
}

/**
 * The lines for one period's invoice.
 *
 * THE YEARLY INVARIANT IS ARITHMETIC, AND IT IS ENFORCED HERE. A year is
 * twelve times the monthly rate for that masjid's own band — never less.
 * MasjidOne does not discount the monthly; it waives the setup fee. So a
 * yearly invoice is `monthly x 12`, and the only thing that falls is the
 * £499, to £0. Writing it as a quantity of twelve rather than a separate
 * "annual price" is what makes that impossible to get wrong by typing.
 */
export function invoiceLines(opts: {
  plan: string | null;
  band: string | null;
  cycle: "monthly" | "yearly";
  periodStart: string;
  periodEnd: string;
  /** Add the one-off fee. Ignored when the fee is already waived or paid. */
  includeSetup: boolean;
}): { lines: InvoiceLine[]; problem: string | null } {
  const monthly = monthlyPence(opts.plan, opts.band);
  if (monthly === null) {
    return {
      lines: [],
      problem:
        `No price can be worked out for ${planName(opts.plan)} on ` +
        `"${opts.band ?? "no band"}". Set the plan and band first — an invoice ` +
        `with a guessed figure is worse than no invoice.`,
    };
  }

  const lines: InvoiceLine[] = [];

  if (opts.cycle === "yearly") {
    lines.push({
      description:
        `${planName(opts.plan)} — twelve months from ${monthLabel(opts.periodStart)} ` +
        `(${money(monthly)} a month)`,
      qty: 12,
      unit_amount_p: monthly,
    });
  } else {
    lines.push({
      description: `${planName(opts.plan)} — ${monthLabel(opts.periodStart)}`,
      unit_amount_p: monthly,
    });
  }

  /* Prepaying twelve months waives the setup fee. That is the rule, so the
     yearly branch never adds it rather than adding it and discounting it —
     a waiver and a discount are different things on an invoice. */
  if (opts.includeSetup && opts.cycle !== "yearly") {
    lines.push({
      description: "Setup — one-off",
      unit_amount_p: setupPence(),
    });
  }

  return { lines, problem: null };
}

/** What the lines come to, so a screen can show the figure before sending. */
export function linesTotal(lines: InvoiceLine[]): number {
  return lines.reduce((n, l) => n + (l.qty ?? 1) * l.unit_amount_p, 0);
}
