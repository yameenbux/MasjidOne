import * as React from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { DEMO_MAILTO } from "@/lib/site";

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

// Absolute, basePath-aware: these links also render on 404.html, where a bare
// "#join" would simply do nothing. On the home page the path is unchanged, so
// the browser still treats it as a hash jump rather than a reload.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type FooterLink = { href: string; label: string };

const SECTIONS: FooterLink[] = [
  { href: BASE + "/#join", label: "The join" },
  { href: BASE + "/#what", label: "What it runs" },
  { href: BASE + "/#previews", label: "Previews" },
  { href: BASE + "/#pricing", label: "Pricing" },
  { href: BASE + "/#trust", label: "Your data" },
];

const LEGAL: FooterLink[] = [
  { href: BASE + "/privacy/", label: "Privacy policy" },
  { href: BASE + "/terms/", label: "Terms and conditions" },
];

const TALK: FooterLink[] = [
  { href: DEMO_MAILTO, label: "Request a demo" },
  { href: BASE + "/#pricing", label: "Published prices" },
  { href: BASE + "/#trust", label: "Leaving with your data" },
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
            <a className="brand" href={`${BASE}/#top`}>
              <BrandMark className="brand__mark" />
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
            <LinkColumn heading="Legal" links={LEGAL} />
          </div>
        </div>

        <div className="ftr__wordmark" aria-hidden="true">
          <span>
            Masjid<i>One</i>
          </span>
        </div>

        <a className="to-top" href={`${BASE}/#top`}>
          Back to top <span aria-hidden="true">&uarr;</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
