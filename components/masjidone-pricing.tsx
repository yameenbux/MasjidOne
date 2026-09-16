"use client";

import { Pricing } from "@/components/ui/pricing";
import { DEMO_MAILTO } from "@/lib/site";

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
    price: "79",
    yearlyPrice: "948",
    period: "month",
    yearlyPeriod: "year",
    // The whole plan is the madrasah portal, which is not built yet.
    status: "dev" as const,
    features: [
      "Unlimited students and teachers",
      "Daily registers, Hifz and sabaq progress",
      "Reports and certificates",
      "Fees by direct debit and card, chased automatically",
      "Parent access inside the congregation app",
      "Phone support, no per-pupil pricing, no paid add-ons",
    ],
    description:
      "For the September 2027 intake. Setup is charged at signing; the monthly starts at go-live.",
    buttonText: "Request a demo",
    href: DEMO_MAILTO,
    isPopular: false,
  },
  {
    name: "MASJID COMPLETE",
    price: "179",
    yearlyPrice: "2148",
    period: "month",
    yearlyPeriod: "year",
    status: "live" as const,
    features: [
      "Congregation app with per-person jamāʿah reminders",
      "The masjid's own timetable, not a calculated one",
      "Managed mosque website",
      "Unlimited prayer hall screens",
      "Donations and Gift Aid at 0% commission, permanently",
      { text: "Everything in Madrasah", status: "dev" as const },
      { text: "Parent access — the join", status: "dev" as const },
    ],
    description:
      "The congregation side runs in a Bolton masjid now. The madrasah portal joins it at no extra cost.",
    buttonText: "Request a demo",
    href: DEMO_MAILTO,
    isPopular: true,
  },
  {
    name: "SETUP AND MIGRATION",
    price: "499",
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
