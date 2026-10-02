"use client";

import * as React from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PoweredBy } from "@/components/ui/powered-by";
import { BrandMark } from "@/components/ui/brand-mark";
import {
  PLATFORM_URL,
  PLATFORM_ANON_KEY,
  MASJID_PORTALS,
  type MasjidRow,
} from "@/lib/platform";
import { attention, type Facts, type Item } from "@/lib/attention";

/**
 * The LIVE MasjidOne support console. Not the demonstration — this one signs
 * into the real platform and lists the real masajid.
 *
 * ITS DEMO TWIN is components/demo-support.tsx, at /demo/support/, built from
 * fixtures. The two are deliberately the same shape: a committee shown the
 * demo is being shown what we actually use, and if they drift apart the demo
 * becomes a lie. Change one, look at the other.
 *
 * NOTHING HERE DECIDES WHO MAY DO WHAT. Every gate is in Postgres:
 *
 *   my_masjids()             returns every masjid to a platform admin, and
 *                            only your own to anybody else. It is the listing.
 *   set_current_masjid(slug) refuses unless you are a member OR a platform
 *                            admin, and when it is the latter it writes
 *                            masjidone_support_access into THAT MASJID'S audit
 *                            trail, against your name and the time.
 *   is_platform_admin()      requires is_aal2() — a session that has completed
 *                            a second factor. A password alone is not enough.
 *
 * So this file is a window onto those, not a lock. Someone who edits the
 * JavaScript in their browser gets nothing: the database refuses them exactly
 * as it refused them before. That is the point of putting the rules there.
 *
 * WHY THERE IS A SECOND SIGN-IN AT THE END. The console is served from
 * masjidone.co.uk; a masjid's portal is served from its own domain. A Supabase
 * session lives in storage scoped to one origin, so it cannot follow you
 * across. Entering still does real work — set_current_masjid() is server-side
 * state and persists — so you arrive at their portal already pointed at the
 * right masjid. You just have to sign in there. Carrying the session across
 * would mean passing tokens through a URL and re-enabling detectSessionInUrl
 * on a portal that deliberately switched it off. That is a decision about
 * somebody else's live system holding children's records, not a detail to
 * change quietly here.
 */

/**
 * What to put on screen when the platform says no.
 *
 * This console is ours, so the real message is usually the useful one — "there
 * is no masjid called x" tells whoever is standing here exactly what to do.
 * The exception is a bare network failure, which surfaces from supabase-js as
 * "Failed to fetch" and tells nobody anything. Those get a sentence that names
 * the actual situation instead.
 */
function readable(message: string | undefined): string {
  const m = (message ?? "").trim();
  if (!m) return "Something went wrong, and the platform did not say what.";
  if (/failed to fetch|networkerror|load failed/i.test(m)) {
    return "Could not reach the platform. Check the connection and try again — nothing was changed.";
  }
  return m;
}

function client(): SupabaseClient {
  return createClient(PLATFORM_URL, PLATFORM_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
}

type Stage = "password" | "mfa" | "list";

export function AdminConsole() {
  const sb = React.useMemo(client, []);
  const [stage, setStage] = React.useState<Stage>("password");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [masjids, setMasjids] = React.useState<MasjidRow[] | null>(null);
  const [who, setWho] = React.useState<string>("");
  const [entering, setEntering] = React.useState<string | null>(null);
  const [entered, setEntered] = React.useState<{ slug: string; name: string; support: boolean } | null>(null);
  const [facts, setFacts] = React.useState<Facts | null>(null);
  const [factsError, setFactsError] = React.useState<string | null>(null);
  const [factorId, setFactorId] = React.useState<string | null>(null);
  const [challengeId, setChallengeId] = React.useState<string | null>(null);

  /* An existing session should not make you sign in again. getSession() reads
     storage; the aal check decides whether you still owe a second factor. */
  React.useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await sb.auth.getSession();
      if (!live || !data.session) return;
      const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal2") {
        setWho(data.session.user.email ?? "");
        void loadMasjids();
      } else if (aal?.nextLevel === "aal2") {
        setWho(data.session.user.email ?? "");
        await beginChallenge();
      }
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMasjids() {
    setBusy(true);
    const { data, error: e } = await sb.rpc("my_masjids");
    setBusy(false);
    if (e) {
      setError(readable(e.message));
      return;
    }
    setMasjids((data ?? []) as MasjidRow[]);
    setStage("list");
  }

  /* The second factor. A platform admin without one cannot pass
     is_platform_admin() at all, so there is no path here that skips it. */
  async function beginChallenge() {
    const { data, error: e } = await sb.auth.mfa.listFactors();
    if (e) {
      setError(readable(e.message));
      return;
    }
    const totp = data?.totp?.[0];
    if (!totp) {
      setError(
        "This account has no second factor enrolled, and the platform will not " +
          "treat it as an administrator without one. Enrol one in the masjid portal first.",
      );
      return;
    }
    const ch = await sb.auth.mfa.challenge({ factorId: totp.id });
    if (ch.error) {
      setError(readable(ch.error.message));
      return;
    }
    setFactorId(totp.id);
    setChallengeId(ch.data.id);
    setStage("mfa");
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { data, error: err } = await sb.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (err) {
      /* Deliberately not "no such user" or "wrong password" — which of the two
         it was is information worth having only to somebody guessing. A network
         failure is a different thing and saying "not accepted" for it sends
         somebody hunting a password problem they do not have. */
      setError(
        /failed to fetch|networkerror|load failed/i.test(err.message ?? "")
          ? readable(err.message)
          : "That sign-in was not accepted.",
      );
      return;
    }
    setWho(data.user?.email ?? "");
    await beginChallenge();
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!factorId || !challengeId) return;
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    setBusy(true);
    setError(null);
    const { error: err } = await sb.auth.mfa.verify({ factorId, challengeId, code });
    setBusy(false);
    if (err) {
      setError("That code was not accepted. Codes last 30 seconds — try the next one.");
      return;
    }
    await loadMasjids();
  }

  async function enter(m: MasjidRow) {
    setEntering(m.slug);
    setError(null);
    const { error: e } = await sb.rpc("set_current_masjid", { p_slug: m.slug });
    setEntering(null);
    if (e) {
      setError(readable(e.message));
      return;
    }
    setEntered({ slug: m.slug, name: m.name, support: m.support });

    /* Read what is wrong with the masjid, now that we are in it. Deliberately
       after the switch rather than on the list: a list of five masajid should
       not fire five reads of everything. */
    setFacts(null);
    setFactsError(null);
    const { data, error: fe } = await sb.rpc("masjid_attention", { p_masjid: m.slug });
    if (fe) setFactsError(readable(fe.message));
    else setFacts(data as Facts);
  }

  async function signOut() {
    await sb.auth.signOut();
    setStage("password");
    setMasjids(null);
    setEntered(null);
    setWho("");
  }

  /* ---- sign in ---------------------------------------------------------- */
  if (stage === "password" || stage === "mfa") {
    return (
      <div className="lsup lsup--in">
        <div className="lsup__card">
          <BrandMark className="lsup__mark" />
          <h1 className="lsup__co">MasjidOne</h1>
          <p className="lsup__sub">Support console</p>

          {stage === "password" ? (
            <form onSubmit={signIn} className="lsup__form">
              <label className="lsup__f">
                <span className="lsup__lab">Email</span>
                <input name="email" type="email" className="lsup__in" autoComplete="username" required />
              </label>
              <label className="lsup__f">
                <span className="lsup__lab">Password</span>
                <input
                  name="password"
                  type="password"
                  className="lsup__in"
                  autoComplete="current-password"
                  required
                />
              </label>
              {error ? <p className="lsup__err" role="alert">{error}</p> : null}
              <button type="submit" className="lsup__go" disabled={busy}>
                {busy ? "Checking…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="lsup__form">
              <p className="lsup__note">
                {who ? <strong>{who}</strong> : null} The platform will not treat
                this account as an administrator on a password alone.
              </p>
              <label className="lsup__f">
                <span className="lsup__lab">Code from your authenticator</span>
                <input
                  name="code"
                  className="lsup__in lsup__code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  autoFocus
                />
              </label>
              {error ? <p className="lsup__err" role="alert">{error}</p> : null}
              <button type="submit" className="lsup__go" disabled={busy}>
                {busy ? "Checking…" : "Verify"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ---- the masajid ------------------------------------------------------ */
  const portal = entered ? MASJID_PORTALS[entered.slug] : undefined;

  return (
    <div className="lsup">
      <header className="lsup__top">
        <div className="lsup__brand">
          <BrandMark className="lsup__topMark" />
          <div>
            <h1 className="lsup__topCo">MasjidOne</h1>
            <p className="lsup__topSub">Support console · live</p>
          </div>
        </div>
        <div className="lsup__who">
          <p className="lsup__name">{who}</p>
          <button type="button" className="lsup__out" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="lsup__body">
        {entered ? (
          <div className="lsup__entered" role="status">
            <h2 className="lsup__enteredH">You are now in {entered.name}</h2>
            <p className="lsup__p">
              {entered.support ? (
                <>
                  You do not hold a role at {entered.name}, so this was recorded
                  as <code>masjidone_support_access</code> in{" "}
                  <strong>their</strong> audit trail, against your name and the
                  time.
                </>
              ) : (
                <>
                  Nothing was written to their audit trail, because this is not
                  support access — you hold a role at {entered.name}, so you
                  entered as one of their own administrators.
                </>
              )}
            </p>
            <AttentionList facts={facts} error={factsError} />

            {portal ? (
              <>
                <a className="lsup__enter" href={portal} target="_blank" rel="noopener noreferrer">
                  Open {entered.name}&apos;s portal
                </a>
                <p className="lsup__small">
                  Their portal is on their own domain, so it will ask you to
                  sign in again — a session cannot follow you across origins.
                  You will land pointed at {entered.name} either way, because
                  that part is held in the database rather than in this browser.
                </p>
              </>
            ) : (
              <p className="lsup__small">
                No portal address is recorded for this masjid, so there is
                nothing to link to. You are still switched into it.
              </p>
            )}
            <button type="button" className="lsup__back" onClick={() => setEntered(null)}>
              ← Back to the list
            </button>
          </div>
        ) : (
          <>
            <h2 className="lsup__h">Masjids we support</h2>
            <p className="lsup__lede">
              {masjids === null
                ? "Reading…"
                : `${masjids.length} ${masjids.length === 1 ? "masjid" : "masajid"} on the platform.`}
            </p>
            {error ? <p className="lsup__err" role="alert">{error}</p> : null}

            <ul className="lsup__grid">
              {(masjids ?? []).map((m) => (
                <li className="lsup__card2" key={m.slug}>
                  <div className="lsup__cardTop">
                    <h3 className="lsup__cardName">{m.name}</h3>
                    {m.current ? <span className="lsup__now">You are here</span> : null}
                  </div>
                  <p className="lsup__cardTown">
                    {m.town} · <code>{m.slug}</code>
                  </p>
                  <p className={m.support ? "lsup__sup" : "lsup__own"}>
                    {m.support ? (
                      <>
                        <span aria-hidden="true">▪ </span>
                        Entering writes to their audit trail
                      </>
                    ) : (
                      <>You hold a role here — entering is not support access</>
                    )}
                  </p>
                  <button
                    type="button"
                    className="lsup__enter"
                    onClick={() => enter(m)}
                    disabled={entering === m.slug}
                  >
                    {entering === m.slug ? "Entering…" : "Enter"}
                    <span className="u-visually-hidden"> {m.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            {masjids !== null && masjids.length === 0 ? (
              <p className="lsup__p">
                The platform returned no masajid for this account. That means it
                is not a platform administrator, not that there are none.
              </p>
            ) : null}
          </>
        )}
      </div>

      <footer className="lsup__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

/**
 * What is wrong at this masjid, or an explicit "nothing is".
 *
 * An empty list has to SAY it is empty. A panel that renders nothing when
 * there is nothing wrong is indistinguishable from one that failed to load,
 * and the second is the state you would want to know about.
 */
function AttentionList({ facts, error }: { facts: Facts | null; error: string | null }) {
  if (error) {
    return (
      <p className="lsup__err" role="alert">
        Could not read what needs attention: {error}
      </p>
    );
  }
  if (!facts) return <p className="lsup__small">Reading what needs attention…</p>;

  const items: Item[] = attention(facts);

  return (
    <section className="lsup__att" aria-label="What needs attention">
      <h3 className="lsup__attH">
        {items.length === 0
          ? "Nothing here needs attention"
          : `${items.length} thing${items.length === 1 ? "" : "s"} need${items.length === 1 ? "s" : ""} attention`}
      </h3>

      {items.length === 0 ? (
        <p className="lsup__small">
          Everything this console can see is as it should be. It cannot see
          everything — see the note below.
        </p>
      ) : (
        <ul className="lsup__attList">
          {items.map((it) => (
            <li className={`lsup__att1 lsup__att1--${it.level}`} key={it.head}>
              <p className="lsup__attT">{it.head}</p>
              <p className="lsup__attB">{it.body}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Said plainly rather than left as a silence that reads like a zero. */}
      <p className="lsup__small lsup__attNote">
        <strong>This cannot see the app or the screens.</strong> How many phones
        have the app is held by the push provider, not in the database, and the
        platform has no record of a television in a building at all — there is
        no screens table and nothing takes a screen id. Neither absence means
        zero; it means not visible from here.
      </p>
    </section>
  );
}

export default AdminConsole;
