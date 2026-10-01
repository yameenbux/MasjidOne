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
