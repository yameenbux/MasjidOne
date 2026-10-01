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

/** Derived, so the dashboard tiles cannot drift from the table beneath them. */
export const DEMO_FEE_SUMMARY = {
  outstanding: DEMO_FEES.reduce((n, f) => n + Math.max(0, f.balance), 0),
  inArrears: DEMO_FEES.filter((f) => f.behind > 0).length,
  billedMonthly: DEMO_FEES.reduce((n, f) => n + f.monthly, 0),
};

export type PupilRow = {
  ref: string;
  name: string;
  className: string;
  guardian: string;
  attendance: number;
};

/** A slice of the roll, enough to show the shape of the record. */
export const DEMO_PUPILS: PupilRow[] = [
  { ref: "P-0431", name: "Pupil A. Adam", className: "Nāẓirah 3A", guardian: "Household 1042", attendance: 96 },
  { ref: "P-0432", name: "Pupil B. Adam", className: "Qāʿidah 1A", guardian: "Household 1042", attendance: 91 },
  { ref: "P-0433", name: "Pupil C. Adam", className: "Qāʿidah 2A", guardian: "Household 1042", attendance: 88 },
  { ref: "P-0388", name: "Pupil A. Bashir", className: "Hifz (boys)", guardian: "Household 1108", attendance: 99 },
  { ref: "P-0389", name: "Pupil B. Bashir", className: "Nāẓirah 4A", guardian: "Household 1108", attendance: 84 },
  { ref: "P-0295", name: "Pupil A. Chowdhury", className: "ʿĀlimah 1", guardian: "Household 1203", attendance: 78 },
  { ref: "P-0120", name: "Pupil A. Dawood", className: "Hifz (girls)", guardian: "Household 1017", attendance: 97 },
  { ref: "P-0121", name: "Pupil B. Dawood", className: "Nāẓirah 3B", guardian: "Household 1017", attendance: 93 },
];

/**
 * The seeded sign-in. Shown on the screen on purpose: this is a demonstration
 * with no real account behind it, and a login box on a public URL that looks
 * like it guards something real is worse than one that says plainly it does
 * not.
 */
export const DEMO_CREDENTIALS = { user: "demo", pass: "demo" } as const;

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
    body: "No classes Monday to Friday next week.",
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
  { at: "3 days ago 09:22", who: "S. Patel (madrasah)", action: "fee_rate_changed", detail: "Second-child rate 24.00 → 22.00", kind: "person" },
  { at: "3 days ago 03:00", who: "The system", action: "donations_purged", detail: "Gift Aid records older than the statutory period removed", kind: "system" },
];

/* ---- The madrasah year ---- */

export type ClosureRow = { name: string; from: string; to: string; note?: string };
export type EventRow = { name: string; hijri: string; on: string; estimated: boolean };

/** Term dates and holidays. Date ranges, because a half term is a week and a
 *  single-date field would make the office enter five rows for it. */
export const DEMO_CLOSURES: ClosureRow[] = [
  { name: "Insert day", from: "1 Sep", to: "1 Sep", note: "Staff only — no pupils" },
  { name: "Half term", from: "26 Oct", to: "30 Oct" },
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
