/**
 * Fictional data for the demonstration tenant at /demo.
 *
 * Every name, figure and balance here is invented. Nothing in this file comes
 * from a live masjid, and it must stay that way — the repository is public, and
 * publishing a real child's record or a real family's fee history is the one
 * thing the content rules never allow.
 *
 * The scale is deliberately NOT Taiyabah's. Their real roll is 552 pupils, 48
 * classes, 41 staff and 330 households; if the demo used those numbers a
 * screenshot of it would read as a screenshot of them. 438/36/31/268 is the
 * same order of magnitude — big enough that paper registers plainly hurt, which
 * is the point the demo has to make — without impersonating a customer.
 *
 * Names are ordinary and generic on purpose. They are placeholders standing in
 * for a roll, not portraits of anybody.
 */

export const DEMO_MASJID_DEFAULT = "Masjid al-Bayān";

/** Headline figures for the admin dashboard. */
export const DEMO_TOTALS = {
  pupils: 438,
  classes: 36,
  staff: 31,
  households: 268,
  guardians: 341,
} as const;

export type RegisterState = "locked" | "submitted" | "draft" | "missing";

export type RegisterRow = {
  className: string;
  teacher: string;
  onRoll: number;
  present: number;
  state: RegisterState;
  /** Wall-clock time the register moved to its current state. */
  at: string;
};

/**
 * Today's registers. The mix is the sales argument in one table: most are
 * locked, one is still a draft, and one was never taken at all. A paper
 * register cannot show you the last row, which is the whole point.
 */
export const DEMO_REGISTERS: RegisterRow[] = [
  { className: "Qāʿidah 1A", teacher: "A. Patel", onRoll: 18, present: 17, state: "locked", at: "17:42" },
  { className: "Qāʿidah 1B", teacher: "S. Begum", onRoll: 19, present: 18, state: "locked", at: "17:44" },
  { className: "Qāʿidah 2A", teacher: "M. Hussain", onRoll: 17, present: 15, state: "locked", at: "17:41" },
  { className: "Nāẓirah 3A", teacher: "F. Khatun", onRoll: 21, present: 20, state: "locked", at: "17:48" },
  { className: "Nāẓirah 3B", teacher: "I. Rahman", onRoll: 20, present: 16, state: "submitted", at: "17:55" },
  { className: "Nāẓirah 4A", teacher: "Z. Mahmood", onRoll: 22, present: 21, state: "locked", at: "17:39" },
  { className: "Hifz (boys)", teacher: "Qārī Y. Ismail", onRoll: 14, present: 14, state: "locked", at: "17:36" },
  { className: "Hifz (girls)", teacher: "Qāriah N. Bibi", onRoll: 12, present: 11, state: "submitted", at: "17:58" },
  { className: "ʿĀlimah 1", teacher: "Ustādhah R. Ali", onRoll: 16, present: 13, state: "draft", at: "18:02" },
  { className: "Nāẓirah 4B", teacher: "H. Choudhury", onRoll: 20, present: 0, state: "missing", at: "—" },
  { className: "Qāʿidah 2B", teacher: "H. Choudhury", onRoll: 16, present: 15, state: "locked", at: "17:46" },
];

export type FeeRow = {
  household: string;
  /** Number of children on roll in this household. */
  children: number;
  monthly: number;
  balance: number;
  /** Months in arrears. 0 means up to date. */
  behind: number;
  lastPaid: string;
};

/**
 * Fee ledger, per family rather than per pupil — which is how a masjid office
 * actually thinks about it, and why the sibling rate matters. A negative
 * balance is credit.
 *
 * Monthly rates sit in the £15–£35 band that UK madrasahs publish, with a
 * sibling rate applied above one child.
 */
export const DEMO_FEES: FeeRow[] = [
  { household: "Household 1042 · Adam", children: 3, monthly: 60, balance: 180, behind: 3, lastPaid: "June" },
  { household: "Household 1108 · Bashir", children: 2, monthly: 45, balance: 90, behind: 2, lastPaid: "July" },
  { household: "Household 1203 · Chowdhury", children: 1, monthly: 25, balance: 25, behind: 1, lastPaid: "August" },
  { household: "Household 1017 · Dawood", children: 4, monthly: 70, balance: 0, behind: 0, lastPaid: "September" },
  { household: "Household 1330 · Ebrahim", children: 2, monthly: 45, balance: 135, behind: 3, lastPaid: "June" },
  { household: "Household 1291 · Farooq", children: 1, monthly: 25, balance: 0, behind: 0, lastPaid: "September" },
  { household: "Household 1156 · Gani", children: 3, monthly: 60, balance: -60, behind: 0, lastPaid: "September" },
  { household: "Household 1074 · Haque", children: 2, monthly: 45, balance: 45, behind: 1, lastPaid: "August" },
];

/**
 * How the 268 households divide by children on roll.
 *
 * This exists because the tiles above the fee table used to be the sum of the
 * eight rows printed beneath them — £375 "billed this month" on a roll of 268
 * households. A treasurer does that arithmetic in their head during the demo,
 * and £375 across 268 families is the moment they stop believing the screen.
 * The eight rows are a working list, not the ledger, so the tiles are now
 * computed from the whole roll instead.
 *
 * Both totals are load-bearing: the households must sum to DEMO_TOTALS.households
 * and the children to DEMO_TOTALS.pupils, or two tiles on the same screen
 * disagree. There is an assertion below that says so.
 */
const HOUSEHOLD_MIX = [
  { children: 1, households: 144 },
  { children: 2, households: 86 },
  { children: 3, households: 30 },
  { children: 4, households: 8 },
] as const;

/** The published sibling rate, read off the rows above: £25, then +£20, +£15, +£10. */
const MONTHLY_FOR = (children: number) => ({ 1: 25, 2: 45, 3: 60, 4: 70 })[children] ?? 70;

/** Share of families behind, and what they owe on average. Both are ordinary
 *  for a madrasah that chases, and neither is flattering enough to look staged. */
const ARREARS_RATE = 0.12;
const AVERAGE_ARREARS = 92;

const HOUSEHOLDS_IN_ARREARS = Math.round(
  HOUSEHOLD_MIX.reduce((n, g) => n + g.households, 0) * ARREARS_RATE,
);

export const DEMO_FEE_SUMMARY = {
  /** What the whole madrasah is behind, not what these eight families are. */
  outstanding: HOUSEHOLDS_IN_ARREARS * AVERAGE_ARREARS,
  inArrears: HOUSEHOLDS_IN_ARREARS,
  billedMonthly: HOUSEHOLD_MIX.reduce(
    (n, g) => n + g.households * MONTHLY_FOR(g.children),
    0,
  ),
  /** The eight rows printed beneath the tiles, so the caption can say so. */
  shown: DEMO_FEES.length,
};

/* The promise made above, enforced. If someone edits the roll or the mix and
   the two stop agreeing, the build fails here rather than the demo quietly
   showing a committee two tiles that contradict each other. */
{
  const households = HOUSEHOLD_MIX.reduce((n, g) => n + g.households, 0);
  const pupils = HOUSEHOLD_MIX.reduce((n, g) => n + g.households * g.children, 0);
  if (households !== DEMO_TOTALS.households || pupils !== DEMO_TOTALS.pupils) {
    throw new Error(
      `Fee mix disagrees with the roll: ${households} households and ${pupils} pupils, ` +
        `but the tiles say ${DEMO_TOTALS.households} and ${DEMO_TOTALS.pupils}.`,
    );
  }
}

export type PupilRow = {
  ref: string;
  name: string;
  className: string;
  guardian: string;
  attendance: number;
};

/**
 * A slice of the roll. Not all 438 — but every household the fees table bills
 * appears here with exactly the number of children it is billed for, so a
 * committee can cross-check any family between the two screens and the numbers
 * hold. The assertion below enforces that; before it, Household 1017 was billed
 * for four children and listed two.
 */
export const DEMO_PUPILS: PupilRow[] = [
  { ref: "P-0431", name: "Pupil A. Adam", className: "Nāẓirah 3A", guardian: "Household 1042", attendance: 96 },
  { ref: "P-0432", name: "Pupil B. Adam", className: "Qāʿidah 1A", guardian: "Household 1042", attendance: 91 },
  { ref: "P-0433", name: "Pupil C. Adam", className: "Qāʿidah 2A", guardian: "Household 1042", attendance: 88 },
  { ref: "P-0388", name: "Pupil A. Bashir", className: "Hifz (boys)", guardian: "Household 1108", attendance: 99 },
  { ref: "P-0389", name: "Pupil B. Bashir", className: "Nāẓirah 4A", guardian: "Household 1108", attendance: 84 },
  { ref: "P-0295", name: "Pupil A. Chowdhury", className: "ʿĀlimah 1", guardian: "Household 1203", attendance: 78 },
  { ref: "P-0120", name: "Pupil A. Dawood", className: "Hifz (girls)", guardian: "Household 1017", attendance: 97 },
  { ref: "P-0121", name: "Pupil B. Dawood", className: "Nāẓirah 3B", guardian: "Household 1017", attendance: 93 },
  { ref: "P-0501", name: "Pupil C. Dawood", className: "Qāʿidah 1A", guardian: "Household 1017", attendance: 94 },
  { ref: "P-0502", name: "Pupil D. Dawood", className: "Qāʿidah 1B", guardian: "Household 1017", attendance: 99 },
  { ref: "P-0503", name: "Pupil A. Ebrahim", className: "Qāʿidah 2A", guardian: "Household 1330", attendance: 92 },
  { ref: "P-0504", name: "Pupil B. Ebrahim", className: "Qāʿidah 2B", guardian: "Household 1330", attendance: 80 },
  { ref: "P-0505", name: "Pupil A. Farooq", className: "Nāẓirah 3A", guardian: "Household 1291", attendance: 95 },
  { ref: "P-0506", name: "Pupil A. Gani", className: "Nāẓirah 3B", guardian: "Household 1156", attendance: 100 },
  { ref: "P-0507", name: "Pupil B. Gani", className: "Nāẓirah 4A", guardian: "Household 1156", attendance: 90 },
  { ref: "P-0508", name: "Pupil C. Gani", className: "Nāẓirah 4B", guardian: "Household 1156", attendance: 98 },
  { ref: "P-0509", name: "Pupil A. Haque", className: "Hifz (boys)", guardian: "Household 1074", attendance: 89 },
  { ref: "P-0510", name: "Pupil B. Haque", className: "Hifz (girls)", guardian: "Household 1074", attendance: 85 },
  { ref: "P-0511", name: "Pupil A. Ibrahim", className: "ʿĀlimah 1", guardian: "Household 1055", attendance: 97 },
  { ref: "P-0512", name: "Pupil B. Ibrahim", className: "Qāʿidah 1A", guardian: "Household 1055", attendance: 96 },
  { ref: "P-0513", name: "Pupil A. Jamal", className: "Qāʿidah 1B", guardian: "Household 1187", attendance: 87 },
  { ref: "P-0514", name: "Pupil A. Kassim", className: "Qāʿidah 2A", guardian: "Household 1214", attendance: 82 },
  { ref: "P-0515", name: "Pupil B. Kassim", className: "Qāʿidah 2B", guardian: "Household 1214", attendance: 76 },
  { ref: "P-0516", name: "Pupil C. Kassim", className: "Nāẓirah 3A", guardian: "Household 1214", attendance: 94 },
  { ref: "P-0517", name: "Pupil A. Latif", className: "Nāẓirah 3B", guardian: "Household 1098", attendance: 99 },
  { ref: "P-0518", name: "Pupil B. Latif", className: "Nāẓirah 4A", guardian: "Household 1098", attendance: 92 },
  { ref: "P-0519", name: "Pupil A. Mahmood", className: "Nāẓirah 4B", guardian: "Household 1262", attendance: 80 },
  { ref: "P-0520", name: "Pupil B. Mahmood", className: "Hifz (boys)", guardian: "Household 1262", attendance: 95 },
  { ref: "P-0521", name: "Pupil A. Nasir", className: "Hifz (girls)", guardian: "Household 1133", attendance: 100 },
  { ref: "P-0522", name: "Pupil A. Osman", className: "ʿĀlimah 1", guardian: "Household 1309", attendance: 90 },
  { ref: "P-0523", name: "Pupil B. Osman", className: "Qāʿidah 1A", guardian: "Household 1309", attendance: 98 },
  { ref: "P-0524", name: "Pupil A. Patel", className: "Qāʿidah 1B", guardian: "Household 1176", attendance: 89 },
  { ref: "P-0525", name: "Pupil B. Patel", className: "Qāʿidah 2A", guardian: "Household 1176", attendance: 85 },
  { ref: "P-0526", name: "Pupil C. Patel", className: "Qāʿidah 2B", guardian: "Household 1176", attendance: 97 },
  { ref: "P-0527", name: "Pupil A. Qureshi", className: "Nāẓirah 3A", guardian: "Household 1221", attendance: 96 },
  { ref: "P-0528", name: "Pupil A. Rashid", className: "Nāẓirah 3B", guardian: "Household 1245", attendance: 87 },
  { ref: "P-0529", name: "Pupil B. Rashid", className: "Nāẓirah 4A", guardian: "Household 1245", attendance: 82 },
  { ref: "P-0530", name: "Pupil A. Saleh", className: "Nāẓirah 4B", guardian: "Household 1067", attendance: 76 },
  { ref: "P-0531", name: "Pupil B. Saleh", className: "Hifz (boys)", guardian: "Household 1067", attendance: 94 },
  { ref: "P-0532", name: "Pupil A. Tahir", className: "Hifz (girls)", guardian: "Household 1288", attendance: 99 },
];

/* Every household the fee table bills must appear on the roll with exactly the
   number of children it is charged for, or a committee cross-checking the two
   screens finds the demo contradicting itself. Fails the build, not the demo. */
{
  for (const fee of DEMO_FEES) {
    const ref = fee.household.split(" · ")[0];
    const onRoll = DEMO_PUPILS.filter((p) => p.guardian === ref).length;
    if (onRoll !== fee.children) {
      throw new Error(
        `${fee.household} is billed for ${fee.children} children but ${onRoll} appear on the roll.`,
      );
    }
  }
}



/**
 * The seeded sign-in. Shown on the screen on purpose: this is a demonstration
 * with no real account behind it, and a login box on a public URL that looks
 * like it guards something real is worse than one that says plainly it does
 * not.
 */
export const DEMO_CREDENTIALS = { user: "demo", pass: "demo" } as const;

/**
 * The parent's demonstration sign-in, kept separate from the staff one so a
 * walkthrough can show both doors without one being mistaken for the other.
 *
 * A parent's sign-in is issued by the madrasah rather than self-registered:
 * the office creates it against a household, which is why the field says
 * "Your sign-in" rather than "Email". A good number of parents will not have
 * an email address they check, and a portal that insists on one excludes the
 * families the madrasah most needs to reach.
 */
export const DEMO_PARENT_CREDENTIALS = { user: "parent", pass: "parent" } as const;

/* ---------------------------------------------------------------------------
   Congregation side
   --------------------------------------------------------------------------
   The other half of the join. Same invented masjid, same invented people — a
   committee has to see that both halves exist before "one system" means
   anything, and a chooser that leads to a dead end makes the opposite point.

   Every shape below mirrors a table that is actually built, because a demo
   that shows a screen the platform cannot produce is a promise that comes due
   in week three:

     prayer_times        one row per day, begins and jamāʿah per prayer
     notices             published is a boolean, so drafts are a real state
     app_notifications   carries recipients, status and error per send
     donations           gift_aid and claimed_at, so unclaimed is answerable
     hall_bookings       reference, status, office_notes, deposit_status
     nikah_requests      reference, status, agreed_date, fee_status
     charity_collections reference, status, org_name
     admission_applications  a madrasah admission arriving through the public
                         site — the join, in one row

   Deliberately NOT modelled: hall screens as devices, and appeals with running
   totals. Neither has a table, so neither gets a panel.
   ------------------------------------------------------------------------- */

export type PrayerRow = { name: string; begins: string; jamaah: string };

/** Begins and jamāʿah as two columns, the rhythm a UK prayer board uses. */
export const DEMO_PRAYERS: PrayerRow[] = [
  { name: "Fajr", begins: "05:42", jamaah: "06:15" },
  { name: "Sunrise", begins: "07:14", jamaah: "—" },
  { name: "Zuhr", begins: "12:58", jamaah: "13:30" },
  { name: "ʿAsr", begins: "15:46", jamaah: "16:15" },
  { name: "Maghrib", begins: "18:31", jamaah: "18:36" },
  { name: "ʿIshāʾ", begins: "20:02", jamaah: "20:15" },
];

export const DEMO_JUMUAH = [
  { label: "First Jumuʿah", time: "13:15" },
  { label: "Second Jumuʿah", time: "14:00" },
];

/** The time printed on the hall-screen preview.
 *
 *  Fixed, not `new Date()`, and that is the point: the sample times below are
 *  fixed too, so a real clock would have the preview announce ʿAsr as "next" at
 *  eleven at night. 15:52 sits between ʿAsr beginning (15:46) and its jamāʿah
 *  (16:15), which is the only window where every number on that screen agrees
 *  with every other one. Change the prayer times and change this with them. */
export const DEMO_SCREEN_CLOCK = "15:52";

/** Which prayer the page should mark as next. Keeps the table and the banner
 *  from drifting apart when either is edited. */
export const DEMO_NEXT_JAMAAH = { name: "ʿAsr", at: "16:15", remindAt: "15:45" };

/* ---- The inbox: what the public asked for and the office has not answered ---- */

export type RequestKind = "Hall" | "Nikah" | "Collection" | "Admission" | "Course";
export type RequestRow = {
  kind: RequestKind;
  reference: string;
  who: string;
  detail: string;
  submitted: string;
  status: "New" | "Held" | "In progress";
  /** Set where the row carries money, as hall and nikah rows do. */
  money?: string;
  /** True for the admission, which is the one that crosses into the madrasah. */
  crosses?: boolean;
};

export const DEMO_REQUESTS: RequestRow[] = [
  {
    kind: "Hall",
    reference: "HH-26-0184",
    who: "A. Patel",
    detail: "Main hall + kitchen, Saturday evening",
    submitted: "2 hours ago",
    status: "Held",
    money: "Deposit unpaid · hold expires in 46h",
  },
  {
    kind: "Admission",
    reference: "AD-26-0031",
    who: "The Dawood household",
    detail: "Two children, September intake",
    submitted: "Yesterday",
    status: "New",
    crosses: true,
  },
  {
    kind: "Nikah",
    reference: "NK-26-0012",
    who: "I. Rahman",
    detail: "Preferred 14 March, afternoon, ~60 guests",
    submitted: "Yesterday",
    status: "New",
    money: "Fee unpaid",
  },
  {
    kind: "Collection",
    reference: "CC-26-0007",
    who: "Al-Imdaad Trust",
    detail: "Chanda after Jumuʿah, certificate attached",
    submitted: "3 days ago",
    status: "In progress",
  },
  {
    kind: "Course",
    reference: "CR-26-0066",
    who: "S. Begum",
    detail: "Tajwīd for sisters, Tuesday cohort",
    submitted: "4 days ago",
    status: "New",
  },
];

/* ---- Notices, which are drafts until somebody presses Publish ---- */

export type NoticeRow = {
  topic: string;
  title: string;
  body: string;
  when: string;
  published: boolean;
  /** Set once it has gone to the app. Mirrors app_notifications.recipients. */
  reached?: number;
  urgent?: boolean;
};

export const DEMO_NOTICES: NoticeRow[] = [
  {
    topic: "Janāzah",
    title: "Janāzah after Zuhr today",
    body: "Burial to follow at the cemetery. Lifts leaving from the car park.",
    when: "Sent 11:04",
    published: true,
    reached: 1180,
    urgent: true,
  },
  {
    topic: "Madrasah",
    title: "Madrasah half term",
    body: "No classes Monday to Thursday next week.",
    when: "Published yesterday",
    published: true,
    reached: 1174,
  },
  {
    topic: "Appeal",
    title: "Roof appeal update",
    body: "£18,400 raised of the £45,000 target. Jazākum Allāhu khayran.",
    when: "Draft",
    published: false,
  },
  {
    topic: "Timetable",
    title: "Winter timetable",
    body: "ʿIshāʾ moves to 19:45 from the first of next month.",
    when: "Draft",
    published: false,
  },
];

/* ---- Giving. Unclaimed Gift Aid is real money a committee can go and get ---- */

export type DonationRow = {
  reference: string;
  purpose: string;
  amount: number;
  giftAid: boolean;
  claimed: boolean;
  when: string;
};

export const DEMO_DONATIONS: DonationRow[] = [
  { reference: "DN-26-1841", purpose: "Roof appeal", amount: 500, giftAid: true, claimed: false, when: "Today" },
  { reference: "DN-26-1840", purpose: "General", amount: 50, giftAid: true, claimed: false, when: "Today" },
  { reference: "DN-26-1839", purpose: "Roof appeal", amount: 1000, giftAid: true, claimed: true, when: "Yesterday" },
  { reference: "DN-26-1838", purpose: "Sadaqah", amount: 20, giftAid: false, claimed: false, when: "Yesterday" },
  { reference: "DN-26-1837", purpose: "General", amount: 250, giftAid: true, claimed: false, when: "2 days ago" },
];

/** Derived, so the tiles cannot drift from the tables beneath them. */
export const DEMO_GIVING = {
  month: 4280,
  /** Gift Aid on donations that carry a declaration and have not been claimed.
   *  25p in the pound, the HMRC rate. */
  unclaimed: Math.round(
    DEMO_DONATIONS.filter((d) => d.giftAid && !d.claimed).reduce((n, d) => n + d.amount, 0) * 0.25,
  ),
  commission: "0%",
};

export const DEMO_CONGREGATION = {
  needsYou: DEMO_REQUESTS.length,
  drafts: DEMO_NOTICES.filter((n) => !n.published).length,
  lastReach: DEMO_NOTICES.find((n) => n.reached)?.reached ?? 0,
} as const;

/* ---- Committee and roles, and what the system has been doing ---- */

/** The five roles the platform actually defines. Parent is listed because the
 *  role exists in the schema; it is marked unused because `user_roles` holds
 *  zero parent accounts, which is also why parent access stays tagged in
 *  development everywhere on this site. */
export type RoleRow = {
  role: string;
  people: number;
  can: string;
  /** True where the role is defined but nobody holds it yet. */
  unused?: boolean;
};

export const DEMO_ROLES: RoleRow[] = [
  { role: "Admin", people: 3, can: "Everything, including who else gets an account" },
  { role: "Teacher", people: 31, can: "Their own classes — register, pupils, nothing financial" },
  { role: "Hall office", people: 2, can: "Hall hire, nikah and course enquiries" },
  { role: "Madrasah", people: 1, can: "The whole madrasah: registers, fees, families" },
  { role: "Parent", people: 0, can: "Their own children only", unused: true },
];

/** What the audit log actually records.
 *
 *  Worth knowing what this is NOT: it is not only a list of who clicked what.
 *  Most of the real log is the platform keeping the retention promises the
 *  masjid was sold — holds expiring, donation records ageing out, applications
 *  purged after their window. The rest is human actions and the occasional
 *  anomaly worth a second look. The sample keeps that proportion. */
export type AuditRow = { at: string; who: string; action: string; detail: string; kind: "person" | "system" | "flag" };

export const DEMO_AUDIT: AuditRow[] = [
  { at: "Today 18:14", who: "A. Khan (admin)", action: "teacher_login_created", detail: "New login for the Tuesday girls' class", kind: "person" },
  { at: "Today 03:00", who: "The system", action: "hall_holds_purged", detail: "4 unpaid hall holds released after 48 hours", kind: "system" },
  { at: "Yesterday 16:40", who: "The system", action: "payment_without_reference", detail: "£60 received with no reference — needs matching to a family", kind: "flag" },
  { at: "Yesterday 03:00", who: "The system", action: "admission_applications_purged", detail: "11 unsuccessful applications deleted at the end of their retention window", kind: "system" },
  { at: "3 days ago 09:22", who: "S. Patel (madrasah)", action: "fee_rate_changed", detail: "Second-child rate £22.00 → £20.00", kind: "person" },
  { at: "3 days ago 03:00", who: "The system", action: "donations_purged", detail: "Gift Aid records older than the statutory period removed", kind: "system" },
];

/* ---- The madrasah year ---- */

export type ClosureRow = { name: string; from: string; to: string; note?: string };
export type EventRow = { name: string; hijri: string; on: string; estimated: boolean };

/** Term dates and holidays. Date ranges, because a half term is a week and a
 *  single-date field would make the office enter five rows for it. */
export const DEMO_CLOSURES: ClosureRow[] = [
  { name: "Insert day", from: "1 Sep", to: "1 Sep", note: "Staff only — no pupils" },
  { name: "Half term", from: "26 Oct", to: "29 Oct" },
  { name: "End of term break", from: "21 Dec", to: "1 Jan" },
  { name: "Ramaḍān holidays", from: "8 Feb", to: "12 Mar" },
  { name: "Summer half term", from: "31 May", to: "4 Jun" },
  { name: "End of year", from: "26 Jul", to: "3 Sep" },
];

/** The Islamic calendar, with the one honest detail that matters: every
 *  moon-dependent date is marked estimated until it is sighted. A system that
 *  printed Eid as a fixed date would be wrong one year in two. */
export const DEMO_EVENTS: EventRow[] = [
  { name: "Mawlid an-Nabī ﷺ", hijri: "12 Rabīʿ al-Awwal", on: "24 Sep", estimated: true },
  { name: "Laylat al-Miʿrāj", hijri: "27 Rajab", on: "15 Jan", estimated: true },
  { name: "Ramaḍān begins", hijri: "1 Ramaḍān", on: "8 Feb", estimated: true },
  { name: "Last ten nights begin", hijri: "21 Ramaḍān", on: "28 Feb", estimated: true },
  { name: "ʿĪd al-Fiṭr", hijri: "1 Shawwāl", on: "10 Mar", estimated: true },
  { name: "ʿĪd al-Aḍḥā", hijri: "10 Dhū al-Ḥijjah", on: "17 May", estimated: true },
];

/* ---- Bringing a madrasah's existing data in ---- */

/** What the £499 setup fee actually does, as a finished import.
 *
 *  Every field here maps to a column in the real import tables — including the
 *  ones nobody enjoys discussing: medical notes, allergies, SEND and EHCP
 *  detail, and whether a child may walk home alone. They come across because a
 *  madrasah that loses them in a migration has lost the things that matter
 *  most. */
export const DEMO_IMPORT = {
  source: "One spreadsheet and two years of paper registers",
  pupils: 438,
  classes: 36,
  guardians: 341,
  households: 268,
  siblingsLinked: 173,
  /** The system proposes a sibling link and says why; a human confirms it. */
  siblingsForReview: 6,
  /* Stored mid-sentence, because this list is joined into a sentence. Do not
     lowercase it on the way out: SEND and EHCP are acronyms a madrasah
     secretary reads every week, and "send and ehcp" is simply wrong. */
  carried: [
    "medical notes and allergies",
    "SEND and EHCP detail",
    "whether a child may walk home alone",
    "previous madrasah, and the date they joined",
  ],
} as const;

/* ---- Office and parents, in one thread ---- */

/** Messaging is parent-to-office, which is why it is tagged in development
 *  rather than shown as working: the office half is built, but no parent has an
 *  account to write from. The thread below is what it looks like once they do. */
export type ThreadRow = {
  subject: string;
  household: string;
  last: string;
  state: "Open" | "Answered";
  unread: boolean;
  openedByParent: boolean;
};

export const DEMO_THREADS: ThreadRow[] = [
  { subject: "Collecting Yusuf early on Thursdays", household: "The Dawood household", last: "2 hours ago", state: "Open", unread: true, openedByParent: true },
  { subject: "Fee instalment for this term", household: "The Rahman household", last: "Yesterday", state: "Answered", unread: false, openedByParent: true },
  { subject: "Half term dates", household: "The Begum household", last: "4 days ago", state: "Answered", unread: false, openedByParent: false },
];

/* ---- What one parent sees ---- */

/**
 * The household the demonstration parent signs in as: 1108 · Bashir, chosen
 * because it already exists everywhere else in this file. Two children on the
 * roll, £90 outstanding and two months behind in DEMO_FEES, and attendance of
 * 99% and 84% in DEMO_PUPILS. Every figure below is derived from those rows
 * rather than typed again, so the parent's view and the office's view of the
 * same family can never disagree — which is the entire product thesis, and
 * would be an embarrassing thing to get wrong in the demo of it.
 *
 * The 84% child is deliberate. A portal that only ever shows a perfect record
 * demonstrates nothing: the reason a parent opens this is the week something
 * was missed.
 */
export type ParentChildRow = {
  ref: string;
  name: string;
  className: string;
  teacher: string;
  attendance: number;
  /** Monday to Thursday of this week. */
  week: ("in" | "absent" | "late" | "closed" | "upcoming")[];
  note?: string;
};

const BASHIR = DEMO_FEES.find((f) => f.household.includes("Bashir"))!;
const BASHIR_CHILDREN = DEMO_PUPILS.filter((p) => p.guardian === "Household 1108");

export const DEMO_PARENT = {
  household: "Household 1108 · Bashir",
  guardian: "A. Bashir",
  children: BASHIR_CHILDREN.map((p, i): ParentChildRow => ({
    ref: p.ref,
    name: p.name,
    className: p.className,
    teacher: i === 0 ? "Ustādh Y." : "Apa S.",
    attendance: p.attendance,
    week: i === 0
      ? ["in", "in", "in", "upcoming"]
      : ["in", "absent", "late", "upcoming"],
    note: i === 1 ? "Marked absent on Tuesday. Nobody told the madrasah why." : undefined,
  })),
  fees: {
    monthly: BASHIR.monthly,
    outstanding: BASHIR.balance,
    monthsBehind: BASHIR.behind,
    lastPaid: BASHIR.lastPaid,
  },
  /** The thread already in DEMO_THREADS, from the parent's side. */
  openThread: "Collecting early on Thursdays",
} as const;

/** The evening's session times, so "next session" is not invented twice. */
export const DEMO_PARENT_SESSION = { days: "Monday to Thursday", from: "17:30", to: "19:00" } as const;

/* ---- Hifz and sabaq progress ---- */

/**
 * Shaped from the real `madrasah_progress` table, which is more considered
 * than a progress log usually is and decides the design:
 *
 *   sabaq / sabqi / manzil   the three classical divisions — the new lesson,
 *                            the recent revision, the older revision — as free
 *                            text, because "Al-Baqarah 142–148" is how a
 *                            teacher writes it and a dropdown would fight them.
 *   note_for_parent          what the parent reads.
 *   note_internal            what the parent does not. A teacher needs somewhere
 *                            to write "struggling since the move" without it
 *                            landing on a father's phone.
 *   shared                   the teacher decides, per entry, whether the parent
 *                            sees it at all. Nothing reaches a parent by
 *                            default.
 *
 * STILL IN DEVELOPMENT. The table exists and holds zero rows; no teacher has
 * ever written one. Every screen built on this carries the tag.
 */
export type ProgressRow = {
  pupilRef: string;
  on: string;
  sabaq: string;
  sabqi: string;
  manzil: string;
  noteForParent?: string;
  noteInternal?: string;
  shared: boolean;
};

export const DEMO_PROGRESS: ProgressRow[] = [
  {
    pupilRef: "P-0388", on: "Wed 1 Oct",
    sabaq: "Al-Baqarah 142–148", sabqi: "Al-Baqarah 120–141", manzil: "Juzʾ 1",
    noteForParent: "Fluent today. Ready to move on.",
    shared: true,
  },
  {
    pupilRef: "P-0388", on: "Tue 30 Sep",
    sabaq: "Al-Baqarah 136–141", sabqi: "Al-Baqarah 115–135", manzil: "Juzʾ 1",
    noteForParent: "Two slips on 139. Worth hearing him again at home.",
    shared: true,
  },
  {
    pupilRef: "P-0388", on: "Mon 29 Sep",
    sabaq: "Al-Baqarah 130–135", sabqi: "Al-Baqarah 110–129", manzil: "Juzʾ 1",
    noteInternal: "Tired all week — ask the office whether anything has changed at home.",
    shared: false,
  },
  {
    pupilRef: "P-0389", on: "Wed 1 Oct",
    sabaq: "Qāʿidah p.41 — joined letters", sabqi: "p.38–40", manzil: "—",
    noteForParent: "Reading more confidently. Keep going five minutes a night.",
    shared: true,
  },
];

/** One child's term, week by week, for the parent's detail view. */
export type TermWeek = { week: string; marks: ("in" | "absent" | "late" | "closed")[] };

export const DEMO_TERM: Record<string, TermWeek[]> = {
  "P-0388": [
    { week: "29 Sep", marks: ["in", "in", "in", "in"] },
    { week: "22 Sep", marks: ["in", "in", "in", "in"] },
    { week: "15 Sep", marks: ["in", "in", "late", "in"] },
    { week: "8 Sep", marks: ["in", "in", "in", "in"] },
    { week: "1 Sep", marks: ["closed", "in", "in", "in"] },
  ],
  "P-0389": [
    { week: "29 Sep", marks: ["in", "absent", "late", "in"] },
    { week: "22 Sep", marks: ["in", "in", "absent", "in"] },
    { week: "15 Sep", marks: ["absent", "absent", "in", "in"] },
    { week: "8 Sep", marks: ["in", "in", "in", "in"] },
    { week: "1 Sep", marks: ["closed", "in", "in", "in"] },
  ],
};

/** What the £90 is made of — charges and payments against the family. */
export const DEMO_LEDGER = [
  { on: "1 Oct", what: "Monthly fee — October", charge: 45, paid: 0 },
  { on: "1 Sep", what: "Monthly fee — September", charge: 45, paid: 0 },
  { on: "28 Jul", what: "Payment received — card", charge: 0, paid: 45 },
  { on: "1 Jul", what: "Monthly fee — July", charge: 45, paid: 0 },
] as const;

/** Why a parent says a child will be away. The office sees the reason. */
export const DEMO_ABSENCE_REASONS = [
  "Unwell",
  "Away travelling",
  "A family commitment",
  "A school commitment",
  "Something else",
] as const;


/* ---- What one teacher sees ---- */

/**
 * The demonstration teacher is H. Choudhury, chosen because Nāẓirah 4B is the
 * register nobody took tonight. A teacher signing in and being met by the one
 * thing they have not done is the product earning its keep in a single screen;
 * a teacher met by a tidy list of completed work demonstrates nothing.
 *
 * Their classes are filtered out of DEMO_REGISTERS by name rather than listed
 * again, so the teacher's view and the office's view of the same evening
 * cannot disagree.
 *
 * WHAT A TEACHER MUST NOT SEE, and the demo asserts it: any other teacher's
 * class, the whole roll, anything about fees, any family's balance. The
 * platform gates this with is_teacher() across eight functions; the demo has
 * to show the same shape or it is selling an access model that does not exist.
 */
export const DEMO_TEACHER_NAME = "H. Choudhury";

export const DEMO_TEACHER_CLASSES = DEMO_REGISTERS.filter(
  (r) => r.teacher === DEMO_TEACHER_NAME,
);

/** The class with no register, pupil by pupil, ready to mark. */
export const DEMO_TEACHER_ROLL: { ref: string; name: string; flag?: string }[] = [
  { ref: "P-0501", name: "Pupil A. Choudhury" },
  { ref: "P-0502", name: "Pupil B. Iqbal" },
  { ref: "P-0503", name: "Pupil C. Jamal", flag: "Walks home alone" },
  { ref: "P-0504", name: "Pupil D. Karim" },
  { ref: "P-0505", name: "Pupil E. Latif", flag: "Inhaler kept in the office" },
  { ref: "P-0506", name: "Pupil F. Mahmood" },
  { ref: "P-0507", name: "Pupil G. Nasir" },
  { ref: "P-0508", name: "Pupil H. Osman" },
];

/** What a teacher can raise, straight from the real raise_concern function. */
export const DEMO_CONCERN_KINDS = [
  "Repeated absence",
  "Something a child said",
  "A change in behaviour",
  "An injury I noticed",
  "Something a parent told me",
  "Other",
] as const;

/* ---- What the madrasah tells parents, and what they say back ---- */

/**
 * Notices a parent receives. Shaped from madrasah_parent_notices, and these
 * are the reason an app stays installed: a closure the evening before, and a
 * janāzah the same morning. A parent who only ever opens this for a fee stops
 * opening it.
 */
export type ParentNotice = {
  title: string;
  body: string;
  when: string;
  kind: "Closure" | "Madrasah" | "Masjid";
  unread?: boolean;
};

export const DEMO_PARENT_NOTICES: ParentNotice[] = [
  {
    title: "Closed next week — half term",
    body: "No classes Monday 26th to Thursday 29th October. We reopen on Monday 2nd November at the usual time.",
    when: "2 days ago", kind: "Closure", unread: true,
  },
  {
    title: "Parents' evening, Thursday 15th",
    body: "Ten minutes with your child's teacher. Reply to this message to pick a time, or speak to the office.",
    when: "5 days ago", kind: "Madrasah", unread: true,
  },
  {
    title: "Janāzah after Zuhr today",
    body: "Brother Ismāʿīl, father of a family in the madrasah. Janāzah after Zuhr at the masjid.",
    when: "Last week", kind: "Masjid",
  },
];

/** One thread, both sides, so a parent can read and answer rather than be told they could. */
export type ThreadMessage = { from: "parent" | "office"; who: string; at: string; body: string };

export const DEMO_PARENT_THREAD: { subject: string; messages: ThreadMessage[] } = {
  subject: "Collecting early on Thursdays",
  messages: [
    {
      from: "parent", who: "You", at: "Monday, 19:12",
      body: "Asalāmu ʿalaykum. From this Thursday I need to collect both children at 18:30 rather than 19:00 — my shift changed. Is that alright?",
    },
    {
      from: "office", who: "The office", at: "Tuesday, 09:40",
      body: "Wa ʿalaykum as-salām. That is fine. I have told both teachers so they are not marked as leaving without permission. It will show on the register as an agreed early collection.",
    },
  ],
};

/* ---- What the office does about people ---- */

/**
 * The concerns inbox — the other half of the teacher's raise_concern. It is
 * the most sensitive screen in the system and the demo says so plainly: only
 * the designated person reaches it, not the committee and not the other
 * teachers. Nothing here is ever deleted, only closed with a note, because a
 * safeguarding record that can be removed is not a safeguarding record.
 *
 * STILL IN DEVELOPMENT. madrasah_concerns exists and holds zero rows.
 */
export type ConcernRow = {
  ref: string;
  pupil: string;
  kind: string;
  raisedBy: string;
  at: string;
  state: "Open" | "With the designated person" | "Closed";
};

export const DEMO_CONCERNS: ConcernRow[] = [
  { ref: "SC-26-0004", pupil: "Pupil C. Jamal", kind: "Repeated absence", raisedBy: "H. Choudhury", at: "Today 18:22", state: "Open" },
  { ref: "SC-26-0003", pupil: "Pupil B. Iqbal", kind: "A change in behaviour", raisedBy: "F. Khatun", at: "3 days ago", state: "With the designated person" },
  { ref: "SC-26-0002", pupil: "Pupil A. Bashir", kind: "Something a parent told me", raisedBy: "Qārī Y. Ismail", at: "Last week", state: "Closed" },
];

/** Staff, and the one column a trustee always asks about. */
export type StaffRow = {
  name: string;
  role: string;
  classes: number;
  dbs: "Valid" | "Expires soon" | "Missing";
  dbsOn?: string;
};

export const DEMO_STAFF: StaffRow[] = [
  { name: "Qārī Y. Ismail", role: "Teacher", classes: 1, dbs: "Valid", dbsOn: "Mar 2029" },
  { name: "F. Khatun", role: "Teacher", classes: 2, dbs: "Valid", dbsOn: "Sep 2028" },
  { name: "H. Choudhury", role: "Teacher", classes: 2, dbs: "Expires soon", dbsOn: "Nov 2026" },
  { name: "S. Begum", role: "Teacher", classes: 1, dbs: "Valid", dbsOn: "Jan 2029" },
  { name: "A. Patel", role: "Teacher", classes: 1, dbs: "Missing" },
  { name: "R. Ali", role: "Madrasah lead", classes: 1, dbs: "Valid", dbsOn: "Jun 2030" },
];

export const DEMO_STAFF_SUMMARY = {
  total: DEMO_STAFF.length,
  valid: DEMO_STAFF.filter((s) => s.dbs === "Valid").length,
  attention: DEMO_STAFF.filter((s) => s.dbs !== "Valid").length,
};

/** Who has an account and who does not — the screen that unblocks everything. */
export const DEMO_LOGIN_STATE = {
  teachersWithLogin: 31,
  teachersTotal: 31,
  parentsWithLogin: 0,
  householdsTotal: 268,
} as const;
