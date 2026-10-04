import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { MartynsLawInterestForm } from "@/components/martyns-law-interest-form";
import { BASE_PATH, DEMO_HREF, MARTYNS_LAW, openGraphFor } from "@/lib/site";

/**
 * The Martyn's Law page.
 *
 * WHY THIS IS NOT A ModulePage. Every module page is built around real
 * interface previews from public/devices. None of this is built, so there is
 * nothing to show, and inventing a screenshot of an unbuilt safety tool would
 * break two house rules at once — never claim a feature that is not built, and
 * never present a mock-up as an interface preview. So it is a page of words
 * and a form, and it says plainly that the tools come later.
 *
 * WHAT THIS PAGE MAY NOT DO, beyond the usual rules:
 *
 *   - It must never say "compliant", "compliance guaranteed", or anything that
 *     reads as a promise that a masjid will satisfy the regulator. We help a
 *     committee prepare and keep the records the law asks for. The SIA decides
 *     the rest, and so does a court.
 *   - It must not frighten anybody. A committee reading this should feel that
 *     the work is finite and ordinary, because it is. No casualty figures, no
 *     threat language, no countdown.
 *   - The commencement date is an EXPECTATION, not a date in the Act. The Home
 *     Office has said the implementation period will be at least 24 months
 *     from Royal Assent on 3 April 2025. Keep the hedge.
 *   - Dates and the price come from MARTYNS_LAW in lib/site.ts. Do not type
 *     either into the prose.
 */

/** Verified 4 October 2026. Check again before any significant edit. */
const SOURCE = {
  act: "https://www.legislation.gov.uk/ukpga/2025/10",
  factsheets:
    "https://www.gov.uk/government/publications/terrorism-protection-of-premises-act-2025-factsheets",
  protectUk: "https://www.protectuk.police.uk/martyns-law",
};

export const metadata: Metadata = {
  title: "Martyn's Law for mosques — what your masjid will need",
  description:
    "Martyn's Law applies to places of worship where 200 or more people may be present. What the standard tier asks for, what it does not, and how MasjidOne will help you prepare and keep the records.",
  alternates: { canonical: "/martyns-law/" },
  openGraph: openGraphFor("/martyns-law/"),
};

export default function MartynsLawPage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="sect wrap">
          <nav className="modp__crumb" aria-label="Breadcrumb">
            <a href={`${BASE_PATH}/`}>MasjidOne</a>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Martyn&rsquo;s Law</span>
          </nav>

          <p className="eyebrow eyebrow--brass">Safety</p>
          <h1 className="measure">Martyn&rsquo;s Law, and what your masjid will actually need</h1>
          <p className="modp__lede measure">
            Most masajid will find this is a morning&rsquo;s work and a folder
            that stays up to date — not a building project and not a security
            contract. The law asks places of worship to think through what
            everyone does if something happens, write it down, tell the people
            who would have to do it, and be able to show that you did. That is
            the whole of the standard tier.
          </p>

          <h2 className="measure">What the law is</h2>
          <p className="measure">
            The{" "}
            <a href={SOURCE.act} target="_blank" rel="noopener noreferrer">
              Terrorism (Protection of Premises) Act 2025
            </a>{" "}
            received Royal Assent on 3 April 2025. It is known as Martyn&rsquo;s
            Law after Martyn Hett, who was killed in the Manchester Arena attack
            in 2017, and it was campaigned for by his mother.
          </p>
          <p className="measure">
            It has not come into force yet. The Home Office has said there will
            be an implementation period of at least twenty-four months so that
            premises have time to prepare, which puts commencement in{" "}
            {MARTYNS_LAW.expectedInForce}. The regulator will be the Security
            Industry Authority.
          </p>

          <h2 className="measure">Whether it applies to you</h2>
          <p className="measure">
            It applies where it is reasonable to expect that{" "}
            <strong>{MARTYNS_LAW.standardTierFrom} or more people</strong> may be
            present at the same time, at least occasionally. For most masajid
            the honest test is Jumuʿah, or an Eid jamāʿah — not an ordinary
            Tuesday.
          </p>
          <p className="measure">
            Premises in that position are in the <strong>standard tier</strong>.
            Places of worship that meet the threshold are treated as standard
            tier, which is the lighter of the two sets of duties in the Act.
          </p>

          <h2 className="measure">What the standard tier asks for</h2>
          <p className="measure">
            Two things: tell the regulator you are a duty holder, and have
            appropriate public protection procedures in place so far as is
            reasonably practicable. The procedures cover four situations.
          </p>
          <ul className="mlist measure">
            <li>
              <strong>Evacuation</strong> — getting people out of the building,
              and where they go once they are out.
            </li>
            <li>
              <strong>Invacuation</strong> — bringing people in, or keeping them
              in, when outside is the more dangerous place to be.
            </li>
            <li>
              <strong>Lockdown</strong> — securing the building, and who is able
              to do it at the time it is needed rather than in principle.
            </li>
            <li>
              <strong>Communication</strong> — how the people in the building
              are told what is happening, including the ones in the madrasah
              and the ones who do not speak English as a first language.
            </li>
          </ul>

          <h2 className="measure">What it does not ask for</h2>
          <p className="measure">
            At standard tier there is <strong>no requirement to install
            physical security measures</strong>. No barriers, no scanners, no
            guards, no building work. Anybody selling a masjid equipment on the
            strength of this Act is selling something the standard tier does not
            ask for. There is also no fee to the regulator for being in the
            standard tier, and no inspection to book.
          </p>
          <p className="measure">
            What there is, is paperwork that has to be real: procedures that fit
            your actual building, people who know them, and a record you can put
            in front of someone.
          </p>

          <h2 className="measure">How MasjidOne will help</h2>
          <p className="measure">
            We are building a set of tools inside MasjidOne that{" "}
            <strong>help you prepare and keep the records the law asks
            for</strong>. Not a certificate, and not advice — the work is still
            yours, and so is the judgement.
          </p>
          <ul className="mlist measure">
            <li>
              A guided set of questions about your building — the exits, the
              assembly point, when you are busiest, who holds which key — that
              produces a written plan covering the four procedures.
            </li>
            <li>
              Versions, so a plan that changes keeps its history and you can
              show what was in place when.
            </li>
            <li>
              A training record: who has done which course, and when.
            </li>
            <li>
              A drill log, with a reminder when one is overdue.
            </li>
            <li>
              One-click export of the current plan, the training records and the
              drill history, as a single document.
            </li>
            <li>
              An alert the committee can send to volunteers&rsquo; phones and to
              the prayer hall screens — with a drill mode that logs itself.
            </li>
          </ul>
          <p className="measure mlnote">
            <strong>None of this is built yet.</strong> It is planned for{" "}
            {MARTYNS_LAW.launch}, which leaves time to write a plan, train
            people and run a drill before the law is expected to apply. We would
            rather say that than show you a screenshot of something that does
            not exist.
          </p>

          <h2 className="measure">The timeline we are working to</h2>
          <ol className="mlsteps measure">
            <li>
              <strong>February</strong> — your plan written, from the questions
              rather than from a blank page.
            </li>
            <li>
              <strong>March</strong> — volunteers and staff trained, and the
              training recorded.
            </li>
            <li>
              <strong>April</strong> — a drill run and logged, and the evidence
              pack ready to export.
            </li>
          </ol>
          <p className="measure">
            That ordering is deliberate: the plan is the thing the other two
            depend on, and a drill against a plan nobody has read tells you
            nothing.
          </p>

          <h2 className="measure">What it will cost</h2>
          <p className="measure">
            The Martyn&rsquo;s Law tools are <strong>included</strong> in both
            MasjidOne plans from {MARTYNS_LAW.launch}, at no change to the
            price. If you want only this and not the rest of MasjidOne, there
            will be a standalone plan — <strong>MasjidOne Safe</strong>, from
            £{MARTYNS_LAW.price} a month.
          </p>

          <h2 className="measure" id="register">
            Register your interest
          </h2>
          <p className="modp__lede measure">
            Launching {MARTYNS_LAW.launch}. Leave your details and we will write
            to you when there is something to look at — once, when it is ready.
            No newsletter.
          </p>

          <div className="cform__wrap">
            <MartynsLawInterestForm idPrefix="ml" />

            <aside className="cform__aside">
              <h2 className="cform__asidehead">Read it from the source</h2>
              <p className="cform__asidenote">
                You should not take our word for any of this, and nothing on
                this page is legal advice. These are the official sources.
              </p>
              <ul className="cform__steps">
                <li>
                  <a href={SOURCE.act} target="_blank" rel="noopener noreferrer">
                    The Act itself
                  </a>{" "}
                  on legislation.gov.uk
                </li>
                <li>
                  <a href={SOURCE.factsheets} target="_blank" rel="noopener noreferrer">
                    Home Office factsheets and statutory guidance
                  </a>{" "}
                  on GOV.UK
                </li>
                <li>
                  <a href={SOURCE.protectUk} target="_blank" rel="noopener noreferrer">
                    ProtectUK
                  </a>{" "}
                  — the police counter-terrorism hub, including free training
                </li>
              </ul>

              <h2 className="cform__asidehead">Already a MasjidOne masjid?</h2>
              <p className="cform__asidenote">
                You do not need to register. The tools arrive in your existing
                plan at no extra cost, and we will tell you when they do.
              </p>

              <h2 className="cform__asidehead">Not sure where to start?</h2>
              <p className="cform__asidenote">
                Ask us in a demo. We will not pretend to be your security
                adviser, but we can tell you what the Act asks of a masjid your
                size and what it does not.
              </p>
              <p>
                <a className="btn" href={`${BASE_PATH}${DEMO_HREF}`}>
                  Request a demo
                </a>
              </p>
            </aside>
          </div>

          <p className="measure mldisclaim">
            MasjidOne helps you prepare and document your procedures. It is not
            legal advice and does not certify that you meet the law.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
