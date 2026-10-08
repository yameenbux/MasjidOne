<div align="center">

# MasjidOne

**One system for a masjid's madrasah and its congregation.**

Registers, fees and parent access on one side. Prayer times, a congregation
app, the website, the hall screens and donations on the other.
The same family, on both.

Built in Bolton, for masājid across the UK.

![Next.js](https://img.shields.io/badge/Next.js-15-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%2017-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Static export](https://img.shields.io/badge/build-static%20export-C0A46A?style=flat-square&labelColor=0C2A21)
![Licence](https://img.shields.io/badge/licence-all%20rights%20reserved-7D5F2D?style=flat-square&labelColor=0C2A21)

</div>

<br/>

> [!NOTE]
> **Reading this without a technical background?** Start at *The problem*, *The
> four surfaces* and *One evening, end to end*. Those three explain what
> MasjidOne is and what it does for a masjid. Everything after *How the pieces
> fit* is for whoever maintains the code.

### How to read the diagrams

Every picture in this file uses the same four colours, and they always mean the
same thing. The connectors animate, so you can see which way the information
actually travels.

| | Means |
| :--- | :--- |
| ⬛ **Deep green, brass border** | MasjidOne itself — our code, our database |
| 🟩 **Pale green** | Live, working, in a masjid today |
| 🟨 **Sand, dashed border** | In development — not built, not sold as built |
| ⬜ **Stone** | A person, or something outside the system |

---

## The problem, in one picture

A typical masjid runs its week across half a dozen things that have never
heard of each other. The office knows a family three separate times and
can join them up only by remembering.

<img src="assets/diagrams/01-the-problem.svg" alt="How a masjid runs today, against one record of the family" width="100%">

Plenty of products do the congregation side, and do it well. The part
nobody else does is running the **madrasah's daily operations** — the
register marked each evening, the sabaq heard, the fee due — in the same
system, and then giving a parent a view of their own child.

---

## The four surfaces

Every masjid on MasjidOne gets the same four things. Same layout, their
colours, their domain.

<img src="assets/diagrams/02-four-surfaces.svg" alt="The four surfaces: website, in-masjid screens, congregation app, madrasah portal" width="100%">

> [!IMPORTANT]
> **The madrasah portal is built. Parent access is not.** The portal holds a
> masjid's roll, classes, staff and households, with registers and fees
> configured. What is still in development is *parent access* — the half a
> parent sees — and *Hifz and sabaq progress*. Those two are tagged "in
> development" here, on the website and in the console, and they stay tagged
> until they are real.
>
> This paragraph said all three were unbuilt until October 2026, which was
> wrong and had been wrong for a while. Before you change a status claim
> anywhere, **check the database** — see the warning below.

---

## One evening, end to end

The clearest way to explain the product is to follow a single Tuesday. A teacher
marks a register at six; by Wednesday morning the office knows which class
*didn't*; and the child in that register is the same record the congregation
side already holds.

<img src="assets/diagrams/06-one-evening.svg" alt="A Tuesday evening: a teacher marks a register, it locks, a missed register is flagged overnight, and the office sees the same child on the congregation side" width="100%">

> [!TIP]
> **The dashed sand box is the whole business.** Everything to the left of it is
> a madrasah system; plenty of those exist. The parent seeing their own child in
> the app they already use for prayer times is the part nobody else does — and
> it is the part still in development.

---

## How the pieces actually fit

This is the technical picture. **This repository is only the top-left box** —
the marketing website. The platform lives in its own repository.

<img src="assets/diagrams/03-architecture.svg" alt="MasjidOne runtime architecture: clients, GitHub Pages, Supabase Postgres with row level security, edge functions, Stripe and OneSignal" width="100%">

### Why one database and not one per masjid

Every table carries a `masjid_id`. Every function and every security
policy filters on it, and a person can only ever act for one masjid at a
time.

<img src="assets/diagrams/04-one-database.svg" alt="An administrator only ever reaches their own masjid rows" width="100%">

A database each would mean a separate migration, a separate set of keys
and a separate auth setup for every customer — and the whole point of the
product, one record of one family reachable from both sides, happens
*inside* a masjid rather than between them. Separation buys nothing there
and costs a great deal to run.

**This is finished rather than planned.** Every function that reads a masjid
now has a way to be told which one, and the last two learned on 2 October 2026.
It was tested by inserting a second masjid and running the whole public surface
against both, inside a transaction that always rolls back.

> [!IMPORTANT]
> **`sole_masjid()` raises once a second masjid exists, and must keep raising.**
> It is tempting to give it a default. Do not: a signed-out visitor asking for
> "the" masjid when there are two has not said enough, and a default would
> serve one mosque's prayer times, brand or term dates to another's
> congregation. A loud exception is the correct answer, and its message already
> tells the caller to pass a slug.

The rule that falls out of it, and the one that is easy to get backwards:
**anonymous reads name the masjid; signed-in reads ask the session.** A public
page passes a slug because nobody is signed in. A staff screen resolves
`current_masjid()`, because the right answer is whichever masjid that person is
standing in — which, for MasjidOne support, is not the one their build was
compiled for.

---

## The stack, in four layers

Left to right: what gets written, what it compiles to, where that runs, and the
two outside services it talks to.

<img src="assets/diagrams/05-tech-stack.svg" alt="The stack in four layers: TypeScript, Next.js, Tailwind and SQL; a static export and applied migrations; the Pages CDN, Supabase Postgres, Deno edge functions and React Native; Stripe and OneSignal" width="100%">

| Layer | What and why |
| :--- | :--- |
| **TypeScript 5.7** | Every file. A mosque's fee ledger is not a place for `undefined` |
| **Next.js 15** · React 18.3 | App Router, static export — no server at request time |
| **Tailwind 3.4** + shadcn/ui | Driven by MasjidOne's own tokens, not Tailwind's defaults |
| **Postgres 17** on Supabase | One database. Every table carries `masjid_id` |
| **Row Level Security** | The database refuses the wrong rows; it is not an `if` statement in the app |
| **Deno edge functions** | Notifications and webhooks |
| **React Native · Expo** | The congregation app, iOS and Android |
| **Stripe** | The masjid's own account. We never touch the money |
| **OneSignal** | Push, scoped per masjid |
| **GitHub Actions → Pages** | Builds and publishes. Nothing to patch at 2am |

> [!IMPORTANT]
> **`output: 'export'` is a constraint, not a preference.** The marketing site
> compiles to plain files on a CDN. Adding anything that needs a Node server at
> request time breaks the deploy — and removes the main reason this site cannot
> go down.

---

## This repository

The marketing site. Its job is to give a masjid committee somewhere to
land after a conversation, look at what they would be buying, and ask for
a demo. It is not a self-serve signup — nobody buys this without a
meeting.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```

**Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui.**
`output: 'export'` writes plain HTML, CSS and JS to `out/`, so there is
nothing to run at request time and nothing to keep patched.

> [!NOTE]
> **Contact details are live.** `CONTACT_EMAIL` is `info@masjidone.co.uk`,
> `SUPPORT_EMAIL` is `support@masjidone.co.uk` and `PRIVACY_EMAIL` is
> `privacy@masjidone.co.uk` — the legal pages name their own address so that
> routing a subject access request elsewhere happens at the mail host and no
> page changes. `CONTACT_PHONE` is set, so the telephone line renders; emptying
> it hides the line rather than printing a placeholder.

### Deploying

GitHub Actions builds and publishes to Pages
(`.github/workflows/deploy.yml`). Pages cannot build a Next app from a
branch, so **Settings → Pages → Source** must be **GitHub Actions**.

> [!CAUTION]
> **`public/CNAME` decides the URLs.** If it holds a domain, the base path is
> empty and the canonical origin is that domain — `next.config.mjs` reads the
> file and ignores a stale `NEXT_PUBLIC_BASE_PATH` rather than obeying it. This
> is not a preference: the live site once shipped with **every asset 404ing**
> because the variable still said `/MasjidOne` while the custom domain served
> from the root.

| Variable | When you need it | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Only with **no** `public/CNAME`, served from `<user>.github.io/MasjidOne` | `/MasjidOne` |
| `NEXT_PUBLIC_SITE_URL` | Only with **no** `public/CNAME` | the full origin |
| `NEXT_PUBLIC_COMMIT_DATE` | Set by the workflow | the last commit date, for `sitemap.xml` |
| `NEXT_PUBLIC_FORM_ENDPOINT` | To make the demo request form post rather than open a mail client | `https://masjidone-forms.<your-subdomain>.workers.dev/demo-request` |
| `NEXT_PUBLIC_BILLING_ENDPOINT` | To enable Direct Debit in the support console | the deployed `masjidone-billing` function URL, no trailing slash |
| `GOOGLE_SITE_VERIFICATION` | Only for a Search Console **URL-prefix** property | the token |

A Search Console *Domain* property is verified by DNS at the registrar and
needs none of this.

### Where the demo request form posts

`worker/` holds a Cloudflare Worker that takes a demo request and hands it to
**Resend's REST API**, which sends the email. **Written and tested, not yet
deployed** — `worker/README.md` has the steps. Until `NEXT_PUBLIC_FORM_ENDPOINT`
is set the form hands its answers to the visitor's own mail client instead.

The alternative was a form company like Formspree: twenty minutes of work, and
a business that then holds every enquiry a committee ever sends, in their
dashboard, under their retention policy.

> [!NOTE]
> **It used to use Cloudflare Email, and cannot.** Cloudflare's own
> documentation requires the zone to be on Cloudflare DNS for Email Service,
> and `masjidone.co.uk` is entirely on One.com — which also supplies automatic
> DKIM that a migration would cost. Outbound Email Sending also reads "Not
> available" on the Workers free plan, and Email Routing replaces the root MX,
> which would stop the mailboxes receiving. Hence Resend, and hence
> `workers_dev = true`: the custom route needed a zone Cloudflare does not hold.

**Resend verifies `send.masjidone.co.uk`, not the root, and that is the point.**
Its SPF, DKIM and bounce records live on the subdomain, where they cannot
collide with the root SPF or disturb the MX the mailboxes depend on. If a screen
offers to change the root MX or the root SPF, it is the wrong screen.

> [!IMPORTANT]
> **Two processors, not one, and one of them keeps a copy.** Cloudflare carries
> the submission and Resend sends it; both are processors and the privacy notice
> names both. Resend also **retains the message for thirty days** on every plan,
> including the free one. "Resend only transmits" is wrong and must not be
> written. `app/privacy/page.tsx` reads `FORM_ENDPOINT` and prints the mailto
> wording or the Worker wording to match — do not replace that conditional with
> whichever branch happens to be true today.

The Worker checks `response.ok`, not merely whether `fetch` threw. A 401 from a
rolled key arrives as a perfectly happy `Response`, and an unchecked call would
tell every visitor their enquiry was sent while nothing was.

**The API key is a credential.** It goes in `wrangler secret put RESEND_API_KEY`
and nowhere else — not in `worker/wrangler.toml`, not in a commit. This repository is
public and git history is permanent.

Defences, since there is deliberately no captcha: a honeypot answered `200` so
a bot does not retry, five posts a minute per IP, a 32 KB ceiling, per-field
caps, an origin check, and the enquirer's address in `Reply-To` rather than
`From`.

### What the site is

Nine indexable pages, plus two things that are deliberately not indexed: the
demonstration tenant, and the live support console we sign into ourselves.

| Route | What it is |
| --- | --- |
| `/` | The argument: the join, the modules, the previews, the prices |
| `/madrasah-software/` | Registers, fees, families |
| `/mosque-prayer-times-screens/` | One timetable, every screen |
| `/mosque-app/` | Times, reminders, notices, giving |
| `/mosque-website/` | The managed website |
| `/mosque-donations/` | 0% commission and Gift Aid |
| `/request-a-demo/` | The form, on its own page, where all eight CTAs point |
| `/privacy/`, `/terms/` | Legal |
| `/demo/` | The demonstration tenant — `noindex`, disallowed in `robots.txt` |
| `/admin/` | **The live support console.** Real sign-in, real masajid — `noindex`, disallowed, absent from the sitemap |

The five module pages exist because one URL cannot rank for more than one
intent. Each declares **its own** canonical and `openGraph.url`: the root
layout deliberately sets neither, because a default there is inherited, and
`/privacy/` once told Google it was a duplicate of the home page. Next does not
derive `og:url` from a canonical, and it *replaces* `openGraph` rather than
merging it — so every page builds its whole block from `openGraphFor()` in
`lib/site.ts` or it silently loses the card image.

### The demonstration tenant

`/demo/` is a sales walkthrough built from invented data in `lib/demo-data.ts`.
There is no database behind it and the sign-in is a string comparison in the
browser, which is why the credentials are printed on the screen — a login box
on a public URL that appears to guard something real, but does not, is a
credential-harvesting shape.

```
/demo/                          sign in with demo / demo
/demo/?masjid=Masjid+e+Taqwa    the committee sees their own name
/demo/#office                   open straight on a screen, mid-call
/demo/teacher/                  a teacher: their classes, their register
/demo/parent/                   a parent: their own children, nothing else
/demo/app/                      the congregation app, opening signed out
/demo/support/                  our console, as a committee would be shown it
/demo/ticket/                   "Having issues? Log a ticket"
```

The doors are deliberately separate. A parent is not a smaller administrator —
they arrive to answer one question, and should never see a screen implying the
rest of the madrasah is theirs to look at.

Navigation is the URL, not component state. Each screen has a hash and the
stage is derived from it, so the browser's back button — and the phone's back
gesture, which matters more — work. An earlier attempt used `history.state`;
Next's App Router owns `popstate` and remounts the page, which made one Back
jump three screens.

The scale is deliberately **not** the real customer's, so a screenshot of the
demo can never be mistaken for their data. Imagery rules live in
`public/devices/README.md`: nothing in that folder is a screenshot, and no real
child's record or family's fee history is ever published.

### The live support console

`/admin/` is the one page in this repository that touches the real platform.
Everything else is marketing copy or a demonstration built from fixtures. Sign
in with a real platform account, see the masajid MasjidOne supports, switch
into one.

It needed nothing new in the database. `my_masjids()` and
`set_current_masjid()` have existed since the multi-masjid work and had
**zero callers** — the first already returns every masjid to a platform admin,
each flagged with whether you are inside it and whether entering counts as
support access. This is a window onto functions that were already there.

**Every gate is in Postgres, not in the page.** Someone who edits the
JavaScript in their browser gets nothing:

| Layer | What it does |
| :--- | :--- |
| `anon` holds no `EXECUTE` | Refused at the grant, before the function body runs |
| `my_masjids()` | Returns nothing without `auth.uid()`, everything only to a platform admin |
| `is_platform_admin()` | Requires `is_aal2()` — a completed second factor, so the console has a real authenticator step |
| `set_current_masjid()` | Refuses a masjid you neither belong to nor administer, and writes `masjidone_support_access` into **their** audit trail when it is the latter |

> [!IMPORTANT]
> **Entering a masjid you hold a role at is not support access and is not
> logged.** The audit row is written only when you are platform staff *and not*
> a member. The console says which case it is on the card, rather than implying
> a trail that is not being written.

> [!NOTE]
> **There is a second sign-in at the end, and it is not an oversight.** The
> console is served from `masjidone.co.uk`; a masjid's portal is served from
> its own domain, and a Supabase session lives in storage scoped to one origin,
> so it cannot follow you. Entering still does the real work —
> `set_current_masjid()` is server-side state, so you arrive pointed at the
> right masjid. Carrying the session across would mean putting tokens in a URL
> and re-enabling `detectSessionInUrl` on a portal that deliberately set it to
> `false`.

`/demo/support/` is the same screen built from fixtures. The two are
deliberately the same shape: a committee shown the demo is being shown what we
actually use, and if they drift apart the demo becomes a lie. **Change one,
look at the other.**

### Where things live

| What you want to change | File |
| --- | --- |
| The prices | `lib/site.ts` — `PRICING_BANDS` is the only source; `BAND_RANGE` and the yearly total (`price * 12`) are derived, so neither can drift into a discount |
| Plan features and copy | `components/masjidone-pricing.tsx` |
| The pricing block itself | `components/ui/pricing.tsx` |
| Every other home page section | `components/site-sections.tsx` |
| Behaviour for those sections | `components/site-behaviour.tsx` |
| A module page's content | `app/<slug>/page.tsx` — data only |
| The module page layout | `components/module-page.tsx` |
| The demo's screens | `components/demo-*.tsx` |
| The demo's data | `lib/demo-data.ts` |
| The live support console | `components/admin-console.tsx` |
| Which platform it talks to | `lib/platform.ts` — and where each masjid's portal lives |
| The demo request form's endpoint | `worker/` — see `worker/README.md` |
| What Google reads | `components/structured-data.tsx` |
| Canonical URL, contact address | `lib/site.ts` |
| Colour, type and spacing | `app/globals.css` |
| The full design system | `DESIGN.md` |
| The rules that are not wording choices | `CLAUDE.md` |

---

## When something goes wrong

Most things a masjid wants changed are not faults at all — they are the masjid's
own content, and the masjid changes them itself without asking anybody. The
small remainder comes to us, and a fix reaches every masjid rather than only the
one that reported it.

<img src="assets/diagrams/07-support.svg" alt="Support path: somebody spots an issue, tells the masjid office, and it is either the masjid's own settings to fix or a ticket to MasjidOne, which reproduces, fixes, deploys and reports back" width="100%">

### Who fixes what

| It is… | Who | How long |
| :--- | :--- | :--- |
| A wrong jamāʿah time, a notice, a fee rate, who has access | **The masjid**, in the portal | Immediately |
| A pupil in the wrong class, a family to merge | **The masjid**, in the portal | Immediately |
| A screen showing the wrong thing, a button that does nothing | **MasjidOne** | Reproduced against your own configuration |
| Anything touching a child's record or money | **MasjidOne**, treated as urgent | Ahead of everything else |

> [!IMPORTANT]
> **A masjid never waits on us for its own content.** If the office has to open a
> ticket to change Maghrib, the product has failed. Everything a committee
> routinely needs to change is theirs to change, which is also why role-based
> access matters: the person who should change it can, and nobody else can.

> [!NOTE]
> **The support route is live.** Enquiries reach `info@masjidone.co.uk` and
> customer support reaches `support@masjidone.co.uk` — deliberately two
> addresses, because the person answering a sales question and the person
> answering a broken register are on different clocks.
>
> The *"Having issues? Log a ticket"* link does not use either: it opens
> `/demo/ticket/`. It previously pointed at a `mailto:` aimed at a placeholder,
> which meant the one control on the demo intended for a committee that is
> stuck opened an empty mail window addressed to nowhere.

There is no overseas support desk and no outsourced queue. A masjid talks to
the **MasjidOne support team** — the people who wrote the system and can fix it.

---

## What it costs

**Pricing is banded by the size of the madrasah** — four bands by pupil count,
across two plans (**Madrasah**, and **Masjid Complete** which adds the website,
the app, the screens and donations). Setup is **£499 once**, waived on twelve
months prepaid, and donations carry **0% commission**.

> [!IMPORTANT]
> **The per-band figures are deliberately not repeated here.** They live in
> `PRICING_BANDS` in `lib/site.ts` and nowhere else; `BAND_RANGE` derives the
> ranges from them, and `components/structured-data.tsx` derives what Google
> reads from the same source.
>
> This README printed `£79` and `£179` until 8 October 2026 — the flat rates
> abandoned on 4 October, one of which was never a price in the new table at
> all. A figure copied into prose cannot be type-checked and will rot. If you
> are tempted to paste the numbers back in for convenience, that is the bug
> this note exists to prevent.

Yearly billing is the same rate shown twelve times over, not a discount. Only
the setup fee falls. A band is **not** per-pupil pricing: the figure changes
only at renewal, and only on crossing a threshold.

---

## Before you change any copy

> [!CAUTION]
> Read **`CLAUDE.md`** first. The prices, the competitive claim and the
> "in development" tags are **commercial commitments, not wording choices**. A
> wrong one loses a sale and the referral behind it.

Three that catch people out:

- **Never claim a feature that is not built, and never deny one that is.**
  This README broke that rule itself until 2 October 2026: it said parent
  access and Hifz/sabaq progress were in development. **Both are built**, and
  have been — 16 parent functions and six progress functions, all enforcing.
  They were tagged across eleven places on the site because their tables were
  empty, and *zero rows means nobody has used it yet, not that it does not
  exist*. Months of telling committees a shipped feature was coming.
  Today **one thing carries the tag: the screen heartbeat**, and it is in the
  demo rather than on the public site — there is no screens table in the
  platform and no function takes a screen id. Nothing else is tagged.
  The test is whether the *functions* exist and enforce, never whether rows
  do, so **query the database rather than trusting either document**,
  including this one.
- **Never say no competitor does the whole masjid.** Several do the
  congregation side. The defensible claim is narrower and it is written
  down in `CLAUDE.md`.
- **Compliance is a commitment, not a fact.** ICO registration and the
  data processing agreement are promised *before a masjid is invoiced*.
  Do not rewrite them into the present tense until they are done.

British English throughout, and Arabic terms keep their diacritics:
jamāʿah, Jumuʿah, janāzah, Hifz, sadaqah, madrasah, masjid. ("nikah" is
written plain throughout, in all thirteen places it appears — this list used to
say otherwise and the code never did.)

---

## The diagrams

Seven SVGs, and the connectors animate — the same travelling-beam idea the site
uses on its modules diagram. GitHub renders mermaid but cannot animate it, so
these are built rather than inlined.

The sources stay in the repo as text, so a diagram is still something you can
edit and diff rather than a picture nobody can change:

```bash
assets/diagrams/*.mmd          # the source, one file per diagram
node scripts/build-diagrams.mjs # regenerates the SVGs
```

The build script holds the palette and the animation in one place. It declares
the colours light-first and redefines them under `prefers-color-scheme`, so the
diagrams follow GitHub's theme, and it keeps a `prefers-reduced-motion` guard —
anybody who has asked their machine for less movement gets a still picture.

> [!NOTE]
> **Do not add a `font-family` override to that stylesheet.** Mermaid measures
> every label and sizes each box *before* the stylesheet is appended, so
> changing the face afterwards reflows text inside boxes built for a different
> font and silently clips the last line. It went unnoticed until a diagram had
> narrow nodes. Mermaid embeds the face it measured with — leave it alone.

Rendering needs a Chromium. If the machine has one already:

```bash
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome node scripts/build-diagrams.mjs
```

---

## Licence

All rights reserved. Not open source.
