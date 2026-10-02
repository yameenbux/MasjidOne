/**
 * What counts as needing attention at a masjid.
 *
 * WHY THIS IS NOT A DASHBOARD. A grid of tiles reading "Notices: 1" is read by
 * nobody and tells you nothing — the number is right there and still means
 * nothing until you know it should have been higher. This turns the counts
 * into sentences about what is wrong, because that is the only part worth a
 * screen when you support more than one masjid and cannot look at all of them.
 *
 * THE JUDGEMENT LIVES HERE, NOT IN POSTGRES. masjid_attention() returns facts;
 * this decides which of them deserves a line. Whether an empty notice board is
 * worth flagging is a question about how we support people, and changing our
 * mind about it should not need a database migration.
 *
 * SEVERITY IS ABOUT WHO IS AFFECTED, not about how surprising it is:
 *   public   the congregation can see it, or should be able to and cannot
 *   unused   it was set up, nobody has used it — the thing that kills renewals
 *   note     worth knowing, nothing is wrong
 */
export type Facts = {
  slug: string;
  as_of: string;
  pupils: number; classes: number; staff: number; households: number;
  registers: number; attendance: number;
  charges: number; payments: number; progress: number; concerns: number;
  parent_logins: number;
  notices_written: number; notices_published: number;
  prayer_years_published: number; prayer_days_this_year: number;
  courses: number; course_signups: number;
  admissions_waiting: number; brand_images: number;
  admin_pushes: number;
};

export type Item = { level: "public" | "unused" | "note"; head: string; body: string };

export function attention(f: Facts): Item[] {
  const out: Item[] = [];
  const n = (x: number) => x.toLocaleString("en-GB");

  /* ---- what the congregation sees ------------------------------------- */
  if (f.prayer_years_published === 0) {
    out.push({
      level: "public",
      head: "No prayer timetable is published",
      body:
        "The masjid's own website and every screen in the building read from " +
        "this. Until a year is published there is nothing for them to show.",
    });
  } else if (f.prayer_days_this_year < 365) {
    out.push({
      level: "public",
      head: `The timetable runs out — ${n(f.prayer_days_this_year)} days loaded for this year`,
      body: "A gap at the end of the year is invisible until the day it arrives.",
    });
  }

  if (f.notices_published === 0) {
    out.push({
      level: "public",
      head:
        f.notices_written > 0
          ? `The notice board is empty — ${n(f.notices_written)} written, none published`
          : "The notice board is empty",
      body:
        f.notices_written > 0
          ? "Somebody wrote a notice and it never went live. The website and " +
            "the hall screens both have nothing to say."
          : "Nothing has ever been posted. The website and the hall screens " +
            "have nothing to say.",
    });
  }

  if (f.brand_images === 0) {
    out.push({
      level: "public",
      head: "No logo or images uploaded",
      body: "Their website falls back to a default. It is the first thing anybody sees.",
    });
  }

  /* ---- set up, never used --------------------------------------------- */
  if (f.pupils > 0 && f.registers === 0) {
    out.push({
      level: "unused",
      head: `No register has ever been taken — ${n(f.pupils)} pupils on the roll`,
      body:
        `${n(f.classes)} classes and ${n(f.staff)} staff are loaded, and not one ` +
        "evening has been marked. This is the thing that decides whether they renew.",
    });
  } else if (f.registers > 0 && f.attendance === 0) {
    out.push({
      level: "unused",
      head: "Registers exist but nobody has been marked on one",
      body: "Started and abandoned partway, which usually means a screen got in the way.",
    });
  }

  if (f.pupils > 0 && f.charges === 0) {
    out.push({
      level: "unused",
      head: "No fee has ever been charged",
      body:
        "The fee side is set up and has never been run. If they are still " +
        "collecting on paper, the madrasah half is not actually in use.",
    });
  } else if (f.charges > 0 && f.payments === 0) {
    out.push({
      level: "unused",
      head: `${n(f.charges)} charges raised, no payment recorded`,
      body: "Money is being taken somewhere other than here, or not at all.",
    });
  }

  if (f.parent_logins === 0) {
    out.push({
      level: "unused",
      head: "No parent has been given a login",
      body:
        "Parent access is built and enforcing. Nobody has been invited to it, " +
        "so no family has seen anything.",
    });
  } else if (f.parent_logins <= 2) {
    out.push({
      level: "note",
      head: `${n(f.parent_logins)} parent login${f.parent_logins === 1 ? "" : "s"} created`,
      body:
        "Few enough that it is probably testing rather than a rollout. Worth " +
        "knowing which before quoting it as use.",
    });
  }

  if (f.admissions_waiting > 0) {
    out.push({
      level: "note",
      head: `${n(f.admissions_waiting)} admission application waiting`,
      body: "Somebody applied and is waiting on the masjid, not on us.",
    });
  }

  if (f.concerns > 0) {
    out.push({
      level: "note",
      head: `${n(f.concerns)} concern${f.concerns === 1 ? "" : "s"} raised about a pupil`,
      body: "Theirs to handle. Listed here only so it is not a surprise.",
    });
  }

  return out;
}
