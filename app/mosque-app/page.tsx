import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "A congregation app for your masjid",
  description:
    "A mosque app for UK masajid: your own jamāʿah times, reminders set per person rather than per masjid, announcements and janāzah notices, qibla, a Zakat calculator and one-tap giving.",
  alternates: { canonical: "/mosque-app/" },
  openGraph: openGraphFor("/mosque-app/"),
};

export default function MosqueAppPage() {
  return (
    <ModulePage
      slug="mosque-app"
      eyebrow="The congregation"
      title="A congregation app for your masjid"
      status="live"
      lede={
        <>
          There are plenty of prayer-time apps, and your congregation already has
          one. The reason to have your own is not the times — it is that the app
          a man checks for ʿIshāʾ is the same place a janāzah notice reaches him,
          and eventually the same place he sees his own child&apos;s register.
          An app nobody opens is worthless; an app that carries the one thing he
          needs today gets opened.
        </>
      }
      points={[
        {
          h: "The masjid's own timetable",
          p: (
            <>
              Beginning and jamāʿah side by side, exactly as the board in the
              hall has them, because they are the same times. Not a calculation
              that drifts from the committee&apos;s own decision.
            </>
          ),
        },
        {
          h: "Reminders set per person",
          p: (
            <>
              A man who needs twenty minutes to get to the masjid sets twenty
              minutes. A man who lives next door sets five. The offset belongs to
              the person, not to the masjid, which is the difference between a
              reminder people keep and a notification people mute.
            </>
          ),
        },
        {
          h: "Announcements and janāzah notices",
          p: (
            <>
              Published once and reaching the phone and the hall screens
              together. Not a WhatsApp broadcast to whichever numbers somebody
              remembered to add, and not a bulk text nobody can correct.
            </>
          ),
        },
        {
          h: "One-tap giving",
          p: (
            <>
              Card, Apple Pay and Google Pay, with Gift Aid added at the point of
              giving and 0% commission taken by us. Sadaqah at the moment
              somebody means to give it, rather than at the moment they next find
              a card reader.
            </>
          ),
        },
        {
          h: "Qibla and a Zakat calculator",
          p: (
            <>
              The small things people currently keep a second app for. Not the
              reason anybody adopts it, but the reason the second app comes off
              the phone.
            </>
          ),
        },
        {
          h: "Nothing to install twice",
          p: (
            <>
              One app for the congregation, and — when parent access lands — the
              same app for a parent. A madrasah that asks families to install a
              separate app has already lost most of them.
            </>
          ),
        },
      ]}
      pending={
        <>
          Parent access inside this app is in development, targeted at the
          September 2027 intake: this evening&apos;s attendance mark, the fee due
          this month, and progress a parent can actually read. It is the half of
          the product that joins the two sides, and it is the one thing on this
          page you cannot use today.
        </>
      }
      plan={{
        name: "Masjid Complete",
        pounds: PRICING.complete,
        note: <>No per-download or per-user charge, whatever the size of the congregation.</>,
      }}
    />
  );
}
