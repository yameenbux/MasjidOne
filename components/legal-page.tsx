import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";

/**
 * Shared shell for the privacy and terms pages. They are documents, so they get
 * a single measured column rather than the home page's full-bleed sections.
 *
 * CONTACT_EMAIL is re-exported, not redeclared. It used to be its own literal
 * here while lib/site.ts held a second copy, and both comments claimed to be
 * the one line to change — so the placeholder would have survived in whichever
 * file was not opened. The legal pages keep importing it from here.
 */
export { CONTACT_EMAIL, PRIVACY_EMAIL } from "@/lib/site";

export function LegalPage({
  eyebrow,
  title,
  updated,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="sect wrap">
          <p className="eyebrow eyebrow--brass">{eyebrow}</p>
          <h1 className="measure" style={{ marginTop: "1rem" }}>
            {title}
          </h1>
          <p className="legal__lede measure">{lede}</p>
          <p className="legal__updated">Last updated {updated}</p>
          <div className="legal">{children}</div>
        </section>
      </main>
      <SiteFooter />
      <SiteBehaviour />
    </>
  );
}
