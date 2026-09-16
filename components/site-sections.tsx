import { SectionNav } from "@/components/ui/m-variable-font-hover-1";
import { SpinningBorderLink } from "@/components/ui/spinning-border-button";
import * as React from "react";
import { DEMO_MAILTO } from "@/lib/site";
import { MasjidOneComparison } from "@/components/masjidone-comparison";
import { MasjidOneModulesDiagram } from "@/components/masjidone-modules-diagram";
import { FeaturesSection } from "@/components/ui/feature";
import { MasjidOneStack } from "@/components/masjidone-stack";
import { MasjidOneSetup } from "@/components/masjidone-setup";

// The header renders on every page, so its links cannot be bare hashes.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The MasjidOne site sections, ported from the original single-file build.
 * Styling still comes from the design system in app/globals.css; behaviour is
 * attached by components/site-behaviour.tsx.
 */

export function SiteHeader() {
  return (
<header className="hdr" id="hdr">
  <div className="wrap hdr__in">
    <a className="brand" href={`${BASE}/#top`}>Masjid<i>One</i></a>
    <SectionNav />
    <div className="hdr__end">
      <button className="icon-btn" id="theme" type="button" aria-pressed="false" aria-label="Switch to dark theme">
        <svg className="sun" viewBox="0 0 16 16" role="img" aria-label="Light theme" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="8" cy="8" r="3.2"/><path d="M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4"/>
        </svg>
        <svg className="moon" viewBox="0 0 16 16" role="img" aria-label="Dark theme" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"/>
        </svg>
      </button>
      <SpinningBorderLink href={DEMO_MAILTO}>Request a demo</SpinningBorderLink>
    </div>
  </div>
</header>
  );
}

export function Hero() {
  return (
<section className="sect hero wrap">
  <div className="hero__grid">
    <div className="hero__copy">
      <p className="eyebrow rv">YSB Ventures Ltd &middot; Bolton</p>
      <h1 className="rv" style={{ "--i": "1" } as React.CSSProperties}>The madrasah and the congregation, <em>on one system</em>.</h1>
      <p className="hero__sub rv" style={{ "--i": "2" } as React.CSSProperties}>
        Prayer times, the congregation app, your website, the hall screens and
        donations — running today. Registers, fees and parent access join the
        same system, from the same record of the same family.
      </p>
    </div>

    <div className="hero__board rv" style={{ "--i": "2" } as React.CSSProperties}>
      <div className="board" id="board">
        <div className="board__frame">
          <div className="board__top">
            <span className="board__name">Prayer hall screen</span>
            <span className="board__clock num" id="clock" aria-live="off">00:00</span>
          </div>
          <table>
            <caption>Interface preview. Example timetable, not live data for a specific masjid.</caption>
            <thead>
              <tr>
                <th scope="col">Prayer</th>
                <th scope="col">Begins</th>
                <th scope="col">Jamāʿah</th>
              </tr>
            </thead>
            <tbody id="rows">
              <tr><th scope="row">Fajr</th><td className="num"><span className="flap" data-t="05:12">05:12</span></td><td className="num"><span className="flap" data-t="05:45" data-j="05:45">05:45</span></td></tr>
              <tr><th scope="row">Sunrise</th><td className="num"><span className="flap" data-t="06:41">06:41</span></td><td className="num">—</td></tr>
              <tr><th scope="row">Ẓuhr</th><td className="num"><span className="flap" data-t="13:04">13:04</span></td><td className="num"><span className="flap" data-t="13:30" data-j="13:30">13:30</span></td></tr>
              <tr><th scope="row">ʿAṣr</th><td className="num"><span className="flap" data-t="16:38">16:38</span></td><td className="num"><span className="flap" data-t="17:15" data-j="17:15">17:15</span></td></tr>
              <tr><th scope="row">Maghrib</th><td className="num"><span className="flap" data-t="19:26">19:26</span></td><td className="num"><span className="flap" data-t="19:31" data-j="19:31">19:31</span></td></tr>
              <tr><th scope="row">ʿIshāʾ</th><td className="num"><span className="flap" data-t="20:44">20:44</span></td><td className="num"><span className="flap" data-t="21:00" data-j="21:00">21:00</span></td></tr>
            </tbody>
          </table>
          <div className="board__foot">
            <span>Jumuʿah <b className="num">13:15</b></span>
            <span id="next">Next jamāʿah</span>
          </div>
        </div>
      </div>
    </div>

    <div className="hero__act">
      <div className="btn-row rv" style={{ "--i": "1" } as React.CSSProperties}>
        <SpinningBorderLink href={DEMO_MAILTO}>Request a demo</SpinningBorderLink>
        <a className="btn btn--ghost" href="#pricing"><span className="btn__t">See the pricing</span></a>
      </div>
      <p className="hero__note rv" style={{ "--i": "2" } as React.CSSProperties}>
        The congregation side is live in a Bolton masjid now. The madrasah
        portal is in development for the September 2027 intake.
      </p>
    </div>
  </div>
</section>
  );
}

export function Join() {
  return (
<section className="sect join wrap" id="join">
  <p className="eyebrow eyebrow--brass rv">The join</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>Every mosque already runs two systems that have never met.</h2>
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties}>
    One keeps the children: registers, fees, progress. The other keeps the
    congregation: times, notices, giving. Both work. Neither knows the other
    exists, so the same family is entered twice, chased twice and counted twice.
  </p>

  {/* The argument is the shape of the table, not an adjective in it. The
      congregation column genuinely ticks the congregation rows — claiming
      otherwise would be false — and every unbuilt cell says so. */}
  <div className="join__table rv" style={{ "--i": "3" } as React.CSSProperties}>
    <MasjidOneComparison />
  </div>
  <p className="join__foot rv" style={{ "--i": "3" } as React.CSSProperties}>
    The last two rows are the product. They are why this exists, they are the
    only rows nobody else fills, and they are not finished — both are in
    development for the September 2027 intake.
  </p>

  <div className="bento rv" style={{ "--i": "4" } as React.CSSProperties}>
    <article className="bento__cell bento__cell--bridge">
      <span className="bento__seam" aria-hidden="true"></span>
      <p className="bento__tag">The bridge</p>
      <h3 className="bento__h">Parent access <span className="tag tag--dev">In development</span></h3>
      <p className="bento__p">A parent opens the app they already have for
      jamāʿah times and finds their own child: the register marked this
      evening, the sabaq heard this week, the fee due this month. One record of
      one family, reachable from both sides.</p>
    </article>

    <blockquote className="bento__cell bento__cell--quote join__quote">
      <p>The man at Fajr and the man paying madrasah fees are the same man. No platform in either camp knows it.</p>
      <cite>The product thesis, in one line</cite>
    </blockquote>
  </div>
</section>
  );
}

export function Stack() {
  return (
<section className="sect wrap" id="stack">
  <p className="eyebrow eyebrow--brass rv">What you run instead</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>Right now the masjid is the integration.</h2>
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties}>
    Not one of these is the wrong tool. The problem is that a volunteer is
    holding them together by hand, and the joins are where families get lost.
  </p>
  <div className="rv" style={{ "--i": "3" } as React.CSSProperties}>
    <MasjidOneStack />
  </div>
</section>
  );
}

export function Setup() {
  return (
<section className="sect wrap" id="setup">
  <p className="eyebrow eyebrow--brass rv">Setting up</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>What the £499 actually buys.</h2>
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties}>
    One fee, once, at the start. It is the part a committee is right to ask
    about, so here it is in full rather than in a footnote.
  </p>
  <div className="rv" style={{ "--i": "3" } as React.CSSProperties}>
    <MasjidOneSetup />
  </div>
</section>
  );
}

export function Modules() {
  return (
<section className="sect wrap" id="what">
  <p className="eyebrow eyebrow--brass rv">What it runs</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>Six modules, one record of the family.</h2>

  <div className="rv" style={{ "--i": "2" } as React.CSSProperties}>
    <MasjidOneModulesDiagram />
  </div>

  <FeaturesSection />
</section>
  );
}

export function Previews() {
  return (
<section className="sect wrap" id="previews">
  <p className="eyebrow eyebrow--brass rv">Previews</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>What the committee will actually be looking at.</h2>
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties}>
    Interface previews, not photographs of a running masjid. Every figure is
    example data, and no child&rsquo;s record or family&rsquo;s fee history appears in
    any of them.
  </p>

  <div className="tabs rv" style={{ "--i": "2" } as React.CSSProperties} role="tablist" aria-label="Interface previews">
    <button className="tab" role="tab" id="t1" aria-controls="p1" aria-selected="true" type="button">Hall screen</button>
    <button className="tab" role="tab" id="t2" aria-controls="p2" aria-selected="false" tabIndex={-1} type="button">Congregation app</button>
    <button className="tab" role="tab" id="t3" aria-controls="p3" aria-selected="false" tabIndex={-1} type="button">Madrasah register</button>
    <button className="tab" role="tab" id="t4" aria-controls="p4" aria-selected="false" tabIndex={-1} type="button">Madrasah fees</button>
    <button className="tab" role="tab" id="t5" aria-controls="p5" aria-selected="false" tabIndex={-1} type="button">Parent access</button>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p1" role="tabpanel" aria-labelledby="t1" tabIndex={0}>
    <figure className="shot-fig">
      <img className="shot-img" src={`${BASE}/devices/hall-screen.webp`} width={1300} height={766} loading="lazy" decoding="async"
        alt="Interface preview of a prayer hall screen: a live clock, a timetable with beginning and jamāʿah columns, the next jamāʿah marked, and a strip carrying Jumuʿah and janāzah notices." />
      <figcaption>Runs on any TV with a browser. Unlimited screens, live from the same timetable as the app.</figcaption>
    </figure>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p2" role="tabpanel" aria-labelledby="t2" tabIndex={0} hidden>
    <figure className="shot-fig shot-fig--tall">
      <img className="shot-img" src={`${BASE}/devices/app-prayer-times.webp`} width={760} height={1585} loading="lazy" decoding="async"
        alt="Interface preview of the congregation app: the next jamāʿah, the masjid's own beginning and jamāʿah times, and a per-person reminder offset set to twenty minutes before." />
      <figcaption>The masjid&rsquo;s own timetable, not a calculated one. The reminder offset is set per person, not per masjid.</figcaption>
    </figure>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p3" role="tabpanel" aria-labelledby="t3" tabIndex={0} hidden>
    <figure className="shot-fig">
      <img className="shot-img" src={`${BASE}/devices/admin-register.webp`} width={1320} height={840} loading="lazy" decoding="async"
        alt="Interface preview of a madrasah evening register: a week of attendance marks per pupil, the sabaq heard, and whether fees are paid. Pupil names are placeholders and no real child's record appears." />
      <figcaption>
        In development for the September 2027 intake. Pupil names are placeholders — no real child&rsquo;s record appears here.
      </figcaption>
    </figure>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p4" role="tabpanel" aria-labelledby="t4" tabIndex={0} hidden>
    <figure className="shot-fig">
      <img className="shot-img" src={`${BASE}/devices/admin-fees.webp`} width={1320} height={840} loading="lazy" decoding="async"
        alt="Interface preview of madrasah fees, charged per family rather than per child: what is invoiced, what is collected, what is outstanding, and which families are due. Example data only." />
      <figcaption>
        In development for the September 2027 intake. Fees are per family rather than per child. Example data — no real family&rsquo;s fee history appears here.
      </figcaption>
    </figure>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p5" role="tabpanel" aria-labelledby="t5" tabIndex={0} hidden>
    <figure className="shot-fig shot-fig--tall">
      <img className="shot-img" src={`${BASE}/devices/app-parent.webp`} width={760} height={1585} loading="lazy" decoding="async"
        alt="Interface preview of parent access inside the congregation app: this evening's attendance mark, the sabaq heard this week, and the fee due this month, for one child. Example data only." />
      <figcaption>
        In development for the September 2027 intake. The same app a parent already has for jamāʿah times — no second app to install. This is the bridge.
      </figcaption>
    </figure>
  </div>
</section>
  );
}

export { FAQ as Trust } from "@/components/ui/faq-section";

export { Footer as SiteFooter } from "@/components/ui/large-name-footer";
