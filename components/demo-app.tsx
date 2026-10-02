"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { DemoNav } from "@/components/demo-nav";
import {
  DEMO_PRAYERS,
  DEMO_JUMUAH,
  DEMO_NEXT_JAMAAH,
  DEMO_NOTICES,
  DEMO_SCREEN_CLOCK,
  DEMO_PARENT,
  DEMO_APP_REACH,
} from "@/lib/demo-data";

/**
 * The congregation app, shown in a phone.
 *
 * ONE BUILD, BOTH STORES. iPhone and Android run the same app; there is no
 * feature that exists on one and not the other, and the demo should not imply
 * a choice that does not exist.
 *
 * THE BRIDGE IS THE POINT OF THIS SCREEN. Signed out, this is a prayer-times
 * app like any other and the committee has seen a dozen. Signed in, a "Your
 * children" card appears at the top of the SAME screen — no second app, no
 * second password. That one card is the product's central claim made visible
 * instead of asserted, which is why the sign-in control sits in the frame
 * rather than behind a login wall.
 */

type Tab = "times" | "notices" | "give" | "more";

/** Giving amounts a masjid actually puts on a board. */
const AMOUNTS = [5, 10, 25, 50];

const MARK: Record<string, { glyph: string; label: string }> = {
  in: { glyph: "✓", label: "In" },
  absent: { glyph: "✗", label: "Absent" },
  late: { glyph: "L", label: "Late" },
  closed: { glyph: "—", label: "Closed" },
  upcoming: { glyph: "", label: "To come" },
};
const DAYS = ["Mon", "Tue", "Wed", "Thu"];

export function DemoApp({ masjidName }: { masjidName: string }) {
  const [tab, setTab] = React.useState<Tab>("times");
  /* Signed out is the default because that is how most of the congregation
     uses it. Signing in is what reveals the madrasah half. */
  const [signedIn, setSignedIn] = React.useState(false);
  const [offset, setOffset] = React.useState(20);
  const [amount, setAmount] = React.useState(25);
  const [giftAid, setGiftAid] = React.useState(true);
  const [said, setSaid] = React.useState<string | null>(null);

  const live = DEMO_NOTICES.filter((n) => n.published);
  const unread = live.length;

  return (
    <div className="dapp">
      <header className="dapp__top">
        <div>
          <p className="dadmin__portal">The congregation app</p>
          <h1 className="dadmin__name">{masjidName}</h1>
        </div>
        <div className="dadmin__acts">
          <button
            type="button"
            className="dadmin__out"
            onClick={() => {
              setSignedIn((v) => !v);
              setTab("times");
              setSaid(
                signedIn
                  ? "Signed out. The times, the notices and giving all still work — that is the app most of the congregation uses."
                  : "Signed in as A. Bashir. Nothing else changed: the same app, the same tab, with one card added at the top.",
              );
            }}
          >
            {signedIn ? "Sign out" : "Sign in as a parent"}
          </button>
        </div>
      </header>

      <div className="dadmin__body">
        <DemoNav
          onBack={() => window.history.back()}
          onHome={() => {
            window.location.href = "../";
          }}
          homeLabel="Demo home"
        />

        <p className="dapp__intro">
          One app on <strong>iPhone and Android</strong> — the same build on
          both, installed on{" "}
          {DEMO_APP_REACH.devices.toLocaleString("en-GB")} phones at this
          masjid. Interface preview.
        </p>

        <p className="dcong__said" role="status" aria-live="polite">
          {said}
        </p>

        <div className="dapp__stage">
          {/* The phone. A frame rather than a picture of a handset: the content
              inside is rendered from the same fixtures as every other door, so
              it cannot drift from what the office screen says. */}
          <div className="dapp__phone">
            <div className="dapp__screen">
              <div className="dapp__statusbar" aria-hidden="true">
                <span>{DEMO_SCREEN_CLOCK}</span>
                <span className="dapp__bars">▂▄▆</span>
              </div>

              <div className="dapp__view">
                {tab === "times" ? (
                  <section aria-label="Prayer times">
                    {/* THE BRIDGE. Signed in, this card sits above the times a
                        father already opens the app for. Signed out it is
                        simply absent — no second app, no second password. */}
                    {signedIn ? (
                      <a className="dapp__kids" href="../parent/">
                        <span className="dapp__kidsTop">
                          <span className="dapp__kidsLab">Your children</span>
                          <span className="dapp__kidsGo" aria-hidden="true">→</span>
                        </span>
                        {DEMO_PARENT.children.map((c) => (
                          <span className="dapp__kid" key={c.ref}>
                            <span className="dapp__kidName">{c.name}</span>
                            <span className="dapp__kidWeek">
                              {c.week.map((m, i) => (
                                <span
                                  className={`dapp__mk dapp__mk--${m}`}
                                  key={DAYS[i]}
                                  title={`${DAYS[i]}: ${MARK[m].label}`}
                                >
                                  <span aria-hidden="true">{MARK[m].glyph}</span>
                                  <span className="u-visually-hidden">
                                    {DAYS[i]} {MARK[m].label}
                                  </span>
                                </span>
                              ))}
                            </span>
                          </span>
                        ))}
                        <span className="dapp__kidsNote">
                          £90 outstanding · one child marked absent on Tuesday
                        </span>
                      </a>
                    ) : null}

                    <p className="dapp__next">
                      <span className="dapp__nextLab">Next jamāʿah</span>
                      <span className="dapp__nextVal">
                        {DEMO_NEXT_JAMAAH.name} {DEMO_NEXT_JAMAAH.at}
                      </span>
                    </p>

                    <table className="dapp__times">
                      <caption className="u-visually-hidden">
                        The masjid&rsquo;s own beginning and jamāʿah times
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Prayer</th>
                          <th scope="col">Begins</th>
                          <th scope="col">Jamāʿah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_PRAYERS.map((p) => (
                          <tr
                            key={p.name}
                            className={
                              p.name === DEMO_NEXT_JAMAAH.name ? "dapp__isnext" : undefined
                            }
                          >
                            <th scope="row">{p.name}</th>
                            <td>{p.begins}</td>
                            <td>{p.jamaah}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="dapp__jumuah">
                      {DEMO_JUMUAH.map((j) => `${j.label} ${j.time}`).join(" · ")}
                    </p>

                    <div className="dapp__offset">
                      <label htmlFor="app-offset">
                        Remind me {offset} minutes before jamāʿah
                      </label>
                      <input
                        id="app-offset"
                        type="range"
                        min={0}
                        max={45}
                        step={5}
                        value={offset}
                        onChange={(e) => setOffset(Number(e.target.value))}
                      />
                      <p className="dapp__hint">
                        Set by you, not by the masjid. A man who needs twenty
                        minutes sets twenty; a man next door sets five.
                      </p>
                    </div>
                  </section>
                ) : null}

                {tab === "notices" ? (
                  <section aria-label="Notices">
                    <ul className="dapp__notices">
                      {live.map((n) => (
                        <li
                          className={n.urgent ? "dapp__notice dapp__notice--urgent" : "dapp__notice"}
                          key={n.title}
                        >
                          <p className="dapp__noticeTop">
                            <span className="dapp__noticeKind">{n.topic}</span>
                            <span className="dapp__noticeWhen">{n.when}</span>
                          </p>
                          <p className="dapp__noticeTitle">{n.title}</p>
                          <p className="dapp__noticeBody">{n.body}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="dapp__hint">
                      Published once in the masjid office — this, the website
                      and every hall screen together.
                    </p>
                  </section>
                ) : null}

                {tab === "give" ? (
                  <section aria-label="Give">
                    <p className="dapp__giveLab">Sadaqah</p>
                    <div className="dapp__amounts">
                      {AMOUNTS.map((a) => (
                        <button
                          type="button"
                          key={a}
                          className={
                            a === amount ? "dapp__amount dapp__amount--on" : "dapp__amount"
                          }
                          aria-pressed={a === amount}
                          onClick={() => setAmount(a)}
                        >
                          £{a}
                        </button>
                      ))}
                    </div>
                    <p className="dapp__check">
                      <input
                        id="app-giftaid"
                        type="checkbox"
                        checked={giftAid}
                        onChange={(e) => setGiftAid(e.target.checked)}
                      />
                      <label htmlFor="app-giftaid">
                        Add Gift Aid — worth £{(amount * 0.25).toFixed(2)} more
                        at no cost to you
                      </label>
                    </p>
                    <button
                      type="button"
                      className="dapp__pay"
                      onClick={() =>
                        setSaid(
                          `£${amount}${giftAid ? ` plus £${(amount * 0.25).toFixed(2)} Gift Aid` : ""} given. ` +
                            "It reaches the masjid's own account — MasjidOne takes 0% commission, permanently.",
                        )
                      }
                    >
                      Give £{amount}
                      {giftAid ? ` + £${(amount * 0.25).toFixed(2)}` : ""}
                    </button>
                    <p className="dapp__hint">
                      Card, Apple Pay and Google Pay. The Gift Aid declaration
                      is captured as the donation is made rather than chased
                      afterwards. 0% commission.
                    </p>
                  </section>
                ) : null}

                {tab === "more" ? (
                  <section aria-label="More">
                    <ul className="dapp__more">
                      <li><strong>Qibla</strong><span>Which way, from where you are standing</span></li>
                      <li><strong>Zakat calculator</strong><span>Niṣāb, and what is due on it</span></li>
                      <li><strong>Everyday duʿās</strong><span>By occasion, with transliteration</span></li>
                      <li><strong>Mosque details</strong><span>Address, parking, who to ring</span></li>
                    </ul>
                    <p className="dapp__hint">
                      None of these is why a committee buys the system. They are
                      why the second app comes off the phone — and an app that
                      stays on the phone is the one your janāzah notice arrives
                      on.
                    </p>
                  </section>
                ) : null}
              </div>

              <nav className="dapp__tabs" aria-label="App sections">
                {(
                  [
                    ["times", "Times"],
                    ["notices", unread ? `Notices · ${unread}` : "Notices"],
                    ["give", "Give"],
                    ["more", "More"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="dapp__tab"
                    aria-current={tab === key ? "page" : undefined}
                    onClick={() => setTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <aside className="dapp__side">
            <h2 className="dadmin__h">
              {signedIn ? "This is the bridge" : "Sign in to see the bridge"}
            </h2>
            <p className="dapp__sideP">
              {signedIn ? (
                <>
                  Nothing about the app changed when A. Bashir signed in. Same
                  app, same tab, same prayer times — with one card added at the
                  top showing his own two children, this week&rsquo;s marks and
                  what is owed. Tap it and he is in the madrasah.
                </>
              ) : (
                <>
                  Right now this is a prayer-times app, and a committee has seen
                  a dozen of them. Press <strong>Sign in as a parent</strong>{" "}
                  and watch what appears above the times — it is the one thing
                  nobody else does.
                </>
              )}
            </p>
            <dl className="dapp__facts">
              <dt>Installed on</dt>
              <dd>
                {DEMO_APP_REACH.ios.toLocaleString("en-GB")} iPhone ·{" "}
                {DEMO_APP_REACH.android.toLocaleString("en-GB")} Android
              </dd>
              <dt>Second app to install</dt>
              <dd>None. A parent uses the one they already have.</dd>
              <dt>Commission on giving</dt>
              <dd>0%, permanently.</dd>
            </dl>
          </aside>
        </div>
      </div>

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}
