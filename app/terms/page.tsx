import type { Metadata } from "next";
import { LegalPage, CONTACT_EMAIL } from "@/components/legal-page";
import { SUPPORT_EMAIL } from "@/lib/site";
import { BAND_RANGE, BASE_PATH, CONTACT_READY, PRICING, openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "The terms covering use of the MasjidOne website, and a summary of the terms on which the platform is supplied.",
  alternates: { canonical: "/terms/" },
  openGraph: openGraphFor("/terms/"),
};

/**
 * A working draft. The website terms below are ordinary and safe. The service
 * terms are a SUMMARY of intent, not a contract — a subscription agreement with
 * a charity, covering children's data and payment processing, needs a solicitor
 * before anyone signs. That is said on the page rather than hidden here.
 *
 * Prices are derived from lib/site.ts rather than typed, so they cannot
 * drift: the bands carry the monthly figures, setup is £499 once and waived
 * on twelve months
 * prepaid, 0% commission. Never discount the monthly.
 */
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and conditions"
      updated="16 September 2026"
      lede="Part one covers this website. Part two summarises how the platform is
            supplied — the binding version is the agreement a masjid signs."
    >
      <div className="warn">
        <p>
          <strong>Part two is a summary, not a contract.</strong> Nothing on this
          page creates a subscription. The terms that bind are in the written
          agreement signed before the first invoice.
        </p>
      </div>

      <h2>1. This website</h2>
      <p>
        This site is published by <strong>YSB Ventures Ltd</strong>, a company
        registered in England and Wales. It is provided for information. You may
        read it, print it and share links to it.
      </p>
      <p>
        The content, design and code are ours and all rights are reserved. The
        walkthrough video was recorded at a mosque in Bolton and is used with their
        permission; their name and marks remain theirs, and we do not name the
        masajid we work with. Every other image on this
        site is an interface preview rather than a capture of a real masjid, and
        the captions say so.
      </p>
      <p>
        We try to keep the site accurate, but it describes a product that is
        still being built. Anything marked <em>In development</em> is not
        available yet, and nothing here is a warranty that a particular feature
        will exist by a particular date.
      </p>

      <h2>2. How the platform is supplied</h2>

      <h3>Price</h3>
      <p>
        Published, and the same for every masjid of the same size.{" "}
        <strong>
          Madrasah £{BAND_RANGE.madrasah.from} to £{BAND_RANGE.madrasah.to} a
          month
        </strong>{" "}
        and{" "}
        <strong>
          Masjid Complete £{BAND_RANGE.complete.from} to £
          {BAND_RANGE.complete.to} a month
        </strong>
        , set by the number of pupils on the madrasah roll — up to 100, 101 to
        250, 251 to 500, or over 500 — with a{" "}
        <strong>£{PRICING.setup} setup and migration fee charged once</strong>,
        waived where twelve months are paid up front. Donations carry{" "}
        <strong>0% commission</strong>. There is no per-pupil charge and no paid
        add-on: the price follows your band rather than your headcount, and
        changes only if you cross a band at renewal. Prices exclude VAT; YSB Ventures Ltd is not currently VAT
        registered and will say so on every invoice until it is.
      </p>
      <p>
        Paying twelve months up front is the same monthly rate, twelve times
        over — it is not a discounted rate. What it buys is the setup fee waived.
      </p>

      <h3>Term and leaving</h3>
      <p>
        Monthly subscriptions run month to month and can be stopped with 30
        days&rsquo; notice. Where twelve months have been prepaid, the term runs
        to the end of that period. We do not charge an exit fee.
      </p>
      <p>
        <strong>Your data is yours.</strong> At any point, including after you
        leave, you can export everything the system holds for your masjid in a
        format that opens without MasjidOne. We will not hold data hostage to a
        renewal.
      </p>

      <h3>Donations</h3>
      <p>
        Each masjid holds <strong>its own Stripe account</strong>, under its own
        agreement with Stripe, in the masjid&rsquo;s name. Donations are paid to
        the masjid, not to us, and we cannot move them. Stripe&rsquo;s card
        processing fees are charged to the masjid by Stripe; MasjidOne adds
        nothing on top. If you leave, the account and its recurring donor
        mandates stay with you.
      </p>

      <h3>What we are responsible for</h3>
      <p>
        We will supply the service with reasonable skill and care, keep it
        available so far as we reasonably can, and tell you promptly if
        something goes wrong. We do not promise the service will never be
        interrupted.
      </p>
      <p>
        Nothing in these terms limits liability for death or personal injury
        caused by negligence, for fraud, or for anything else that cannot be
        limited in law.
      </p>

      <h3>What you are responsible for</h3>
      <p>
        Keeping your own account credentials safe, the accuracy of the
        information you put in, and having a lawful basis for the personal data
        you ask us to process — in particular where it concerns children.
      </p>

      <h2>3. Data protection</h2>
      <p>
        Covered separately in the{" "}
        <a href={`${BASE_PATH}/privacy/`}>privacy policy</a> and, for customers, in the data
        processing agreement signed before the first invoice.
      </p>

      <h2>4. Law</h2>
      <p>
        These terms are governed by the law of England and Wales, and the courts
        of England and Wales have exclusive jurisdiction.
      </p>

      <h2>5. Contact</h2>
      <p>
        {/* Two addresses, not one, because the two people writing to them want
            different things on different clocks: a committee weighing you up,
            and a masjid whose register will not submit this evening. */}
        {CONTACT_READY ? (
          <>
            Enquiries and anything about this site:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.<br />
            If your masjid already uses MasjidOne and something is wrong:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </>
        ) : (
          <a href={`${BASE_PATH}/request-a-demo/`}>our contact form</a>
        )}
      </p>
    </LegalPage>
  );
}
