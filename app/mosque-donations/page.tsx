import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mosque donations and Gift Aid at 0% commission",
  description:
    "Take donations for your masjid with 0% commission, permanently. Card, Apple Pay and Google Pay, one-off or recurring, appeal campaigns, and Gift Aid claimed at the point of giving.",
  alternates: { canonical: "/mosque-donations/" },
  openGraph: openGraphFor("/mosque-donations/"),
};

export default function MosqueDonationsPage() {
  return (
    <ModulePage
      slug="mosque-donations"
      eyebrow="The congregation"
      title="Donations and Gift Aid at 0% commission"
      status="live"
      lede={
        <>
          A platform that takes a percentage of sadaqah is taking it from the
          masjid every month, for ever, and the amount grows precisely as your
          congregation becomes more generous. We take <strong>0%</strong>,
          permanently, in writing. The monthly fee is the whole of what we are
          paid.
        </>
      }
      points={[
        {
          h: "0% commission, permanently",
          p: (
            <>
              Not an introductory rate and not a tier you are moved off once the
              volume justifies it. Written into the agreement, because a promise
              about money that is not in the agreement is not a promise.
            </>
          ),
        },
        {
          h: "What the card provider charges is theirs",
          p: (
            <>
              Payment processing fees are set by the card provider and go to the
              card provider. We are clear about this rather than quiet about it:
              0% is our commission, not a claim that card processing is free.
            </>
          ),
        },
        {
          h: "Gift Aid at the point of giving",
          p: (
            <>
              The declaration is captured when somebody gives, not chased
              afterwards. Unclaimed Gift Aid is the most common twenty-five
              pence in the pound a masjid leaves on the table, and it is lost at
              the moment of the donation or not at all.
            </>
          ),
        },
        {
          h: "The donor list belongs to the masjid",
          p: (
            <>
              Who gave, and how often, stays with you rather than with a
              platform that will rent it back. It is also the same record of the
              same family the madrasah side uses.
            </>
          ),
        },
        {
          h: "One-off, recurring, and appeals",
          p: (
            <>
              A roof appeal with a running total, a monthly standing
              contribution, or a single donation after Jumuʿah. Card, Apple Pay
              and Google Pay, so giving is a thumbprint rather than a form.
            </>
          ),
        },
        {
          h: "Giving where the congregation already is",
          p: (
            <>
              In the app they check for jamāʿah times and on the screen in the
              foyer, rather than on a page somebody has to be told about. The
              ask lands where attention already is.
            </>
          ),
        },
      ]}
      plan={{
        name: "Masjid Complete",
        pounds: PRICING.complete,
        note: (
          <>
            A masjid taking £4,000 a month on a 5% platform pays £200 a month in
            commission alone — more than this costs, before any of the rest of
            the system.
          </>
        ),
      }}
    />
  );
}
