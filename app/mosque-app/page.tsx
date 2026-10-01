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
      hero={{
        img: "app-prayer-times.webp",
        alt: "Interface preview of the congregation app: the next jamāʿah, the masjid's own beginning and jamāʿah times, and a per-person reminder offset set to twenty minutes before.",
        caption: (
          <>
            Interface preview. The masjid&apos;s own timetable, with the
            reminder offset set per person rather than per masjid.
          </>
        ),
      }}
      bands={[
        {
          h: "Announcements and janāzah notices",
          img: "app-notices.webp",
          alt: "Interface preview of notices in the congregation app: a janāzah today, Jumuʿah times, and a madrasah half term.",
          caption: <>Interface preview. Published once, reaching the phone and the hall together.</>,
          p: (
            <>
              This is the reason an app is worth having at all. A death known at
              eleven and a burial after Zuhr cannot wait for the next newsletter
              or for somebody to remember a WhatsApp list. Published once, it
              reaches the phones and the hall screens together — and it reaches
              the people who are actually in your congregation, rather than
              whichever numbers were in someone&apos;s broadcast group.
            </>
          ),
        },
        {
          h: "Giving at the moment somebody means to give",
          img: "app-giving.webp",
          alt: "Interface preview of giving in the app, with Gift Aid added and Apple Pay and Google Pay, at 0% commission.",
          caption: <>Interface preview. Gift Aid at the point of giving, 0% commission.</>,
          p: (
            <>
              Card, Apple Pay and Google Pay, with the Gift Aid declaration
              captured as the donation is made rather than chased afterwards.
              Sadaqah tends to be an impulse — the gap between meaning to give
              and finding a card reader is where most of it is lost. We take 0%
              commission, permanently.
            </>
          ),
        },
        {
          h: "The small things that keep it on the phone",
          img: "app-duas.webp",
          alt: "Interface preview of everyday duʿās in the app, by occasion, with transliteration.",
          caption: <>Interface preview. Everyday duʿās by occasion, with transliteration.</>,
          p: (
            <>
              Qibla, a Zakat calculator, everyday duʿās by occasion. None of
              these is why a committee buys the system, and none is why somebody
              installs it. They are why the second app comes off the phone — and
              an app that stays on the phone is the one your janāzah notice
              arrives on.
            </>
          ),
        },
      ]}
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
      pendingShot={{
        img: "app-parent.webp",
        alt: "Interface preview of parent access inside the congregation app: this evening's attendance mark, the sabaq heard this week, and the fee due this month, for one child. Example data only.",
        caption: (
          <>
            In development for the September 2027 intake. Interface preview,
            example data only.
          </>
        ),
      }}
      plan={{
        name: "Masjid Complete",
        pounds: PRICING.complete,
        note: <>No per-download or per-user charge, whatever the size of the congregation.</>,
      }}
    />
  );
}
