import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mosque prayer times and prayer hall screens",
  description:
    "Prayer time displays for UK masajid. Your own jamāʿah times — not a calculation — on unlimited prayer hall screens, the congregation app and your website at once, changed in one place.",
  alternates: { canonical: "/mosque-prayer-times-screens/" },
  openGraph: openGraphFor("/mosque-prayer-times-screens/"),
};

export default function PrayerTimesScreensPage() {
  return (
    <ModulePage
      slug="mosque-prayer-times-screens"
      eyebrow="The congregation"
      title="Prayer times and prayer hall screens"
      status="live"
      lede={
        <>
          Most mosques have a screen in the hall, a timetable on the website and
          an app somebody downloaded, and all three disagree. The congregation
          learns which one to trust and ignores the other two. The fix is not a
          better screen — it is one set of times that every screen, the app and
          the website all read.
        </>
      }
      points={[
        {
          h: "Your times, not a calculation",
          p: (
            <>
              Jamāʿah is the masjid&apos;s own decision, loaded as it is on your
              board. A calculated time drifts from what the committee actually
              set, and once the hall and the phone disagree by four minutes
              nobody believes either.
            </>
          ),
        },
        {
          h: "Unlimited screens, on any TV with a browser",
          p: (
            <>
              No proprietary box to buy per screen and no per-screen licence.
              The hall, the foyer, the women&apos;s section and the madrasah
              corridor can all show it, and adding another costs nothing.
            </>
          ),
        },
        {
          h: "Change a time once",
          p: (
            <>
              Move a jamāʿah and every screen follows, the app updates, the
              website updates, and the per-person reminders shift with it. There
              is only one set of times, which is the point — there is nothing to
              keep in sync because there is nothing to sync.
            </>
          ),
        },
        {
          h: "Announcements and janāzah notices",
          p: (
            <>
              A janāzah notice reaches the hall screens and the phones in the
              same action. A screen cannot say something the website is not also
              saying, because both are reading the same published notice.
            </>
          ),
        },
        {
          h: "The next jamāʿah, marked",
          p: (
            <>
              Beginning and jamāʿah as two columns — the rhythm a UK prayer board
              already uses — with the next one marked, so somebody walking in
              reads the one line they came for.
            </>
          ),
        },
        {
          h: "A whole year loaded",
          p: (
            <>
              The year&apos;s timetable goes in once. Nobody is editing a screen
              every Thursday, and there is no week where the board is right and
              the screen is a fortnight behind.
            </>
          ),
        },
      ]}
      plan={{
        name: "Masjid Complete",
        pounds: PRICING.complete,
        note: <>Screens are configured as part of setup, before go-live.</>,
      }}
    />
  );
}
