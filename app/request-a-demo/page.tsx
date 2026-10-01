import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { DemoRequestForm } from "@/components/demo-request-form";
import {
  BASE_PATH,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_READY,
  CONTACT_MAILTO,
  openGraphFor,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a demo",
  description:
    "Book a walkthrough of MasjidOne for your masjid — the madrasah registers and fees, the congregation app and hall screens, on one system. Thirty minutes, no obligation.",
  alternates: { canonical: "/request-a-demo/" },
  openGraph: openGraphFor("/request-a-demo/"),
};

export default function RequestADemo() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="sect wrap">
          <p className="eyebrow">
            <a href={`${BASE_PATH}/`}>MasjidOne</a> · Request a demo
          </p>
          <h1 className="measure">See it on your own madrasah&rsquo;s terms</h1>
          <p className="modp__lede measure">
            Thirty minutes, usually over a call with whoever needs to be in the
            room. We open the actual system rather than a slide deck: a register
            marked, a family&rsquo;s fees, the hall screen, and a parent opening
            the app to find their own child. You will know by the end of it
            whether this fits your masjid, and there is nothing to cancel if it
            does not.
          </p>

          <div className="cform__wrap">
            <DemoRequestForm idPrefix="page" />

            <aside className="cform__aside">
              <h2 className="cform__asidehead">
                {CONTACT_READY || CONTACT_PHONE ? "Or reach us directly" : "Where to find us"}
              </h2>
              <dl className="cform__dl">
                {CONTACT_READY ? (
                  <>
                    <dt>Email</dt>
                    <dd>
                      <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
                    </dd>
                  </>
                ) : null}
                {CONTACT_PHONE ? (
                  <>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>
                    </dd>
                  </>
                ) : null}
                <dt>Based in</dt>
                <dd>Bolton, and we will come to you.</dd>
              </dl>

              <h2 className="cform__asidehead">What happens next</h2>
              <ol className="cform__steps">
                <li>We reply within one working day, from a person.</li>
                <li>
                  A thirty-minute walkthrough at a time that suits the committee,
                  on a call or in your own office.
                </li>
                <li>
                  If it is a fit, we set your class lists up before anyone is
                  invoiced — and before any register is marked.
                </li>
              </ol>
              <p className="cform__asidenote">
                No obligation, no trial to cancel and nothing taken by card. A
                madrasah changes systems between terms, so the date is yours.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
