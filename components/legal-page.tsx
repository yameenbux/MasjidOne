import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";

/**
 * Shared shell for the privacy and terms pages. They are documents, so they get
 * a single measured column rather than the home page's full-bleed sections.
 *
 * CONTACT_EMAIL is deliberately exported from here rather than written into
 * each page: it is still a placeholder, and when the real address exists there
 * should be exactly one line to change.
 */
export const CONTACT_EMAIL = "REPLACE-ME@masjidone.example";

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
