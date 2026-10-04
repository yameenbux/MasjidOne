/**
 * The connection to the MasjidOne platform.
 *
 * This is the only part of this repository that talks to the live database.
 * Everything else here is a marketing page or a demonstration built from
 * fixtures; /admin/ is the real thing, used by us, against real masajid.
 *
 * BOTH VALUES BELOW ARE SAFE TO PUBLISH, and this file is in a public
 * repository, so it is worth being precise about why. The publishable
 * ("anon") key is designed to sit in a browser. It is not a password: on its
 * own it can read and write nothing. Row Level Security in Postgres is the
 * actual protection, and every function the console calls checks
 * is_platform_admin(), which in turn requires a signed-in session that has
 * completed a second factor. The same two values are already published in the
 * the masjid portal's own config.js for the same reason.
 *
 * THE SECRET / service_role KEY MUST NEVER APPEAR HERE or anywhere else that
 * reaches a browser. It bypasses RLS entirely. If GitHub's secret scanning
 * ever blocks a push, do not click "Allow secret" — take the key out and
 * rotate it.
 *
 * Hardcoded rather than read from a repository variable on purpose. An unset
 * variable would build green and deploy a console that cannot sign anybody in,
 * which is the failure mode this repo has already been bitten by once with
 * NEXT_PUBLIC_BASE_PATH.
 */

/** The bare project origin. The dashboard shows it with /rest/v1 on the end;
 *  pasting that verbatim has broken the sibling repo twice. */
export const PLATFORM_URL = "https://phenbhmobxwyvdeshvqw.supabase.co";

export const PLATFORM_ANON_KEY = "sb_publishable_mOPuQKVP8WCTlBF2Qa1DVw_r_Tra5OO";

/**
 * Where a masjid's own portal lives.
 *
 * Each masjid is served from its own site, so this cannot be derived — it is
 * recorded per slug. A masjid missing from here can still be entered; the
 * console just cannot offer the link, and says so rather than guessing.
 *
 * The `masjids` table has a `domain` column that should eventually carry this,
 * at which point my_masjids() can return it and this map goes away.
 */
export const MASJID_PORTALS: Record<string, string> = {
  taiyabah: "https://taiyabahwebsite.ysbdesigns.uk/portal/",
};

/**
 * The page a masjid's hall screens show — their own front page, which carries
 * the prayer timetable. The console frames it so opening a masjid starts with
 * what the building is actually displaying right now, rather than a name and a
 * button.
 *
 * NOT THE HEARTBEAT, and must not be confused with it. This says what the page
 * renders. It cannot say whether a television in the building is switched on
 * and pointed at it — nothing in the platform can, because there is no screens
 * table and no function takes a screen id. A preview that loads here proves the
 * page is alive, not that anybody is looking at it.
 *
 * Separate from MASJID_PORTALS on purpose: one is the staff door, this is the
 * public face, and a masjid may well change one without the other.
 */
export const MASJID_SCREENS: Record<string, string> = {
  taiyabah: "https://taiyabahwebsite.ysbdesigns.uk/",
};

/**
 * A public file in the platform's storage, by the path masjid_brand() returns.
 *
 * The `brand` bucket is public on purpose — a masjid's logo is on their own
 * website, their letterhead and their emails. Nothing private is served from
 * it, and the console reads it with the publishable key like any visitor.
 */
export function brandAsset(storagePath: string) {
  return `${PLATFORM_URL}/storage/v1/object/public/brand/${storagePath}`;
}

/** What masjid_brand(slug) returns: current images keyed by what they are. */
export type Brand = Record<string, { path: string; alt_text: string | null }>;

export type MasjidRow = {
  slug: string;
  name: string;
  town: string;
  /** True when this is the masjid the signed-in person is currently inside. */
  current: boolean;
  /**
   * True when entering would be SUPPORT access — we are not a member of this
   * masjid, so set_current_masjid() writes masjidone_support_access into their
   * audit trail. False where we genuinely hold a role there, in which case
   * nothing is logged, because it is not support access, it is just us.
   */
  support: boolean;
};
