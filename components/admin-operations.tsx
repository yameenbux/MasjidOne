"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MasjidRow } from "@/lib/platform";

/**
 * The operations half of the support console: what each masjid is on, what is
 * still missing before they can open, and the one place a new masjid is
 * created.
 *
 * WHY IT IS A SEPARATE FILE. AdminConsole is the thing that already works and
 * signs into a live platform. This talks to functions that DO NOT EXIST IN
 * PRODUCTION YET — migrations 001 and 002 in founder/platform-migrations are
 * written and tested but not applied. Keeping them apart means a half-applied
 * migration degrades one panel rather than breaking the console.
 *
 * SO IT MUST FAIL SOFT, AND DOES. PostgREST answers PGRST202 for a function it
 * cannot find. Every call here treats that as "not migrated yet" and says so
 * in plain words, rather than showing a committee-facing error or, worse, an
 * empty panel that reads as "nothing to do".
 *
 * NOTHING HERE DECIDES WHO MAY DO WHAT. Same as the console: create_masjid,
 * masjid_setup_checklist, masjid_go_live and masjid_take_offline each check
 * is_platform_admin() internally, which requires is_aal2(). Editing the
 * JavaScript gets you nothing.
 *
 * WHAT IS DELIBERATELY NOT HERE: deleting a masjid. There is no such function
 * and there should not be one — a masjid's rows include children's attendance
 * and safeguarding records under statutory retention. Taking a customer off
 * the platform is take-offline, plus an export, plus a retention decision.
 */

type ChecklistItem = { item: string; done: boolean; why: string };
type Checklist = {
  masjid: string;
  is_live: boolean;
  plan: string | null;
  admin_invited: boolean;
  admin_active: boolean;
  missing: number;
  ready: boolean;
  items: ChecklistItem[];
};

/** PostgREST's code for "no such function" — i.e. the migration is not applied. */
const NOT_MIGRATED = "PGRST202";

const FRIENDLY: Record<string, string> = {
  masjid_profile: "Masjid details",
  prayer_years: "Prayer timetable",
  madrasah_settings: "Madrasah settings",
  madrasah_years: "Madrasah year",
  madrasah_fee_settings: "Fee settings",
  app_settings: "Push notifications",
};

export function AdminOperations({
  sb,
  masjids,
  onChanged,
}: {
  sb: SupabaseClient;
  masjids: MasjidRow[];
  onChanged: () => void;
}) {
  const [checks, setChecks] = React.useState<Record<string, Checklist>>({});
  const [migrated, setMigrated] = React.useState<boolean | null>(null);
  const [open, setOpen] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(false);

  const load = React.useCallback(async () => {
    if (masjids.length === 0) return;
    const next: Record<string, Checklist> = {};
    let seen = false;
    for (const m of masjids) {
      const { data, error: e } = await sb.rpc("masjid_setup_checklist", { p_slug: m.slug });
      if (e) {
        /* One missing function means the migration is not applied at all.
           Say that once, rather than once per masjid. */
        if (e.code === NOT_MIGRATED) { setMigrated(false); return; }
        setError(e.message);
        continue;
      }
      seen = true;
      next[m.slug] = data as Checklist;
    }
    if (seen) setMigrated(true);
    setChecks(next);
  }, [sb, masjids]);

  React.useEffect(() => { void load(); }, [load]);

  async function act(slug: string, fn: string, args: Record<string, unknown>) {
    setBusy(slug);
    setError(null);
    const { error: e } = await sb.rpc(fn, args);
    setBusy(null);
    if (e) { setError(e.message); return; }
    await load();
    onChanged();
  }

  if (migrated === false) {
    return (
      <section className="ops" aria-label="Running the platform">
        <h2 className="lsup__h">Running the platform</h2>
        <p className="ops__note">
          <strong>Not switched on yet.</strong> Migrations 001 and 002 are
          written and tested but have not been applied to the platform, so
          there is nothing here to show. Until they are, a second masjid has to
          be created by hand.
        </p>
      </section>
    );
  }

  return (
    <section className="ops" aria-label="Running the platform">
      <h2 className="lsup__h">Running the platform</h2>
      <p className="lsup__lede">
        What each masjid is on, and what is still missing before they can open.
      </p>
      {error ? <p className="lsup__err" role="alert">{error}</p> : null}

      <ul className="ops__list">
        {masjids.map((m) => {
          const c = checks[m.slug];
          return (
            <li className="ops__row" key={m.slug}>
              <div className="ops__head">
                <h3 className="ops__name">{m.name}</h3>
                <span className={c?.is_live ? "ops__tag ops__tag--live" : "ops__tag"}>
                  {c === undefined ? "…" : c.is_live ? "Live" : "Not live"}
                </span>
              </div>

              <p className="ops__meta">
                <code>{m.slug}</code>
                {c?.plan ? <> · {c.plan}</> : <> · <em>no plan recorded</em></>}
                {c && !c.admin_active ? (
                  <> · <strong>nobody can sign in</strong></>
                ) : null}
              </p>

              {c ? (
                c.ready ? (
                  <p className="ops__ok">Setup complete.</p>
                ) : (
                  <>
                    <button
                      type="button"
                      className="ops__disc"
                      aria-expanded={open === m.slug}
                      onClick={() => setOpen(open === m.slug ? null : m.slug)}
                    >
                      {c.missing} of {c.items.length} setup items still missing
                    </button>
                    {open === m.slug ? (
                      <ul className="ops__items">
                        {c.items.map((it) => (
                          <li key={it.item} className={it.done ? "is-done" : undefined}>
                            <span aria-hidden="true">{it.done ? "✓" : "·"}</span>
                            <span className="u-visually-hidden">
                              {it.done ? "Done: " : "Still needed: "}
                            </span>
                            <strong>{FRIENDLY[it.item] ?? it.item}</strong>
                            <span className="ops__why">{it.why}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )
              ) : null}

              <p className="ops__acts">
                {c && !c.is_live ? (
                  <button
                    type="button"
                    className="btn btn--solid"
                    disabled={busy === m.slug || !c.ready || !c.admin_active}
                    onClick={() => act(m.slug, "masjid_go_live", { p_slug: m.slug })}
                    title={
                      !c.ready
                        ? "Finish the setup items first"
                        : !c.admin_active
                          ? "Nobody at this masjid has claimed their invitation yet"
                          : undefined
                    }
                  >
                    Take live
                  </button>
                ) : c ? (
                  <button
                    type="button"
                    className="btn"
                    disabled={busy === m.slug}
                    onClick={() => {
                      const why = window.prompt(
                        `Why is ${m.name} going offline? This switches off their prayer times, and the reason is written to their audit trail.`,
                      );
                      if (why && why.trim()) {
                        void act(m.slug, "masjid_take_offline", { p_slug: m.slug, p_reason: why });
                      }
                    }}
                  >
                    Take offline
                  </button>
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="ops__disc ops__newtoggle"
        aria-expanded={showNew}
        onClick={() => setShowNew(!showNew)}
      >
        {showNew ? "Cancel" : "Onboard a new masjid"}
      </button>
      {showNew ? <NewMasjid sb={sb} onDone={() => { setShowNew(false); void load(); onChanged(); }} /> : null}
    </section>
  );
}

function NewMasjid({ sb, onDone }: { sb: SupabaseClient; onDone: () => void }) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { error: err } = await sb.rpc("create_masjid", {
      payload: {
        slug: String(f.get("slug") ?? "").trim(),
        name: String(f.get("name") ?? "").trim(),
        town: String(f.get("town") ?? "").trim(),
        plan: String(f.get("plan") ?? "complete"),
        band: String(f.get("band") ?? "") || null,
        admin_email: String(f.get("admin_email") ?? "").trim(),
        admin_name: String(f.get("admin_name") ?? "").trim(),
      },
    });
    setBusy(false);
    /* The database's own messages are written to be read by a person — "A slug
       must be 3 to 31 characters…" — so they are shown as they are rather than
       replaced with something vaguer. */
    if (err) { setError(err.message); return; }
    onDone();
  }

  return (
    <form className="cform ops__new" onSubmit={submit}>
      <p className="ops__note">
        The masjid is created <strong>not live</strong>. Nothing public can see
        it until the setup is finished and you take it live deliberately.
      </p>
      <div className="cform__grid">
        <p className="cform__field">
          <label htmlFor="ops-name">Name <span aria-hidden="true">*</span></label>
          <input id="ops-name" name="name" required />
        </p>
        <p className="cform__field">
          <label htmlFor="ops-slug">Slug <span aria-hidden="true">*</span></label>
          <input id="ops-slug" name="slug" required pattern="[a-z][a-z0-9-]{2,30}" />
          <span className="cform__hint">
            Lowercase letters, numbers and hyphens. It ends up in URLs and in
            their reference numbers, so changing it later is a migration.
          </span>
        </p>
        <p className="cform__field">
          <label htmlFor="ops-town">Town</label>
          <input id="ops-town" name="town" />
        </p>
        <p className="cform__field">
          <label htmlFor="ops-plan">Plan</label>
          <select id="ops-plan" name="plan" defaultValue="complete">
            <option value="complete">Masjid Complete</option>
            <option value="madrasah">Madrasah</option>
          </select>
        </p>
        <p className="cform__field">
          <label htmlFor="ops-band">Size band</label>
          <select id="ops-band" name="band" defaultValue="">
            <option value="">Not set yet</option>
            <option value="a">Up to 100 pupils</option>
            <option value="b">101 to 250</option>
            <option value="c">251 to 500</option>
            <option value="d">Over 500</option>
          </select>
          <span className="cform__hint">
            The band, not the price. What a band costs lives on the website, so
            it is in one place only.
          </span>
        </p>
        <p className="cform__field">
          <label htmlFor="ops-admin">First administrator&rsquo;s email</label>
          <input id="ops-admin" name="admin_email" type="email" />
          <span className="cform__hint">
            An invitation, not an account. It grants nothing until they sign up
            and claim it.
          </span>
        </p>
      </div>
      {error ? <p className="lsup__err" role="alert">{error}</p> : null}
      <button className="btn btn--solid" type="submit" disabled={busy}>
        {busy ? "Creating…" : "Create masjid"}
      </button>
    </form>
  );
}
