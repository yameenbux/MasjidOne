"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import {
  DEMO_PRAYERS,
  DEMO_JUMUAH,
  DEMO_NOTICES,
  DEMO_CONGREGATION,
} from "@/lib/demo-data";

/**
 * The congregation half of the demonstration tenant.
 *
 * It exists so the chooser is not a door onto a blank room. A committee being
 * sold "one system" has to see the second half, and the sales advice is to
 * lead with Masjid Complete — which is this side plus the madrasah.
 *
 * It reuses the madrasah portal's chrome deliberately: same header, same
 * tiles, same tables. Two halves that look like one product is the argument,
 * made without a sentence.
 *
 * The prayer table prints begins and jamāʿah as two columns because that is
 * what a UK prayer board does, and because it is the distinction MasjidOne
 * sells: a calculated time is a beginning, a jamāʿah time is a decision the
 * masjid made. Numerals are tabular so the columns line up.
 */

const money = (n: number) => `£${n.toLocaleString("en-GB")}`;

export function DemoCongregation({
  masjidName,
  onSwitch,
  onSignOut,
}: {
  masjidName: string;
  onSwitch: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="dadmin">
      <header className="dadmin__top">
        <div>
          <p className="dadmin__portal">Congregation Portal</p>
          <p className="dadmin__name">{masjidName}</p>
        </div>
        <div className="dadmin__acts">
          <button type="button" className="dadmin__out" onClick={onSwitch}>
            Switch portal
          </button>
          <button type="button" className="dadmin__out" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="dadmin__body">
        <ul className="dadmin__tiles">
          {[
            ["App installs", DEMO_CONGREGATION.appInstalls.toLocaleString("en-GB")],
            ["Reminders sent", DEMO_CONGREGATION.remindersSent.toLocaleString("en-GB")],
            ["Given this month", money(DEMO_CONGREGATION.givenThisMonth)],
            ["Gift Aid claimable", money(DEMO_CONGREGATION.giftAidClaimable)],
            ["Hall screens", String(DEMO_CONGREGATION.hallScreens)],
          ].map(([label, value]) => (
            <li key={label} className="dadmin__tile">
              <span className="dadmin__tileN">{value}</span>
              <span className="dadmin__tileL">{label}</span>
            </li>
          ))}
        </ul>

        <p className="dadmin__alert" role="status">
          <strong>Next jamāʿah: ʿAsr at 16:15.</strong> Reminders go out at 15:45
          to everyone who asked for thirty minutes&apos; notice. The hall screens
          are showing the same times.
        </p>

        <div className="dcong">
          <section aria-label="Today's prayer times">
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Prayer times, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Today. Jamāʿah is the masjid&apos;s own, not a calculated time.
                  Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Prayer</th>
                    <th scope="col" className="dadmin__num">Begins</th>
                    <th scope="col" className="dadmin__num">Jamāʿah</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PRAYERS.map((p) => (
                    <tr key={p.name}>
                      <th scope="row">{p.name}</th>
                      <td className="dadmin__num">{p.begins}</td>
                      <td className="dadmin__num">
                        {p.jamaah === "—" ? <span className="dadmin__muted">—</span> : p.jamaah}
                      </td>
                    </tr>
                  ))}
                  {DEMO_JUMUAH.map((j) => (
                    <tr key={j.label}>
                      <th scope="row">{j.label}</th>
                      <td className="dadmin__num dadmin__muted">—</td>
                      <td className="dadmin__num">{j.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-label="Notices">
            <ul className="dnotice">
              {DEMO_NOTICES.map((n) => (
                <li key={n.title} className="dnotice__item">
                  <p className="dnotice__top">
                    <span className="dnotice__title">{n.title}</span>
                    {n.urgent ? (
                      <span className="dadmin__pill dadmin__pill--missing">Sent now</span>
                    ) : (
                      <span className="dnotice__when">{n.when}</span>
                    )}
                  </p>
                  <p className="dnotice__detail">{n.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoCongregation;
