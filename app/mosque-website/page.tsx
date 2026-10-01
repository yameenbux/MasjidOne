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
      hero={{
        img: "website.webp",
        alt: "Interface preview of the managed mosque website, with the next jamāʿah in the header and today's times below the headline.",
        caption: (
          <>
            Interface preview. The next jamāʿah in the header, because that is
            what most visitors came for.
          </>
        ),
      }}
      bands={[
        {
          h: "Current without anybody updating it",
          img: "hall-screen.webp",
          alt: "Interface preview of a prayer hall screen showing the same beginning and jamāʿah times the website carries.",
          caption: <>Interface preview. The hall screen and the site read one timetable.</>,
          p: (
            <>
              The times on the website are the times on the screens, because
              they are one table rather than two copies of one. Nobody edits the
              site on a Thursday night, and there is no week where the board in
              the hall is right and the website is a fortnight behind. The most
              common fault on a mosque website is not a design fault — it is
              that keeping it current was somebody&apos;s unpaid job, and this
              removes the job rather than reassigning it.
            </>
          ),
        },
        {
          h: "Notices publish everywhere at once",
          img: "app-notices.webp",
          alt: "Interface preview of notices in the congregation app: a janāzah today, Jumuʿah times, and a madrasah half term.",
          caption: <>Interface preview. One action, three places.</>,
          p: (
            <>
              A janāzah notice or a half-term announcement goes to the website,
              the app and the hall screens in one action. A screen cannot carry
              something the website is not also carrying, so the congregation
              never has to work out which of the three to believe — which is
              what they currently do, and why most of them check none of them.
            </>
          ),
        },
      ]}
      points={[
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
