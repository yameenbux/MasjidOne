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
          h: "Fees charged per family, not per child",
          p: (
            <>
              A household with three children is one bill and one conversation.
              Rates, periods, charges, payments and balances sit against the
              family, with reminders sent automatically, and an annual report
              and a family export for the office at the end of it.
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
          h: "Every teacher on their own login",
          p: (
            <>
              Not a shared password taped inside a cupboard. A teacher sees
              their own classes; the committee sees committee-level data; nobody
              sees everything by default, and you can see who changed what.
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
