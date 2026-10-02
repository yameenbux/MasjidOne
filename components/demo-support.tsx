"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { BrandMark } from "@/components/ui/brand-mark";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import {
  DEMO_SUPPORT_MASJIDS,
  DEMO_SUPPORT_USER,
  DEMO_SUPPORT_CREDENTIALS,
  type SupportMasjid,
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
  const [entered, setEntered] = React.useState<SupportMasjid | null>(null);

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
        {entered ? (
          <section aria-label={`Inside ${entered.name}`}>
            <button
              type="button"
              className="dsup__back"
              onClick={() => setEntered(null)}
            >
              ← All masajid
            </button>

            {/* The banner is the whole ethic of this screen. You are standing in
                somebody else's system and it says so, to you, in their words. */}
            <div className="dsup__inside" role="status">
              <p className="dsup__insideH">
                You are inside <strong>{entered.name}</strong>
              </p>
              <p className="dsup__insideP">
                Support access. You are not a member of this masjid, so this has
                been written into <strong>their</strong> audit trail — not ours —
                as <code>masjidone_support_access</code>, against your name and
                the time. The committee can see it whenever they look.
              </p>
              <p className="dsup__insideP">
                One masjid at a time. Nothing in the system reads across masajid
                at once, so no screen anywhere shows you two congregations
                together.
              </p>
            </div>

            <dl className="dsup__facts">
              <div><dt>Town</dt><dd>{entered.town}</dd></div>
              <div><dt>Plan</dt><dd>{entered.plan}</dd></div>
              <div><dt>Pupils on roll</dt><dd>{entered.pupils ? entered.pupils.toLocaleString("en-GB") : "—"}</dd></div>
              <div><dt>State</dt><dd>{entered.state}</dd></div>
            </dl>

            <p className="dsup__next">
              From here you would open their madrasah portal, their office or
              their screens exactly as their own committee sees them — the same
              pages, with a band across the top saying whose system you are in.
            </p>
          </section>
        ) : (
          <section aria-label="Masjids we support">
            <h2 className="dsup__h">Masjids we support</h2>
            <p className="dsup__lede">
              Enter one to help with something. Entering a masjid you do not
              belong to is written into that masjid&rsquo;s own audit trail, with
              your name against it.
            </p>

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

                  <button
                    type="button"
                    className="dsup__enter"
                    onClick={() => setEntered(m)}
                  >
                    Enter
                    <span className="u-visually-hidden"> {m.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
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
