import type { Metadata } from "next";
import { LegalPage, CONTACT_EMAIL } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How MasjidOne and YSB Ventures Ltd handle personal data on this website and in the platform.",
};

/**
 * A working draft, not settled law. Two things must be true before this is
 * shown to a masjid that is being invoiced:
 *
 *  1. CONTACT_EMAIL is still a placeholder. A privacy notice without a working
 *     route for a subject access request is not a privacy notice.
 *  2. A solicitor has read it. This covers the website honestly, but the
 *     platform processes children's attendance data, which is where the real
 *     obligations sit.
 *
 * Everything below describes what is actually true today. Nothing is written in
 * the present tense that has not happened — the house rule on compliance.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      updated="16 September 2026"
      lede="This covers masjidone — the website you are reading. The platform itself is
            covered by the data processing agreement a masjid signs before it is invoiced."
    >
      <h2>Who we are</h2>
      <p>
        MasjidOne is a product of <strong>YSB Ventures Ltd</strong>, a company
        registered in England and Wales. For anything on this website, YSB
        Ventures Ltd is the data controller.
      </p>

      <h2>What this website collects</h2>
      <p>
        <strong>Nothing, at present.</strong> This site is a set of static files
        on a content delivery network. It has no accounts, no forms that post
        anywhere, no analytics and no advertising.
      </p>
      <ul>
        <li>
          <strong>No cookies.</strong> The site sets none. The light and dark
          toggle deliberately keeps its state in memory only, which is why it
          resets when you reload.
        </li>
        <li>
          <strong>No local storage.</strong> Nothing is written to your browser.
        </li>
        <li>
          <strong>No analytics or tracking pixels.</strong> We do not know who
          visits, or how many.
        </li>
      </ul>
      <p>
        Two things happen that are outside our control and worth stating. Our
        host, GitHub Pages, keeps short-lived server logs including IP
        addresses, as any web server does. Typefaces are served by Google Fonts,
        so your browser makes a request to Google to fetch them.
      </p>

      <h2>If you email us</h2>
      <p>
        The demo buttons open your own email client. If you write to us we hold
        your message and contact details for as long as we are in conversation,
        and for up to two years afterwards so we can pick the thread back up. We
        do not add you to a mailing list, and we do not pass your details to
        anyone.
      </p>

      <h2>The platform, not this website</h2>
      <p>
        When a masjid becomes a customer, MasjidOne processes personal data on
        their behalf — congregation members, and in time madrasah students and
        their parents. In that relationship the masjid is the data controller
        and YSB Ventures Ltd is the processor. The terms are set out in a data
        processing agreement signed before the first invoice, which covers what
        is held, for how long, who can see it, and how it is returned or deleted
        if the masjid leaves.
      </p>
      <p>
        <strong>Donations are handled by Stripe.</strong> Each masjid holds its
        own Stripe account under its own agreement with Stripe. Card details are
        never seen by, and never pass through, MasjidOne.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask for a copy of any personal data we hold about
        you, ask us to correct or delete it, or object to how we use it. Write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
        respond within one month.
      </p>
      <p>
        If you are not satisfied you can complain to the Information
        Commissioner&rsquo;s Office at{" "}
        <a href="https://ico.org.uk/make-a-complaint/" rel="noreferrer">
          ico.org.uk/make-a-complaint
        </a>
        .
      </p>

      <h2>Registration</h2>
      <p>
        YSB Ventures Ltd is completing its registration with the Information
        Commissioner&rsquo;s Office. That registration will be in place, and the
        number published here, before any masjid is invoiced.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes the date at the top changes with it. If a change
        is material to an existing customer we will say so directly rather than
        rely on you noticing.
      </p>
    </LegalPage>
  );
}
