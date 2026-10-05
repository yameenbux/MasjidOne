"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Who runs MasjidOne — and the one thing that must never be confused with it.
 *
 * MasjidOne is a supplier. A masjid is a customer. An account that is both
 * enters a customer's database as one of their own administrators, so the
 * visit is NOT recorded as masjidone_support_access and the masjid has no way
 * to see that their supplier was in there. It also makes the relationship
 * unendable: the founder's platform access is permanent because he owns the
 * company, while his role at a masjid is theirs to remove whenever they choose
 * — and with one login those are the same act, so neither can happen cleanly.
 *
 * SO THIS PANEL EXISTS TO MAKE THE HANDOVER A THING YOU CLICK. Done by hand it
 * is three statements against a live database with one chance to get the order
 * wrong, and the wrong order locks the owner out of his own company:
 * is_platform_admin() requires aal2, so an account without two-step holds a row
 * that grants nothing. The database refuses that (platform_admin_add checks for
 * a verified factor, platform_admin_remove refuses to leave nobody able), and
 * this screen shows the same facts so the refusal is never a surprise.
 *
 * NOBODY IS DELETED, THEY ARE RETIRED. "Who could run the platform in March" is
 * a question an access-control table should be able to answer, so the row is
 * kept with a revoked_at and shown under "no longer".
 *
 * IT FAILS SOFT, like the operations panel beside it: PostgREST answers
 * PGRST202 for a function it cannot find, which means the migration is not
 * applied here, and that is said in a sentence rather than shown as an error.
 */

const NOT_MIGRATED = "PGRST202";

type RoleAt = { masjid: string; role: string };
type Admin = {
  email: string | null;
  user_id: string;
  two_step: boolean;
  is_you: boolean;
  since: string | null;
  roles_at_masajid: RoleAt[];
};
type Former = { email: string | null; retired_at: string };
type List = { as_of: string; admins: Admin[]; former: Former[]; able: number };
type Separation = { wearing_two_hats: number; platform_admins: number; why: string };

export function AdminAccess({ sb }: { sb: SupabaseClient }) {
  const [list, setList] = React.useState<List | null>(null);
  const [sep, setSep] = React.useState<Separation | null>(null);
  const [migrated, setMigrated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);

  const load = React.useCallback(async () => {
    const { data, error: e } = await sb.rpc("platform_admins_list");
    if (e) {
      if (e.code === NOT_MIGRATED) { setMigrated(false); return; }
      setError(e.message);
      return;
    }
    setList(data as List);
    const { data: s } = await sb.rpc("access_separation_report");
    if (s) setSep(s as Separation);
  }, [sb]);

  React.useEffect(() => { void load(); }, [load]);

  async function call(fn: string, args: Record<string, unknown>, ok: string) {
    setBusy(true); setError(null); setNote(null);
    const { error: e } = await sb.rpc(fn, args);
    setBusy(false);
    if (e) { setError(e.message); return false; }
    setNote(ok);
    await load();
    return true;
  }

  if (!migrated) {
    return (
      <section className="ops" aria-label="Who runs MasjidOne">
        <h2 className="lsup__h">Who runs MasjidOne</h2>
        <p className="ops__note">
          <strong>Not switched on yet.</strong> db/139 is written and tested but
          has not been applied to this platform.
        </p>
      </section>
    );
  }

  return (
    <section className="ops" aria-label="Who runs MasjidOne">
      <h2 className="lsup__h">Who runs MasjidOne</h2>
      <p className="lsup__lede">
        This is the company&rsquo;s own access, not a masjid&rsquo;s. Keeping the
        two apart is what puts <code>masjidone_support_access</code> in a
        customer&rsquo;s audit trail when we go into their database.
      </p>

      {error ? <p className="lsup__err" role="alert">{error}</p> : null}
      {note ? <p className="ops__ok" role="status">{note}</p> : null}

      {/* The warning that matters, and the steps, in the order that cannot
          lock you out. Shown only while it is true. */}
      {sep && sep.wearing_two_hats > 0 ? (
        <div className="ops__note" role="note">
          <p>
            <strong>
              {sep.wearing_two_hats === 1
                ? "One account is both MasjidOne and a masjid."
                : `${sep.wearing_two_hats} accounts are both MasjidOne and a masjid.`}
            </strong>{" "}
            Entering that masjid from it is not recorded as support access, and
            the masjid cannot end it separately from your ownership of MasjidOne.
          </p>
          <ol className="ops__steps">
            <li>
              Create a MasjidOne account on a <code>masjidone.co.uk</code>{" "}
              address, sign in once, and <strong>enrol two-step</strong>.
            </li>
            <li>
              Add it below. There are then two of you, so there is no way to be
              locked out. The database refuses an account without two-step,
              because such a row grants nothing.
            </li>
            <li>Sign in as it and check this console works.</li>
            <li>
              Only then retire the old one. Its roles at the masjid are{" "}
              <strong>not touched</strong> — that stays theirs to end whenever
              they choose.
            </li>
          </ol>
        </div>
      ) : null}

      <ul className="ops__admins">
        {(list?.admins ?? []).map((a) => (
          <li key={a.user_id}>
            <p className="ops__adminhead">
              <strong>{a.email ?? a.user_id}</strong>
              {a.is_you ? <span className="ops__tag">You</span> : null}
              <span className={a.two_step ? "ops__tag ops__tag--live" : "ops__tag"}>
                {a.two_step ? "Two-step on" : "No two-step"}
              </span>
            </p>
            {!a.two_step ? (
              <p className="ops__why">
                This account cannot actually use the console —{" "}
                <code>is_platform_admin()</code> requires two-step, so the row
                grants nothing until it is enrolled.
              </p>
            ) : null}
            {a.roles_at_masajid.length > 0 ? (
              <p className="ops__why">
                <strong>Also holds a role at a masjid:</strong>{" "}
                {a.roles_at_masajid.map((r) => `${r.role} at ${r.masjid}`).join(", ")}.
                Visits to that masjid are not logged as support access.
              </p>
            ) : null}
            <p className="ops__acts">
              <button
                type="button"
                className="btn"
                disabled={busy || (list?.able ?? 0) < 2}
                title={
                  (list?.able ?? 0) < 2
                    ? "There would be nobody left able to run MasjidOne"
                    : undefined
                }
                onClick={() => {
                  if (
                    window.confirm(
                      `Retire ${a.email} from MasjidOne?\n\nTheir roles at any masjid are NOT touched. The row is kept so the history of who held the keys survives.`,
                    )
                  ) {
                    void call("platform_admin_remove", { p_email: a.email }, `${a.email} retired from MasjidOne.`);
                  }
                }}
              >
                <span className="btn__t">Retire from MasjidOne</span>
              </button>
            </p>
          </li>
        ))}
      </ul>

      {(list?.former ?? []).length > 0 ? (
        <>
          <h3 className="ops__subh">No longer</h3>
          <ul className="ops__linelist">
            {(list?.former ?? []).map((f, i) => (
              <li key={i}>
                {f.email} — retired {String(f.retired_at).slice(0, 10)}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="ops__acts">
        <button type="button" className="btn btn--solid" disabled={busy}
                onClick={() => setAdding(!adding)}>
          <span className="btn__t">{adding ? "Cancel" : "Add a MasjidOne account"}</span>
        </button>
      </p>

      {adding ? (
        <form
          className="cform cform--tight"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const email = String(f.get("email") ?? "").trim();
            if (email) {
              void call("platform_admin_add", { p_email: email }, `${email} can now run MasjidOne.`)
                .then((good) => { if (good) setAdding(false); });
            }
          }}
        >
          <p className="cform__field">
            <label htmlFor="pa-email">Their email address</label>
            <input id="pa-email" name="email" type="email" required
                   placeholder="you@masjidone.co.uk" />
            <span className="cform__hint">
              The account must already exist, have two-step enrolled, and hold
              no role at any masjid. All three are checked before it is added.
            </span>
          </p>
          <button className="btn btn--solid" type="submit" disabled={busy}>
            <span className="btn__t">{busy ? "Adding…" : "Add"}</span>
          </button>
        </form>
      ) : null}
    </section>
  );
}
