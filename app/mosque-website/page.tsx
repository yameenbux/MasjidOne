import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "A managed mosque website",
  description:
    "A managed website for UK masajid, current because nobody has to remember to update it: today's prayer times, the next jamāʿah and your notices publish to the site, the app and the hall screens at once.",
  alternates: { canonical: "/mosque-website/" },
  openGraph: openGraphFor("/mosque-website/"),
};

export default function MosqueWebsitePage() {
  return (
    <ModulePage
      slug="mosque-website"
      eyebrow="The congregation"
      title="A managed mosque website"
      status="live"
      lede={
        <>
          Almost every mosque website has the same two problems: the prayer times
          on it are months out, and the person who can log in has moved away.
          Neither is a design problem. A site is out of date because keeping it
          current is somebody&apos;s unpaid job — so the fix is a site that has no
          such job attached to it.
        </>
      }
      points={[
        {
          h: "Current without anybody updating it",
          p: (
            <>
              The times on the website are the times on the screens, because they
              are one timetable. Nobody edits the site on a Thursday night, and
              there is no version of the site that is a fortnight behind the hall.
            </>
          ),
        },
        {
          h: "The next jamāʿah, in the header",
          p: (
            <>
              The one thing most visitors came for, answered before they scroll.
              Everything else on a mosque website is secondary to that line and
              the site should admit it.
            </>
          ),
        },
        {
          h: "Notices publish everywhere at once",
          p: (
            <>
              A janāzah notice or a half-term announcement goes to the website,
              the app and the hall screens in one action. A screen cannot carry
              something the website is not also carrying.
            </>
          ),
        },
        {
          h: "Nobody is locked out",
          p: (
            <>
              Access is set by role rather than by one builder account whose
              password left with a volunteer. When the committee changes, the
              access changes, and the site keeps running.
            </>
          ),
        },
        {
          h: "No separate subscription",
          p: (
            <>
              No site builder plan, no hosting bill, no renewal somebody forgets
              until the site goes down. It is part of the same monthly figure as
              everything else.
            </>
          ),
        },
        {
          h: "Hall hire, nikah and admission enquiries",
          p: (
            <>
              What the public asks for arrives in one place for the office to
              answer, rather than across an inbox, a phone and a note left on a
              desk.
            </>
          ),
        },
      ]}
      plan={{
        name: "Masjid Complete",
        pounds: PRICING.complete,
        note: <>Your existing content is brought across as part of setup.</>,
      }}
    />
  );
}
