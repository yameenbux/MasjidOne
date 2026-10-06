import type { Metadata } from "next";
import { LegalPage, PRIVACY_EMAIL } from "@/components/legal-page";
import { BASE_PATH, CONTACT_READY, FORM_ENDPOINT } from "@/lib/site";
import { openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How MasjidOne and YSB Ventures Ltd handle personal data on this website and in the platform.",
  alternates: { canonical: "/privacy/" },
  openGraph: openGraphFor("/privacy/"),
};

/**
 * A working draft, not settled law.
 *
 * ONE THING WAS FIXED on 4 October 2026: CONTACT_EMAIL was a placeholder, and a
 * privacy notice with no working route for a subject access request is not a
 * privacy notice. Requests now reach PRIVACY_EMAIL, which aliases the general
 * inbox until a separate mailbox exists — worth splitting before the first
 * invoice, because the statutory deadline is one month and it should not sit
 * behind demo enquiries.
 *
 * ONE THING IS STILL OUTSTANDING before this is shown to a masjid being
 * invoiced:
 *
 *  1. A solicitor has read it. This covers the website honestly, but the
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
        <strong>Only what you type into the demo request form.</strong> This site
        is a set of static files on a content delivery network. It has no
        accounts, no analytics and no advertising, and there is nothing else on
        it that collects anything.
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

      <h2>The demo request form</h2>
      <p>
        If you ask for a demonstration we collect what you enter: the
        masjid&rsquo;s name and town, your own name, role, email address and
        phone number if you give one, and your answers about which part of the
        system interests you, roughly how many pupils the madrasah has, when you
        might want to start, and anything you write in the message box.
      </p>
      <p>
        We use it to arrange and prepare for that demonstration and for nothing
        else. Our lawful basis is legitimate interests — you have asked us to get
        in touch about a product. We hold it for as long as we are in
        conversation and for up to two years afterwards so we can pick the thread
        back up, then delete it. We do not add you to a mailing list and we do
        not pass your details to anyone.
      </p>
      <p>
        The form asks you not to include any pupil&rsquo;s details, and you
        should not. It is an ordinary web form and it is not the route by which a
        child&rsquo;s record reaches us.
      </p>
      {/* WRITTEN BOTH WAYS ON PURPOSE, and switched by the same variable the
          form itself reads. The old wording promised that whoever processed the
          form "will be named here before it goes live", which is a promise
          somebody has to remember to keep on the day the endpoint is set. This
          way the notice cannot be wrong in either state: set
          NEXT_PUBLIC_FORM_ENDPOINT and the copy changes with the behaviour. */}
      {FORM_ENDPOINT ? (
        <>
          <p>
            The form submits to an endpoint we run ourselves, on our own
            Cloudflare account. There is no form company in the middle: nobody
            sells us a form service, and your enquiry is not somebody else{"’"}s
            product. What you send is turned into an email to us.
          </p>
          <p>
            Two companies carry it, both acting on our instructions, so we name
            them. Cloudflare, Inc. receives the submission and runs the code
            that handles it, under their data processing addendum and standard
            contractual clauses; it is not stored there. Resend sends the
            resulting email, from servers in Ireland, and holds a copy for
            thirty days {"—"} their retention period on every plan {"—"} after which
            the only copy is the one in our own mailbox. Like any network
            provider both keep short-lived logs, including IP addresses, which
            is also true of our host.
          </p>
        </>
      ) : (
        <p>
          At present the form hands your answers to your own email client, so
          nothing reaches us until you press send there and no third party sees
          it on the way. When it changes to a form that submits directly, this
          paragraph changes with it and names whoever carries it.
        </p>
      )}

      <h2>If you email us</h2>
      <p>
        If you would rather write to us than use the form, the same applies: we hold
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
        {CONTACT_READY ? (
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
        ) : (
          <a href={`${BASE_PATH}/request-a-demo/`}>our contact form</a>
        )} and we will
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
