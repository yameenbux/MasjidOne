import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Madrasah software: registers, fees and families",
  description:
    "Madrasah management software for UK mosques. Daily registers drafted, submitted and locked, fees charged per family with automatic reminders, and every teacher on their own login. £79 a month, unlimited pupils.",
  alternates: { canonical: "/madrasah-software/" },
  openGraph: openGraphFor("/madrasah-software/"),
};

export default function MadrasahSoftwarePage() {
  return (
    <ModulePage
      slug="madrasah-software"
      eyebrow="The madrasah"
      title="Madrasah software for UK mosques"
      status="live"
      lede={
        <>
          Most madrasahs run on a paper register, a fees book and one
          volunteer&apos;s spreadsheet. That works until somebody asks which
          children have missed three weeks running, or which families are behind
          — and then it takes an evening of turning pages. This is the part that
          answers those two questions in a few seconds, and it is built and in a
          masjid now.
        </>
      }
      hero={{
        img: "admin-register.webp",
        alt: "Interface preview of a madrasah evening register: a week of attendance marks per pupil, who is absent, and whether the register has been submitted. Pupil names are placeholders and no real child's record appears.",
        caption: (
          <>
            The evening register. Interface preview — pupil names are
            placeholders and no real child&apos;s record appears here.
          </>
        ),
      }}
      bands={[
        {
          h: "Fees charged per family, not per child",
          img: "admin-fees.webp",
          alt: "Interface preview of madrasah fees, charged per family rather than per child: what is invoiced, what is collected, what is outstanding, and which families are due. Example data only.",
          caption: (
            <>
              Interface preview. Example data — no real family&apos;s fee
              history appears here.
            </>
          ),
          p: (
            <>
              A household with three children is one bill and one conversation,
              not three of each. Rates, periods, charges, payments and balances
              sit against the family, reminders go out without anybody
              remembering to send them, and the office gets an annual report
              and a family export at the end of it. The screen answers the
              question a treasurer actually has — <em>who is behind, and by how
              much</em> — without anybody adding up a column.
            </>
          ),
        },
        {
          h: "Every teacher on their own login",
          img: "admin-committee.webp",
          alt: "Interface preview of the committee and roles screen: who can edit times, publish notices, see donation figures and manage users.",
          caption: <>Interface preview. Access is set by role, not by a shared password.</>,
          p: (
            <>
              Not one password taped inside a cupboard. A teacher sees their own
              classes. The committee sees committee-level data. Nobody sees
              everything by default, and every change is attributable — which
              matters most on the day somebody asks who marked a child absent,
              and matters again when a volunteer moves away and their access
              has to go with them.
            </>
          ),
        },
      ]}
      points={[
        {
          h: "Daily registers, with a state",
          p: (
            <>
              A register is drafted, submitted and then locked, so there is a
              point after which the evening&apos;s attendance cannot quietly
              change. A register that was never submitted is chased rather than
              silently missing, which is the failure a paper book cannot catch
              at all.
            </>
          ),
        },
        {
          h: "Attendance history that answers a question",
          p: (
            <>
              Who missed the last three weeks, which class has slipped, whether
              this term looks like last term. The point is not the record; it is
              being able to interrogate it in front of a parent without
              rehearsing.
            </>
          ),
        },
        {
          h: "One record of the family, siblings linked",
          p: (
            <>
              Brothers and sisters are joined to one household rather than
              entered three times with three slightly different addresses. This
              is the same record the congregation side reads, which is the whole
              reason the two halves are worth buying together.
            </>
          ),
        },
        {
          h: "Unlimited pupils and teachers",
          p: (
            <>
              No per-pupil pricing and no paid add-ons, so a madrasah that grows
              from eighty children to five hundred pays the same £
              {PRICING.madrasah} a month. Growth should not be a billing event.
            </>
          ),
        },
      ]}
      pending={
        <>
          Hifz and sabaq progress, and parent access, are not built yet. Progress
          is being designed with teachers rather than guessed at; parent access —
          a parent opening the app they already have and finding their own
          child&apos;s register, fee and progress — is targeted at the September
          2027 intake. Both are tagged the same way everywhere on this site. You
          are not buying either of them today.
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
        name: "Madrasah",
        pounds: PRICING.madrasah,
        note: (
          <>
            Migrating from paper is usually simpler than migrating from an
            existing system, and either way nobody at the masjid retypes a name.
          </>
        ),
      }}
    >
      <h2 className="measure" style={{ marginTop: "2.5rem" }}>
        Switching, and when
      </h2>
      <p className="modp__lede measure">
        Madrasahs change systems between years, not in the middle of one. The
        setup fee covers getting your class lists in — from paper, a spreadsheet
        or whatever you run now — the hall screens configured, and the teachers
        trained on the thing they will actually use, before the first register is
        marked. In practice that is one weekend before a new term, on your
        calendar rather than ours.
      </p>
      <p className="modp__lede measure">
        Before any masjid is invoiced we commit in writing to ICO registration
        and a signed data processing agreement, a documented retention policy for
        a child&apos;s record, and one-click full export of everything in a
        standard format at any time. This platform holds attendance records for
        your children, so those belong in the agreement rather than in a
        reassurance.
      </p>
    </ModulePage>
  );
}
