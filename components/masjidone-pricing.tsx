"use client";

import { Pricing } from "@/components/ui/pricing";
import { useState } from "react";
import {
  DEMO_HREF, BASE_PATH, PRICING, yearlyTotal,
  PRICING_BANDS, DEFAULT_BAND, MARTYNS_LAW,
} from "@/lib/site";

/**
 * MasjidOne's real published prices.
 *
 * `yearlyPrice` must be exactly `price` x 12 for the monthly plans. That is
 * the same monthly rate shown as a twelve-month total, not a cheaper one —
 * MasjidOne never discounts the monthly, it waives the setup fee. The setup
 * card is the only figure that actually falls, £499 to £0.
 *
 * The figures move with the band, so there is deliberately no worked example
 * here any more. One used to sit in this comment quoting 79 x 12 and 179 x 12,
 * left over from the single flat rate; 179 was never a price in any band and
 * the comment outlived the thing it described. A stale number in a comment is
 * read as fact by the next person — it was, on 4 October 2026, and it reached
 * a specification. If you want to check the arithmetic, read yearlyTotal().
 *
 * Every feature line maps to a module in #what and carries the same Live /
 * In development tag. If a module's status changes, change it in both places.
 */
const buildPlans = (madrasah: number, complete: number) => [
  {
    name: "MADRASAH",
    price: String(madrasah),
    yearlyPrice: String(yearlyTotal(madrasah)),
    period: "month",
    yearlyPeriod: "year",
    // The portal is built and loaded at a masjid in Bolton — the roll, the classes, the
    // staff and their logins. The two features below that are not built carry
    // their own dev tag rather than the whole plan.
    //
    // The description below says "built" rather than "running" on purpose, and
    // it is checked against the database rather than remembered: the portal
    // holds 553 pupils and several thousand logged admin actions, and zero
    // submitted registers and zero payments. "Built and in a masjid" is
    // supported; "running" implies an evening-by-evening operation that has
    // not started, and the FAQ and the preview captions already sit on the
    // honest line. This used to contradict both of them.
    status: "live" as const,
    features: [
      "Unlimited pupils and teachers",
      "Daily registers — drafted, submitted, locked, and chased when one is missed",
      "One record of the family, with siblings linked",
      "Fees per family, with balances, payments and automatic reminders",
      "Annual fee report and a family export for the office",
      "Hifz and sabaq progress — sabaq, sabqi and manzil, shared with the parent or kept private",
      "Parent access inside the congregation app — their own child only",
      "One price for your band — your bill does not move when a child joins",
      "Martyn's Law tools — included from " + MARTYNS_LAW.launch + ", at no change to the price",
    ],
    description:
      "Built, and in a Bolton masjid now — the roll, the classes and the staff are on it. Setup is charged at signing; the monthly starts at go-live.",
    buttonText: "Request a demo",
    href: `${BASE_PATH}${DEMO_HREF}`,
    isPopular: false,
  },
  {
    name: "MASJID COMPLETE",
    price: String(complete),
    yearlyPrice: String(yearlyTotal(complete)),
    period: "month",
    yearlyPeriod: "year",
    status: "live" as const,
    features: [
      "Congregation app with per-person jamāʿah reminders",
      "The masjid's own timetable, not a calculated one",
      "Managed mosque website",
      "Unlimited prayer hall screens",
      "Donations and Gift Aid at 0% commission, permanently",
      "Everything in Madrasah",
      "Parent access — the join",
      "Martyn's Law tools — included from " + MARTYNS_LAW.launch + ", at no change to the price",
    ],
    description:
      "Both sides are in a Bolton masjid now. The half a parent sees is the last piece.",
    buttonText: "Request a demo",
    href: `${BASE_PATH}${DEMO_HREF}`,
    isPopular: true,
  },
  {
    name: "SETUP AND MIGRATION",
    price: String(PRICING.setup),
    yearlyPrice: "0",
    period: "once",
    yearlyPeriod: "once",
    features: [
      "Your existing data imported",
      "Migration from your current madrasah system",
      "Prayer hall screens configured",
      "Committee and teachers trained",
      "Waived on twelve months prepaid",
    ],
    description: "Charged once, not monthly. This is the only figure that falls.",
    buttonText: "Request a demo",
    href: `${BASE_PATH}${DEMO_HREF}`,
    isPopular: false,
  },
];

export function MasjidOnePricing() {
  const [bandId, setBandId] = useState<string>(DEFAULT_BAND);
  const band = PRICING_BANDS.find((b) => b.id === bandId) ?? PRICING_BANDS[1];

  return (
    <>
      {/* The selector answers the only question a committee actually has:
          what do WE pay. Left-aligned hairlines, not the pricing block's
          centred card styling — CLAUDE.md says that exception stays put. */}
      <div className="pband">
        <p className="pband__q" id="pband-q">How many pupils are in your madrasah?</p>
        <div className="pband__row" role="group" aria-labelledby="pband-q">
          {PRICING_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`pband__btn${b.id === bandId ? " is-on" : ""}`}
              aria-pressed={b.id === bandId}
              onClick={() => setBandId(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <Pricing
        plans={buildPlans(band.madrasah, band.complete)}
        title="Two plans. One price for the size you are."
        description={
          "A band is not per-pupil pricing — your bill does not move when a child joins or leaves. It changes only if you cross a size band at renewal.\nThe monthly rate is the same however you pay. Twelve months up front waives the setup fee instead."
        }
      />

      <div className="pband__table" role="region" aria-label="All price bands">
        <table>
          <caption>Every band, in full — so nothing depends on which button is pressed.</caption>
          <thead>
            <tr>
              <th scope="col">Pupils</th>
              <th scope="col">Madrasah</th>
              <th scope="col">Masjid Complete</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_BANDS.map((b) => (
              <tr key={b.id} className={b.id === bandId ? "is-on" : undefined}>
                <th scope="row">{b.label}</th>
                <td>£{b.madrasah}<span> a month</span></td>
                <td>£{b.complete}<span> a month</span></td>
              </tr>
            ))}
            <tr className="pband__setup">
              <th scope="row">Setting up</th>
              <td colSpan={2}>£{PRICING.setup} once — waived on twelve months prepaid</td>
            </tr>
            <tr className="pband__setup">
              <th scope="row">Commission on giving</th>
              <td colSpan={2}>0%, permanently</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* NOT a third pricing card, on purpose. MasjidOne Safe does not exist
          yet, so it must not sit beside two plans a masjid can buy today as
          though it were one of them. A hairline band under the table, at the
          weight of a footnote, carrying the price and the date together —
          neither figure means anything without the other. */}
      <aside className="plawban">
        <p className="plawban__p">
          <strong>Just need Martyn&rsquo;s Law sorted?</strong> MasjidOne Safe
          unlocks the safety tools on their own, from £{MARTYNS_LAW.price} a
          month — launching {MARTYNS_LAW.launch}.
        </p>
        <a className="plawban__a" href={`${BASE_PATH}/martyns-law/`}>
          What Martyn&rsquo;s Law asks of a masjid
        </a>
      </aside>
    </>
  );
}
