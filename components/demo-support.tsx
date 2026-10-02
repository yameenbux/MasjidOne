"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { BrandMark } from "@/components/ui/brand-mark";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import {
  DEMO_SUPPORT_MASJIDS,
  DEMO_SUPPORT_USER,
  DEMO_SUPPORT_CREDENTIALS,
} from "@/lib/demo-data";

/**
 * The MasjidOne support console.
 *
 * WHAT IT IS. The door our own people use, not a masjid's. Sign in, see the
 * masajid we look after, enter one to help with something.
 *
 * WHAT MAKES IT DEFENSIBLE, and it is already built this way in the platform:
 * set_current_masjid(slug) lets a platform admin enter a masjid they do not
 * belong to, and writes `masjidone_support_access` into THAT MASJID'S OWN audit
 * log when it does. One masjid at a time. No function anywhere reads across
 * masajid at once.
 *
 * So this screen says that out loud rather than hiding it. "Can your people
 * get into our system?" is a question every committee asks, and the only good
 * answer is the honest one: yes, one at a time, and your own audit records it.
 * A console that quietly showed four masajid's data side by side would be the
 * wrong thing to build.
 */

export function DemoSupport() {
  const [signedIn, setSignedIn] = React.useState(false);

  if (!signedIn) {
    return (
      <MasjidAccessLogin
        masjidName="MasjidOne"
        portalLabel="Support"
        userLabel="Your sign-in"
        userType="text"
        notice="Demonstration · sample data. Not a live console and not a real sign-in."
        onSignIn={(user, pass) =>
          user.trim().toLowerCase() === DEMO_SUPPORT_CREDENTIALS.user &&
          pass === DEMO_SUPPORT_CREDENTIALS.pass
            ? (setSignedIn(true), null)
            : "That is not a sign-in we recognise."
        }
        hint={
          <>
            Sign in with <code>{DEMO_SUPPORT_CREDENTIALS.user}</code> /{" "}
            <code>{DEMO_SUPPORT_CREDENTIALS.pass}</code>.
          </>
        }
      />
    );
  }

  return (
    <div className="dsup">
      <header className="dsup__top">
        <div className="dsup__brand">
          <BrandMark className="dsup__mark" />
          <div>
            {/* The company name at the top, because this is our console and not
                a masjid's — every other door in the demo leads with theirs. */}
            <h1 className="dsup__co">MasjidOne</h1>
            <p className="dsup__sub">Support console</p>
          </div>
        </div>
        <div className="dsup__who">
          <p className="dsup__name">{DEMO_SUPPORT_USER.name}</p>
          <p className="dsup__role">{DEMO_SUPPORT_USER.role}</p>
        </div>
      </header>

      <div className="dsup__body">
        <section aria-label="Masjids we support">
          <h2 className="dsup__h">Masjids we support</h2>
          <p className="dsup__lede">Enter one to help with something.</p>

          <ul className="dsup__grid">
            {DEMO_SUPPORT_MASJIDS.map((m) => (
              <li className="dsup__card" key={m.slug}>
                <div className="dsup__cardTop">
                  <h3 className="dsup__cardName">{m.name}</h3>
                  <span
                    className={`dsup__state dsup__state--${m.state
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {m.state}
                  </span>
                </div>
                <p className="dsup__cardTown">{m.town}</p>

                <dl className="dsup__cardFacts">
                  <div><dt>Plan</dt><dd>{m.plan}</dd></div>
                  <div>
                    <dt>Pupils</dt>
                    <dd>{m.pupils ? m.pupils.toLocaleString("en-GB") : "—"}</dd>
                  </div>
                </dl>

                {m.flag ? (
                  <p className="dsup__flag">
                    <span aria-hidden="true">▪ </span>
                    {m.flag}
                  </p>
                ) : m.note ? (
                  <p className="dsup__note">{m.note}</p>
                ) : null}

                {/* Straight in. There used to be a summary screen between this
                    and the masjid, which was a click for information somebody
                    needs BEFORE they press Enter, not after. It is below the
                    cards now, where it is read first. */}
                <a
                  className="dsup__enter"
                  href={`../?masjid=${encodeURIComponent(m.name)}&support=1#portals`}
                >
                  Enter
                  <span className="u-visually-hidden"> {m.name}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* What used to be its own screen. It belongs here: a committee's
              first question is whether we can get into their system, and the
              answer should be in front of our own people every time they do. */}
          <div className="dsup__terms">
            <h3 className="dsup__termsH">The committee will know you were there</h3>
            <p className="dsup__termsP">
              Entering a masjid you do not belong to writes{" "}
              <code>masjidone_support_access</code> into{" "}
              <strong>their</strong> audit trail — not ours — against your name
              and the time. They can see it whenever they look, and nobody has
              to be told it happened.
            </p>
            <p className="dsup__termsP">
              <strong>One masjid at a time.</strong> Nothing in the system reads
              across masajid at once, so no screen anywhere puts two
              congregations in front of you together.
            </p>
          </div>
        </section>
      </div>

      <footer className="dsup__foot">
        <p className="dsup__footNote">
          {DEMO_SUPPORT_MASJIDS.length} masajid · sample data, not customers
        </p>
        <PoweredBy />
      </footer>
    </div>
  );
}
