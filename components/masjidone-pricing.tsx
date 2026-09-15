"use client";

import { Pricing } from "@/components/ui/pricing";

/**
 * MasjidOne's real published prices.
 *
 * `yearlyPrice` is what the toggle switches to. The monthly plans are
 * deliberately identical in both states — MasjidOne never discounts the
 * monthly, it waives the setup fee. So the only figure that moves is the
 * setup card, £499 to £0, which is what the toggle actually means.
 */
const masjidOnePlans = [
  {
    name: "MADRASAH",
    price: "79",
    yearlyPrice: "79",
    period: "month",
    features: [
      "Unlimited students and teachers",
      "Registers, Hifz and sabaq progress",
      "Fees by direct debit and card, chased automatically",
      "Parent access included",
      "Phone support included",
      "No add-ons, no per-pupil pricing",
    ],
    description: "In development for the September 2027 intake",
    buttonText: "Request a demo",
    href: "#contact",
    isPopular: false,
  },
  {
    name: "MASJID COMPLETE",
    price: "179",
    yearlyPrice: "179",
    period: "month",
    features: [
      "Everything in Madrasah",
      "Congregation app with jamāʿah reminders",
      "Managed mosque website",
      "Unlimited prayer hall screens",
      "Donations, Gift Aid and appeal campaigns",
      "0% commission, permanently",
    ],
    description: "The congregation side is live in a Bolton masjid now",
    buttonText: "Request a demo",
    href: "#contact",
    isPopular: true,
  },
  {
    name: "SETUP AND MIGRATION",
    price: "499",
    yearlyPrice: "0",
    period: "once",
    features: [
      "Your existing data imported",
      "Prayer hall screens configured",
      "Committee and teachers trained",
      "Migration from your current madrasah system",
      "Waived on twelve months prepaid",
    ],
    description: "Charged once, not monthly",
    buttonText: "Request a demo",
    href: "#contact",
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
