"use client";

import { Pricing } from "@/components/ui/pricing";
import { DEMO_MAILTO, PRICING, yearlyTotal } from "@/lib/site";

/**
 * MasjidOne's real published prices.
 *
 * `yearlyPrice` must be exactly `price` x 12 for the monthly plans. That is
 * the same monthly rate shown as a twelve-month total, not a cheaper one —
 * MasjidOne never discounts the monthly, it waives the setup fee. The setup
 * card is the only figure that actually falls, £499 to £0.
 *
 *   Madrasah         79 x 12 =   948
 *   Masjid Complete 179 x 12 = 2,148
 *
 * Every feature line maps to a module in #what and carries the same Live /
 * In development tag. If a module's status changes, change it in both places.
 */
const masjidOnePlans = [
  {
    name: "MADRASAH",
    price: String(PRICING.madrasah),
    yearlyPrice: String(yearlyTotal(PRICING.madrasah)),
    period: "month",
    yearlyPeriod: "year",
    // The portal is built and loaded at Taiyabah — the roll, the classes, the
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
      "Phone support, no per-pupil pricing, no paid add-ons",
    ],
    description:
      "Built, and in a Bolton masjid now — the roll, the classes and the staff are on it. Setup is charged at signing; the monthly starts at go-live.",
    buttonText: "Request a demo",
    href: DEMO_MAILTO,
    isPopular: false,
  },
  {
    name: "MASJID COMPLETE",
    price: String(PRICING.complete),
    yearlyPrice: String(yearlyTotal(PRICING.complete)),
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
    ],
    description:
      "Both sides are in a Bolton masjid now. The half a parent sees is the last piece.",
    buttonText: "Request a demo",
    href: DEMO_MAILTO,
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
    href: DEMO_MAILTO,
    isPopular: false,
  },
];

export function MasjidOnePricing() {
  return (
    <Pricing
      plans={masjidOnePlans}
      title="Two plans. Published prices. No per-pupil maths."
      description={
        "The monthly price is the same however you pay.\nPaying twelve months up front waives the setup fee instead — so the list price stays honest for the masjid down the road."
      }
    />
  );
}
