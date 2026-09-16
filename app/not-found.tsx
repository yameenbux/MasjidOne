import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";
import { SpinningBorderLink } from "@/components/ui/spinning-border-button";

// A plain <a href="/"> resolves to the domain root and would miss the project
// page entirely. next/link would handle basePath; a bare anchor does not.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist on masjidone.",
  robots: { index: false, follow: true },
};

/**
 * With `output: 'export'` this becomes out/404.html, which GitHub Pages serves
 * for any unknown path. It keeps the header and footer so a visitor who
 * mistypes a URL is one click from everywhere rather than at a dead end.
 *
 * The in-page links are absolute from the site root, not bare hashes: from
 * /something-wrong/ a bare "#pricing" would do nothing.
 */
export default function NotFound() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="sect wrap">
          <p className="eyebrow eyebrow--brass">404</p>
          <h1 className="measure" style={{ marginTop: "1rem" }}>
            That page isn&rsquo;t here.
          </h1>
          <p className="measure" style={{ marginTop: "1rem" }}>
            The link may be out of date, or the address mistyped. Everything on
            MasjidOne lives on one page, so the fastest way back is the top.
          </p>
          <div className="btn-row">
            <SpinningBorderLink href={`${BASE}/`}>Back to the site</SpinningBorderLink>
            <a className="btn btn--ghost" href={`${BASE}/#pricing`}>
              <span className="btn__t">See the pricing</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <SiteBehaviour />
    </>
  );
}
