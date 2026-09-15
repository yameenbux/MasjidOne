import * as React from "react";

/**
 * The MasjidOne site sections, ported from the original single-file build.
 * Styling still comes from the design system in app/globals.css; behaviour is
 * attached by components/site-behaviour.tsx.
 */

export function SiteHeader() {
  return (
<header className="hdr" id="hdr">
  <div className="wrap hdr__in">
    <a className="brand" href="#top">Masjid<i>One</i></a>
    <nav className="nav" aria-label="Sections">
      <a href="#join">The join</a>
      <a href="#what">What it runs</a>
      <a href="#previews">Previews</a>
      <a href="#pricing">Pricing</a>
      <a href="#trust">Your data</a>
    </nav>
    <div className="hdr__end">
      <button className="icon-btn" id="theme" type="button" aria-pressed="false" aria-label="Switch to dark theme">
        <svg className="sun" viewBox="0 0 16 16" role="img" aria-label="Light theme" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="8" cy="8" r="3.2"/><path d="M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4"/>
        </svg>
        <svg className="moon" viewBox="0 0 16 16" role="img" aria-label="Dark theme" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"/>
        </svg>
      </button>
      <a className="btn" href="#contact"><span className="btn__t">Request a demo <span className="arw" aria-hidden="true">→</span></span></a>
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
        <a className="btn" href="#contact"><span className="btn__t">Request a demo <span className="arw" aria-hidden="true">→</span></span></a>
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
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties} >
    One keeps the children: registers, fees, progress. The other keeps the
    congregation: times, notices, giving. Both work. Neither knows the other
    exists, so the same family is entered twice, chased twice and counted twice.
  </p>

  <div className="join__grid rv" style={{ "--i": "3" } as React.CSSProperties}>
    <ul className="join__col">
      <li className="hd">Madrasah</li>
      <li>Students and classes</li>
      <li>Daily registers</li>
      <li>Hifz and sabaq progress</li>
      <li>Fees and chasing</li>
      <li>Reports and certificates</li>
    </ul>
    <div className="join__spine" aria-hidden="true"></div>
    <ul className="join__col">
      <li className="hd">Congregation</li>
      <li>Prayer times and jamāʿah reminders</li>
      <li>Announcements and janāzah notices</li>
      <li>Website and hall screens</li>
      <li>Donations and sadaqah</li>
      <li className="dev">Parent access — the bridge</li>
    </ul>
  </div>

  <blockquote className="join__quote rv" style={{ "--i": "4" } as React.CSSProperties}>
    <p>The man at Fajr and the man paying madrasah fees are the same man. No platform in either camp knows it.</p>
    <cite>The product thesis, in one line</cite>
  </blockquote>
</section>
  );
}

export function Modules() {
  return (
<section className="sect wrap" id="what">
  <p className="eyebrow eyebrow--brass rv">What it runs</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>Five modules, one record of the family.</h2>

  <div className="mods">
    <article className="mod rv">
      <h3>Madrasah portal <span className="tag tag--dev">In development</span></h3>
      <p>Students, classes, daily registers, Hifz and sabaq progress, reports
      and certificates. Fees by direct debit and card with automatic chasing.
      Unlimited students and teachers — no per-pupil pricing, no paid add-ons.</p>
    </article>

    <article className="mod rv">
      <h3>Parent access <span className="tag tag--dev">In development</span></h3>
      <p>Absence alerts the same evening, fees paid in two taps, progress a
      parent can actually read — inside the congregation app they already have.
      No second app to install. This is the bridge, and it is the whole claim.</p>
    </article>

    <article className="mod rv">
      <h3>Congregation app <span className="tag tag--live">Live</span></h3>
      <p>The masjid's own timetable, not a calculated one. Jamāʿah reminders
      with a per-person offset, so a man who needs twenty minutes gets twenty
      minutes. Qibla, Zakat calculator, announcements, one-tap giving.</p>
    </article>

    <article className="mod rv">
      <h3>Website and hall screens <span className="tag tag--live">Live</span></h3>
      <p>A managed mosque website kept current from the same place as
      everything else, and unlimited screens on any TV with a browser. Live
      announcements and janāzah notices reach the hall and the phone together.</p>
    </article>

    <article className="mod rv">
      <h3>Donations and Gift Aid <span className="tag tag--live">Live</span></h3>
      <p>Card, Apple Pay and Google Pay. One-off or recurring, appeal
      campaigns, Gift Aid claimed at the point of giving.
      <strong>0% commission, permanently.</strong> Every pound given reaches
      the masjid.</p>
    </article>
  </div>
</section>
  );
}

export function Previews() {
  return (
<section className="sect wrap" id="previews">
  <p className="eyebrow eyebrow--brass rv">Previews</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>What the committee will actually be looking at.</h2>

  <div className="tabs rv" style={{ "--i": "2" } as React.CSSProperties} role="tablist" aria-label="Interface previews">
    <button className="tab" role="tab" id="t1" aria-controls="p1" aria-selected="true" type="button">Hall screen</button>
    <button className="tab" role="tab" id="t2" aria-controls="p2" aria-selected="false" tabIndex={-1} type="button">Congregation app</button>
    <button className="tab" role="tab" id="t3" aria-controls="p3" aria-selected="false" tabIndex={-1} type="button">Madrasah register</button>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p1" role="tabpanel" aria-labelledby="t1" tabIndex={0}>
    <svg className="shot" viewBox="0 0 640 300" role="img" aria-label="Interface preview of a prayer hall screen: masjid name, a live clock, a five-prayer timetable with begins and jamāʿah columns, and an announcement strip.">
      <rect width="640" height="300" fill="var(--board)"/>
      <rect x="1" y="1" width="638" height="298" fill="none" stroke="var(--board-rule)"/>
      <text x="28" y="44" fill="var(--board-brass)" fontFamily="Archivo,sans-serif" fontSize="11" letterSpacing="2.2">MASJID NAME</text>
      <text x="612" y="48" fill="var(--board-ink)" fontFamily="Archivo,sans-serif" fontSize="26" textAnchor="end">18:42</text>
      <line x1="28" y1="64" x2="612" y2="64" stroke="var(--board-rule)"/>
      <g fontFamily="Archivo,sans-serif" fontSize="11" fill="var(--board-brass)" letterSpacing="1.6">
        <text x="28" y="88">PRAYER</text><text x="430" y="88" textAnchor="end">BEGINS</text><text x="612" y="88" textAnchor="end">JAMĀʿAH</text>
      </g>
      <g fontFamily="Archivo,sans-serif" fontSize="15" fill="var(--board-ink)">
        <text x="28" y="120">Fajr</text><text x="430" y="120" textAnchor="end">05:12</text><text x="612" y="120" textAnchor="end">05:45</text>
        <text x="28" y="152">Ẓuhr</text><text x="430" y="152" textAnchor="end">13:04</text><text x="612" y="152" textAnchor="end">13:30</text>
        <text x="28" y="184">ʿAṣr</text><text x="430" y="184" textAnchor="end">16:38</text><text x="612" y="184" textAnchor="end">17:15</text>
        <text x="46" y="216" fill="var(--board-brass)">Maghrib</text><text x="430" y="216" textAnchor="end" fill="var(--board-brass)">19:26</text><text x="612" y="216" textAnchor="end" fill="var(--board-brass)">19:31</text>
        <text x="28" y="248">ʿIshāʾ</text><text x="430" y="248" textAnchor="end">20:44</text><text x="612" y="248" textAnchor="end">21:00</text>
      </g>
      <rect x="28" y="206" width="6" height="6" fill="var(--board-brass)"/>
      <g stroke="var(--board-rule)">
        <line x1="28" y1="132" x2="612" y2="132"/><line x1="28" y1="164" x2="612" y2="164"/>
        <line x1="28" y1="196" x2="612" y2="196"/><line x1="28" y1="228" x2="612" y2="228"/>
        <line x1="28" y1="264" x2="612" y2="264"/>
      </g>
      <text x="28" y="284" fill="var(--board-ink-2)" fontFamily="Archivo,sans-serif" fontSize="11" letterSpacing="1.4">JANĀZAH AFTER ẒUHR TOMORROW</text>
    </svg>
    <p className="cap">Interface preview, not a screenshot. Unlimited screens run on any TV with a browser.</p>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p2" role="tabpanel" aria-labelledby="t2" tabIndex={0} hidden={true}>
    <svg className="shot" viewBox="0 0 640 300" role="img" aria-label="Interface preview of the congregation app: next jamāʿah with a countdown, a reminder offset control, and shortcuts for giving, Qibla and Zakat.">
      <rect width="640" height="300" fill="var(--paper-2)"/>
      <rect x="1" y="1" width="638" height="298" fill="none" stroke="var(--rule)"/>
      <rect x="200" y="24" width="240" height="252" fill="var(--paper)" stroke="var(--rule)"/>
      <line x1="200" y1="60" x2="440" y2="60" stroke="var(--rule)"/>
      <text x="216" y="47" fill="var(--ink-2)" fontFamily="Archivo,sans-serif" fontSize="10" letterSpacing="2">NEXT JAMĀʿAH</text>
      <text x="216" y="96" fill="var(--ink)" fontFamily="Newsreader,Georgia,serif" fontSize="34">Maghrib</text>
      <text x="216" y="122" fill="var(--brass)" fontFamily="Archivo,sans-serif" fontSize="14">19:31 &#183; in 24 min</text>
      <line x1="216" y1="142" x2="424" y2="142" stroke="var(--rule)"/>
      <text x="216" y="164" fill="var(--ink-2)" fontFamily="Archivo,sans-serif" fontSize="10" letterSpacing="2">REMIND ME</text>
      <rect x="216" y="174" width="208" height="26" fill="none" stroke="var(--rule-2)"/>
      <rect x="216" y="174" width="86" height="26" fill="var(--brass)"/>
      <text x="259" y="191" fill="var(--paper)" fontFamily="Archivo,sans-serif" fontSize="11" textAnchor="middle">20 MIN BEFORE</text>
      <g fontFamily="Archivo,sans-serif" fontSize="11" fill="var(--ink-2)">
        <rect x="216" y="216" width="64" height="44" fill="none" stroke="var(--rule)"/><text x="248" y="242" textAnchor="middle">Give</text>
        <rect x="288" y="216" width="64" height="44" fill="none" stroke="var(--rule)"/><text x="320" y="242" textAnchor="middle">Qibla</text>
        <rect x="360" y="216" width="64" height="44" fill="none" stroke="var(--rule)"/><text x="392" y="242" textAnchor="middle">Zakat</text>
      </g>
    </svg>
    <p className="cap">Interface preview, not a screenshot. Reminder offsets are set per person, not per mosque.</p>
  </div>

  <div className="panel rv" style={{ "--i": "3" } as React.CSSProperties} id="p3" role="tabpanel" aria-labelledby="t3" tabIndex={0} hidden={true}>
    <svg className="shot" viewBox="0 0 640 300" role="img" aria-label="Interface preview of the madrasah register: a class list with fictional example pupils, attendance marks for the week, and a fees status column.">
      <rect width="640" height="300" fill="var(--paper)"/>
      <rect x="1" y="1" width="638" height="298" fill="none" stroke="var(--rule)"/>
      <text x="28" y="40" fill="var(--ink)" fontFamily="Newsreader,Georgia,serif" fontSize="20">Class 4B &#183; Register</text>
      <text x="612" y="40" fill="var(--brass)" fontFamily="Archivo,sans-serif" fontSize="10" textAnchor="end" letterSpacing="1.8">IN DEVELOPMENT</text>
      <line x1="28" y1="56" x2="612" y2="56" stroke="var(--rule-2)"/>
      <g fontFamily="Archivo,sans-serif" fontSize="10" fill="var(--ink-2)" letterSpacing="1.6">
        <text x="28" y="78">PUPIL (EXAMPLE DATA)</text>
        <text x="330" y="78">M</text><text x="370" y="78">T</text><text x="410" y="78">W</text><text x="450" y="78">T</text><text x="490" y="78">F</text>
        <text x="612" y="78" textAnchor="end">FEES</text>
      </g>
      <g fontFamily="Archivo,sans-serif" fontSize="13" fill="var(--ink)">
        <text x="28" y="110">Pupil One</text><text x="28" y="146">Pupil Two</text><text x="28" y="182">Pupil Three</text><text x="28" y="218">Pupil Four</text><text x="28" y="254">Pupil Five</text>
      </g>
      <g fill="var(--brass)">
        <rect x="328" y="102" width="9" height="9"/><rect x="368" y="102" width="9" height="9"/><rect x="408" y="102" width="9" height="9"/><rect x="448" y="102" width="9" height="9"/><rect x="488" y="102" width="9" height="9"/>
        <rect x="328" y="138" width="9" height="9"/><rect x="368" y="138" width="9" height="9"/><rect x="448" y="138" width="9" height="9"/><rect x="488" y="138" width="9" height="9"/>
        <rect x="328" y="174" width="9" height="9"/><rect x="368" y="174" width="9" height="9"/><rect x="408" y="174" width="9" height="9"/><rect x="448" y="174" width="9" height="9"/><rect x="488" y="174" width="9" height="9"/>
        <rect x="328" y="210" width="9" height="9"/><rect x="408" y="210" width="9" height="9"/><rect x="448" y="210" width="9" height="9"/><rect x="488" y="210" width="9" height="9"/>
        <rect x="328" y="246" width="9" height="9"/><rect x="368" y="246" width="9" height="9"/><rect x="408" y="246" width="9" height="9"/><rect x="448" y="246" width="9" height="9"/><rect x="488" y="246" width="9" height="9"/>
      </g>
      <g stroke="var(--ink-2)" strokeWidth="1.4">
        <line x1="408" y1="142" x2="417" y2="151"/><line x1="417" y1="142" x2="408" y2="151"/>
        <line x1="368" y1="214" x2="377" y2="223"/><line x1="377" y1="214" x2="368" y2="223"/>
      </g>
      <g fontFamily="Archivo,sans-serif" fontSize="11" fill="var(--ink-2)">
        <text x="612" y="111" textAnchor="end">Paid</text><text x="612" y="147" textAnchor="end">Paid</text>
        <text x="612" y="183" textAnchor="end" fill="var(--brass)">Due</text><text x="612" y="219" textAnchor="end">Paid</text>
        <text x="612" y="255" textAnchor="end">Paid</text>
      </g>
      <g stroke="var(--rule)">
        <line x1="28" y1="122" x2="612" y2="122"/><line x1="28" y1="158" x2="612" y2="158"/>
        <line x1="28" y1="194" x2="612" y2="194"/><line x1="28" y1="230" x2="612" y2="230"/><line x1="28" y1="266" x2="612" y2="266"/>
      </g>
    </svg>
    <p className="cap">Interface preview of a module in development, not a screenshot. Pupil names are fictional placeholders — no real child's record appears on this site.</p>
  </div>
</section>
  );
}

export function Trust() {
  return (
<section className="sect wrap" id="trust">
  <p className="eyebrow eyebrow--brass rv">Your data</p>
  <h2 className="rv measure" style={{ "--i": "1" } as React.CSSProperties}>This platform will hold attendance records for your children.</h2>
  <p className="rv measure" style={{ "--i": "2" } as React.CSSProperties}>
    That deserves a straight answer before a signature, not a privacy policy
    nobody reads. Here is what is committed in writing before a masjid is ever
    invoiced.
  </p>

  <ul className="checks">
    <li className="rv"><b>One-click full export, always</b><span>Your data leaves in a standard format whenever you ask. Written into the agreement, not offered as a favour.</span></li>
    <li className="rv" style={{ "--i": "1" } as React.CSSProperties}><b>Role-based access</b><span>A teacher sees their own classes. A parent sees their own children. The committee sees committee-level data. Nobody sees everything by default.</span></li>
    <li className="rv" style={{ "--i": "2" } as React.CSSProperties}><b>ICO registration and a signed DPA</b><span>Registered with the Information Commissioner's Office, with a written data processing agreement for your masjid, before your first invoice.</span></li>
    <li className="rv" style={{ "--i": "3" } as React.CSSProperties}><b>A documented retention policy</b><span>How long a child's record is kept, and what happens when they leave, stated in advance rather than decided later.</span></li>
  </ul>

  <div className="qa">
    <details className="rv">
      <summary>We already have a website and an app. Why change?</summary>
      <div className="qa__body"><p>If the congregation side is all you need, you may well not need us — plenty of platforms do it. The reason to move is that your madrasah runs somewhere else entirely, so the same family exists twice and nothing reconciles. We join the two. That is the only thing we ask you to buy.</p></div>
    </details>
    <details className="rv">
      <summary>You are a small company in Bolton. What if you stop?</summary>
      <div className="qa__body"><p>A fair question and the one we get asked most. The answer is contractual: one-click full export of everything, in a standard format, at any time, written into your agreement from day one. You are never holding data you cannot take somewhere else.</p></div>
    </details>
    <details className="rv">
      <summary>Our madrasah runs on paper and WhatsApp. Is this too much?</summary>
      <div className="qa__body"><p>No, and migration from paper is usually simpler than migration from an existing system. Setup covers getting the class lists in and the teachers trained. Most madrasahs switch over one weekend, before a new term rather than mid-term.</p></div>
    </details>
    <details className="rv">
      <summary>Is there a commission on donations?</summary>
      <div className="qa__body"><p>No. 0%, permanently, in writing. Payment processing fees are charged by the card provider and go to them, not to us — we take nothing from what the congregation gives.</p></div>
    </details>
    <details className="rv">
      <summary>When is the madrasah portal ready?</summary>
      <div className="qa__body"><p>It is in development now, targeted at the September 2027 intake, because madrasahs change systems before a new year rather than during one. Early partner mosques go on first and help shape it. Until then we will not pretend it is shipping — the congregation modules are what is live today.</p></div>
    </details>
  </div>
</section>
  );
}

export function Contact() {
  return (
<section className="sect cta" id="contact">
  <div className="wrap cta__grid">
    <div>
      <p className="eyebrow rv">Request a demo</p>
      <h2 className="rv rv--blur measure" style={{ "--i": "1" } as React.CSSProperties}>Best seen between Maghrib and ʿIshāʾ, in your own masjid.</h2>
      <p className="rv" style={{ "--i": "2" } as React.CSSProperties}>
        Half an hour with the committee, on your screens, with your timetable
        loaded. Nobody buys this from a webpage and we would not ask you to.
      </p>
      <div className="btn-row rv" style={{ "--i": "3" } as React.CSSProperties}>
        <a className="btn btn--onboard" href="mailto:REPLACE-ME@masjidone.example?subject=MasjidOne%20demo%20request"><span className="btn__t">Email to arrange a visit <span className="arw" aria-hidden="true">→</span></span></a>
      </div>
    </div>
    <dl className="rv" style={{ "--i": "3" } as React.CSSProperties}>
      <div>
        <dt>Email</dt>
        <dd><a href="mailto:REPLACE-ME@masjidone.example" id="mail">REPLACE-ME@masjidone.example</a></dd>
        <button className="copy-btn" id="copy" type="button">Copy address</button>
      </div>
      <div>
        <dt>Telephone</dt>
        <dd>Replace with the real number</dd>
      </div>
      <div>
        <dt>Registered</dt>
        <dd>YSB Ventures Ltd<br />Bolton, United Kingdom</dd>
      </div>
    </dl>
  </div>
</section>
  );
}

export function SiteFooter() {
  return (
<footer className="ftr">
  <div className="wrap ftr__in">
    <p>&copy; <span className="num" id="yr">2026</span> YSB Ventures Ltd. All rights reserved.</p>
    <p>MasjidOne is a product of YSB Ventures Ltd, Bolton.</p>
    <a className="to-top" href="#top">Back to top <span aria-hidden="true">&uarr;</span></a>
  </div>
</footer>
  );
}
