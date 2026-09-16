import * as React from "react";

/**
 * The supplied large-name footer, rebuilt for MasjidOne.
 *
 * What changed and why:
 *  - Colour comes from tokens. The original's gray-600 / neutral-700 /
 *    #039ee4 are not in this palette, and hex belongs in globals.css.
 *  - The socials column is gone. MasjidOne has no public accounts, and a
 *    footer linking to accounts that do not exist is worse than no footer.
 *  - The legal column is gone for the same reason: this is a single-page
 *    static export with no /privacy-policy or /tos route, so those links
 *    would 404. They go back in when the pages exist.
 *  - The link columns point at the real sections of this page.
 *  - The wordmark is aria-hidden. It is decoration, and the company name is
 *    already in the text beneath it, so a screen reader should not announce
 *    "MasjidOne" twice at a size nobody asked for.
 *  - `id="yr"` is preserved — site-behaviour.tsx writes the current year into
 *    it at runtime, so the copyright is correct with JS on and still shows a
 *    sensible year with JS off.
 */

type FooterLink = { href: string; label: string };

const SECTIONS: FooterLink[] = [
  { href: "#join", label: "The join" },
  { href: "#what", label: "What it runs" },
  { href: "#previews", label: "Previews" },
  { href: "#pricing", label: "Pricing" },
  { href: "#trust", label: "Your data" },
];

const TALK: FooterLink[] = [
  { href: "#contact", label: "Request a demo" },
  { href: "#pricing", label: "Published prices" },
  { href: "#trust", label: "Leaving with your data" },
];

function LinkColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="ftr__head">{heading}</h3>
      <ul className="ftr__list">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__in">
        <div className="ftr__cols">
          <div className="ftr__brandcol">
            <a className="brand" href="#top">
              Masjid<i>One</i>
            </a>
            <p className="ftr__blurb">
              The madrasah and the congregation, on one system. Built for UK
              masajid.
            </p>
            <p className="ftr__legal">
              &copy; <span className="num" id="yr">2026</span> YSB Ventures Ltd.
              All rights reserved.
              <br />
              MasjidOne is a product of YSB Ventures Ltd.
            </p>
          </div>

          <div className="ftr__links">
            <LinkColumn heading="The site" links={SECTIONS} />
            <LinkColumn heading="Talk to us" links={TALK} />
          </div>
        </div>

        <div className="ftr__wordmark" aria-hidden="true">
          <span>
            Masjid<i>One</i>
          </span>
        </div>

        <a className="to-top" href="#top">
          Back to top <span aria-hidden="true">&uarr;</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
