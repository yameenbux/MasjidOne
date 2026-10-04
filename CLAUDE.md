# CLAUDE.md

Context for Claude Code working in this repository.

## What this is

The marketing site for **MasjidOne**, a platform that runs a UK mosque's
madrasah and its congregation on one system. A product of YSB Ventures Ltd,
Bolton.

This repo is **the website only**. The platform itself lives elsewhere and
has its own CLAUDE.md.

The site's job is to give a mosque committee somewhere to land after a
conversation, look at what they'd be buying, and request a demo. It is not
a self-serve signup funnel. Nobody buys this without a meeting.

## Stack

> **This changed.** The site was a single dependency-free `index.html`. It is
> now a Next.js app, converted deliberately so the shadcn/Framer Motion
> pricing block could be used as supplied. If you are working from the older
> "one file, no build step, no npm" brief, that brief is out of date.

- **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.**
- `output: 'export'` — the build emits static files to `out/`, so the site
  is still just HTML, CSS and JS on a CDN. Keep it that way; nothing may
  depend on a Node server at request time.
- Deployed by GitHub Actions (`.github/workflows/deploy.yml`), because Pages
  cannot build a Next app from a branch. Pages source must be set to
  "GitHub Actions".
- `basePath` comes from `NEXT_PUBLIC_BASE_PATH`. Empty for a custom domain,
  `/MasjidOne` for a project page. Getting this wrong 404s every asset.

### Layout

| Path | What lives there |
| --- | --- |
| `app/globals.css` | shadcn tokens **and** the MasjidOne design system |
| `app/page.tsx` | section composition |
| `components/site-sections.tsx` | header, hero, join, modules, previews, trust, contact, footer |
| `components/site-behaviour.tsx` | client-side behaviour for those sections |
| `components/ui/pricing.tsx` | the third-party pricing block |
| `components/masjidone-pricing.tsx` | MasjidOne's real plan data |

`site-sections.tsx` was mechanically ported from the original HTML, so it is
plain markup driven by CSS classes rather than idiomatic React. Its behaviour
is attached imperatively in `site-behaviour.tsx`. If you refactor a section
into real components, move its behaviour with it.

## Design system

Do not introduce new colours, fonts or spacing scales. Use what's defined.

> **WHOSE DESIGN IS THIS?** Ask it before styling anything, because the answer
> is not always MasjidOne's.
>
> The palette below — bottle green, paper, brass, Newsreader — is **MasjidOne's
> own**, and belongs on MasjidOne's own surfaces: this marketing site, the
> demonstration under `/demo/`, and the live support console at `/admin/`.
>
> **A masjid's surfaces carry the masjid's design, not ours.** The founding
> masjid's portal is plum (`#3C0B2A`) and gold (`#C6A24C`) set in Fraunces, and that is correct
> and must stay that way. The product is *powered by* MasjidOne; it does not
> *look like* MasjidOne. Every masjid is meant to be its own in colour and
> type, which is why `components/ui/powered-by.tsx` is a small footer credit
> rather than a header lock-up — the masjid's name carries the top of their
> screens, our credit carries the bottom.
>
> So never "make a masjid's portal consistent with the site". They are
> deliberately inconsistent, and the inconsistency is the feature. The link out
> of the support console opens their own domain, which is why their design
> survives it: CSS does not cross an origin.
>
> **Every masjid is designed, not themed.** The first masjid's website, app and
> admin portals were designed for that masjid. The next one's will be designed
> for them. They are not one product with the variables swapped, and nothing here
> should be built as though they were — a committee can already buy a skinnable
> template elsewhere, and that is precisely the thing they are not buying here.
>
> What the masajid have in common is **MasjidOne underneath**: the same
> functions, the same database, the same rules about who may open a child's
> record. Not a stylesheet.
>
> This was got wrong once, on 2 October 2026. `masjids.theme` was populated
> with the founding masjid's palette, `masjid_theme(slug)` was added to read it, and the
> demo gained a palette picker so a visitor could flick between three skins.
> All of it argued for the templated model. It was reverted the same day —
> `theme` is `{}`, the function has EXECUTE revoked from every role and is
> commented DEAD pending a `DROP FUNCTION`, and the picker is a sentence again.
> If you find yourself designing a theming system, you have taken the wrong
> turning that this paragraph exists to mark.

- **Typography:** `Newsreader` (serif) for headings and pull quotes,
  `Archivo` (sans) for everything else, loaded via `<link>` in `app/layout.tsx`.
  Numbers in timetables and prices use `font-variant-numeric: tabular-nums`.
- **Colour** is defined entirely through CSS custom properties. The palette is
  a deep bottle green (`--board`), a paper off-white (`--paper`) and a brass
  accent (`--brass`), derived from a UK mosque prayer-time board — which is
  also why dividers are hairlines and prayer rows use a two-column
  begins/jamāʿah rhythm. Keep that vernacular.
- **Two token systems, kept in agreement.** `app/globals.css` defines the raw
  MasjidOne tokens *and* the shadcn HSL tokens (`--background`, `--primary`,
  …) carrying the same palette. Change one, change the other, or the pricing
  block drifts from the rest of the page.
- **Theme blocks must stay in sync.** Any new token goes in all of: `:root`,
  the `@media (prefers-color-scheme: dark)` block, and
  `:root[data-theme="dark"], .dark`. Forgetting one silently breaks dark mode.
  The theme toggle sets both `data-theme` and shadcn's `.dark` class.
- Never hardcode a hex value in a rule or an SVG. Use `var(--token)`.
  Two unavoidable exceptions: `<meta name="theme-color">` and the favicon and
  app-icon files in `public/`, none of which can read a CSS variable. The
  in-page mark is inlined as `components/ui/brand-mark.tsx` and draws in
  `currentColor` precisely so it is not a third exception.
- Left-aligned, generous whitespace, hairline rules. **The pricing block is
  the one deliberate exception** — it is centred, rounded and card-based
  because it was adopted as supplied. Don't spread that styling outward.

## What MasjidOne delivers — FIVE products, and this list is canonical

**Read this before writing any copy, leaflet, email or deck. Do not reconstruct
it from memory.** It has been got wrong twice: a capability PDF went out on
4 October 2026 omitting the website, and the corrected version still omitted the
in-mosque screens. Both are things the site has always sold. The failure was
deriving the list from recollection instead of from here.

A masjid on **Masjid Complete** receives five finished things:

| # | Product | Lives at | What it is |
| --- | --- | --- | --- |
| 1 | **A new website** | `/mosque-website/` | Built and maintained for them, with the timetable and notices updating themselves |
| 2 | **A congregation app** | `/mosque-app/` | Per-person jamāʿah reminders, giving, hall and nikah bookings |
| 3 | **In-mosque screens** | `/mosque-prayer-times-screens/` | Unlimited screens on ordinary televisions, off the same timetable |
| 4 | **The madrasah portal** | `/madrasah-software/` | Office and teachers: registers, fees, Hifz progress, staff and DBS dates |
| 5 | **The parent portal** | inside the congregation app | A parent sees their own children only — marks, fees, progress |

**Madrasah** (the cheaper plan) is products 4 and 5 only.

Donations with Gift Aid at 0% commission is a **feature** reached through the
website and the app, not a sixth product — which is why `/mosque-donations/`
exists as a page but does not appear above.

**The screens are live and carry no tag.** What they display is built and
running. The one thing tagged "In development" is the screen *heartbeat* — the
"Are the screens alive?" monitoring panel in the demo, which answers whether a
television is switched on and talking to us. Selling the screens is correct;
claiming you can monitor them is not. See content rule 1.

## Content rules — these matter more than the code

These are commercial claims. Getting one wrong loses a sale and a referral.

1. **Never claim a feature that isn't built, and never deny one that is.**
   Both halves have been broken here. Check the database — and check the
   *right thing* in it.

   **ZERO ROWS IS NOT "NOT BUILT". It means nobody has used it yet.** This
   caused a real error on 1 October 2026: parent access and Hifz/sabaq were
   tagged "In development" across eleven places on the site because their
   tables were empty, while both were in fact complete and callable. Months of
   telling committees a shipped feature was coming. Before tagging anything,
   ask whether the *functions* exist and enforce, not whether rows do.

   **Do not measure parent access by `user_roles`.** It does not live there.
   `is_parent()` reads `madrasah_parent_logins`, and `create_parent_login`
   writes that row — so a parent with zero `user_roles` entries is still a
   parent. This file previously said the opposite and it was wrong.

   **Built and verified against the live database on 1 October 2026:**
   the madrasah portal — 553 pupils, 49 classes, 41 staff, 331 households, 423
   guardians, 43 accounts; registers and fees; *parent access* (16 functions,
   `record_parent_absence` and `create_parent_login` among them, all
   enforcing); *Hifz and sabaq progress* (`madrasah_progress` plus six
   functions including `progress_save`, with `shared` and a private note).

   **One thing carries the tag: the screen heartbeat** (`DEMO_SCREENS` and the
   "Are the screens alive?" panel in the Timetable view, added 1 October 2026).
   It is correctly tagged and must stay tagged. There is no screens table in
   the platform and no function anywhere takes a screen id — checked against
   the live database, not inferred from a comment. Do not promote it because
   the fixture looks convincing; the test is whether the functions exist and
   enforce. Nothing else carries the tag.

   **What the heartbeat is, so it is not widened by mistake:** monitoring, not
   content. Every screen shows the same output and that does not change. The
   panel says only whether a television is switched on and talking to us. A
   screens *registry* (a token per screen, a last-seen timestamp) is what it
   would need; per-screen *content* is a different and much larger thing that
   nobody has asked for and that the "one timetable, not a wall of screens"
   pitch deliberately argues against.

   **USAGE FACTS, which are not capability facts, and which split in two.
   Re-checked against the live platform and OneSignal on 2 October 2026.**

   *The congregation side is in daily use, and this file used to deny it.* The
   app has sent **291 push notifications between 12 August and 2 October 2026**
   — about 5.8 a day, fired automatically off the prayer timetable, the most
   recent at 05:46 on the morning this was written ("Fajr jamāʿah is starting
   now at the masjid"). None failed. The timetable itself is published, 365
   days of it. So for prayer times and the app, *"running"*, *"every day"* and
   *"in daily use in a masjid"* are now **defensible and were being needlessly
   withheld**.

   *But say nothing about reach.* Those 291 pushes reach **6 devices**. Six.
   The demo's `DEMO_APP_REACH` fixture says 1,180 phones and is invented sample
   data; it must never appear in a sentence about the live masjid. "It runs every day"
   is true. "A congregation uses it" is not.

   *The madrasah side is still unused.* No register submitted, no attendance
   mark, no fee charged or paid, no progress entry. One parent login exists,
   created 29 September — ask whether that is a real family or a test before
   claiming anything from it. The notice board has one notice written and
   **none published**. So for the madrasah, *"built"*, *"in a masjid"* and
   *"it works"* remain the limit; *"running"* and *"in daily use"* do not apply
   and must not be borrowed from the congregation half.

   The lesson this file keeps relearning: a usage claim goes stale in both
   directions. It was wrong to claim use that had not happened, and it was
   wrong to keep denying use that had started. Check, with a date.
2. **Never claim "no competitor does the whole mosque."** It is false —
   several platforms do the congregation side. The true, defensible claim is
   narrower: *nobody joins the madrasah to the congregation.* Keep the copy
   on that line.
3. **Pricing is banded by madrasah size, and the bands are fixed.**
   Changed 4 October 2026 from a single flat rate. The reason, because it will
   be questioned: every credible competitor prices by student count, and a flat
   rate across a market with a tenfold spread in institution size is wrong at
   both ends at once — it overcharged the small maktab, which is the segment
   with the most prospects, and undercharged the large madrasah. **The entry
   price went down, not up.** An earlier reading had this backwards and was
   built on comparing per-pupil cost to school management systems, which is the
   wrong benchmark for a volunteer-run, donation-funded madrasah. See
   `founder/price-pressure-test-2026-10-02.md`.

   | Pupils | Madrasah | Masjid Complete |
   | --- | --- | --- |
   | up to 100 | £49 | £119 |
   | 101–250 | £79 | £169 |
   | 251–500 | £119 | £219 |
   | over 500 | £159 | £269 |

   Setup £499 once (waived on twelve months prepaid). 0% commission on
   donations. Do not invent further tiers or discounts.
   **The figures live in `PRICING_BANDS` in `lib/site.ts` and nowhere else.**
   There is deliberately no `PRICING.madrasah` scalar: a single number is the
   thing that is no longer true, and one left lying about would let a page print
   it as though it were the price. Ranges come from `BAND_RANGE`, which is
   derived, never typed. If you find a price written as a literal in prose,
   that is a bug — the compiler cannot catch those, so grep for `£` after any
   pricing change.
   **A band is not per-pupil pricing, and the copy must keep that line.**
   Per-pupil means the bill moves whenever a child joins; a band is one figure
   for a size range that changes only at renewal, and only on crossing a
   threshold. "No per-pupil charge" is still true and still worth saying.
   What is no longer true, and was deleted on 4 October, is any promise that
   growth is never a billing event. It is, at renewal. Do not reinstate it.
   **Never discount the monthly — waive the setup fee instead.** The invariant
   is arithmetic: for a plan whose `period` is `month`, `yearlyPrice` must be
   exactly `price × 12` for that masjid's own band. Anything less is a discount
   on the monthly and is wrong. Only the setup fee genuinely falls, £499 → £0.
   In the yearly view each card also prints its monthly rate underneath, so a
   twelve-month total cannot be misread as a price rise. Keep that line.
   **Google reads the prices too.** `components/structured-data.tsx` publishes
   `AggregateOffer` with `lowPrice`/`highPrice` derived from the bands. One
   figure there while the page shows four is a mismatch a crawler is entitled
   to treat as a lie. If the bands change, that follows automatically — do not
   hardcode it.
   **The `pricing-strategy` skill does not override any of this.** It is an
   internal thinking aid and writes to `founder/`, which is gitignored
   because **this repository is public** — margins, break-even counts and a
   tier you privately call a decoy must never be pushed to it.
   Nothing it proposes — new tiers, a free plan, a decoy, an annual discount
   — reaches `components/masjidone-pricing.tsx`, the comparison table or any
   public copy unless you have separately decided to change the price and
   said so. Treat its output as an argument to weigh, not a source of truth.
   It also assumes a self-serve dollar SaaS funnel, which this product is not.
4. **Do not name competitors on the public site.** The comparison happens in
   the room, not on the page. Naming them in `founder/` analysis is fine —
   the rule is about the page, not about what you are allowed to know.
5. **We do not name the masajid we work with.** Changed 4 October 2026 at the
   founder's instruction, and it replaces a rule that said the opposite.
   A customer's records are their own business, and a committee weighing up who
   to trust with five hundred children's details should not first be shown
   another masjid's name used as advertising. The furthest any public copy goes
   is **"a mosque in Bolton"**.
   This is a position, not a limitation — say so when asked, because it lands
   correctly with the people you are selling to. If a prospect wants a
   reference, seek that masjid's permission and introduce them directly.
   **Written permission is still required**, as part of the founding-customer
   agreement, and it still matters: it is what makes the walkthrough video
   usable at all. Permission to use a name is not an obligation to use it.
   The site no longer shows any customer's captures — the hero and the previews
   use MasjidOne interface previews and the note under the hero says so. Their
   captures stay in `assets/devices-src/` and are the only real-world evidence
   held, so if they ever go back on the page that note changes with them.
   **Never publish a screen containing a real child's record or a real
   family's fee history** — see `public/devices/README.md`.
   Naming a customer in `founder/` analysis is fine; that folder is gitignored.
   The rule is about anything a prospect, a crawler or a passer-by can read,
   and **this repository is public**, so it covers code comments and committed
   documentation too, not just rendered copy.
6. **No social proof.** No customer counts, logos, testimonials or "popular"
   badges — there are no customers yet. The pricing block's badge says
   "Recommended", which is our own view, not a popularity claim.
7. **Compliance is stated as a commitment, not a fact.** ICO registration and
   the DPA are promised *before a masjid is invoiced*. Do not rewrite them
   into the present tense until they are actually done.
8. The inline SVGs are **interface previews**, not screenshots. Captions must
   say so until real screenshots replace them. Any example student data must
   be obviously fictional.
9. British English throughout. Arabic terms carry diacritics as already used:
   jamāʿah, Jumuʿah, janāzah, Hifz, sadaqah, madrasah, masjid.

## Accessibility and quality bar

- Every meaningful SVG needs `role="img"` and an `aria-label`. Decorative
  icons (including lucide icons) take `aria-hidden="true"` instead.
- Heading order stays semantic — don't skip levels for styling.
- Keep the `:focus-visible` outlines and the `prefers-reduced-motion` guards.
- Must work at 360px wide. Wide content scrolls inside its own
  `overflow-x: auto` container; the page body never scrolls sideways.
- The page must still render with JavaScript disabled — the reveal animations
  are gated behind a `js` class added at runtime for exactly this reason.
- Test both light and dark before saying a change is done.

## Things not to do

- Do not add analytics, tracking pixels, or anything that would trigger a
  cookie banner, without asking first.
- Do not use `localStorage`, `sessionStorage` or cookies. The theme toggle is
  deliberately session-only and resets on reload.
- Do not add an open source licence file. This is all rights reserved.
- Never commit secrets. `.env`, API keys, Supabase service keys, OneSignal
  keys and Cloudflare tokens stay out of git permanently — a key committed
  once lives in the history forever.
- Do not add a server dependency. `output: 'export'` must keep working.

## Open items

- Replace the three SVG previews with live screenshots (test student data
  only, never a real child's record). Partly done: `#previews` now leads with
  a 58-second walkthrough of the madrasah portal recorded at the founding masjid
  (`public/media/madrasah-portal.mp4`, confirmed free of real pupil data on
  28 September 2026). The stills under it are still interface previews, and
  the section's opening paragraph draws that distinction — if the stills are
  ever replaced by real captures, that paragraph has to change with them.
  The video is 10 MB and loads only on play (`preload="none"` behind a
  rendered poster, `public/media/madrasah-portal-poster.jpg`). If it is ever
  re-encoded to 720p it should drop to roughly 4 MB; do not add an autoplay
  background video, which would download that weight before anyone has read
  a word.
- **Email is live.** `info@masjidone.co.uk` and `support@masjidone.co.uk` were
  created on 4 October 2026 and are wired in: `CONTACT_EMAIL` is `info@`,
  `SUPPORT_EMAIL` is `support@`, and the terms page now splits enquiries from
  customer support because the two people writing are on different clocks.
  `CONTACT_READY` derives from `CONTACT_EMAIL`, so the contact line, the privacy
  policy's subject-access route and the terms' contact section all switched on
  together.
  **`PRIVACY_EMAIL` is `privacy@masjidone.co.uk`**, split out the same day. It
  forwards to `info@` at the mail host, so nothing is read in two places, but
  the legal pages name their own address — which means routing, filtering or
  handing subject access requests to somebody else happens at the host and no
  page changes. Seven aliases forward to `info@`: accounts, billing, contacts,
  enquiries, forms, hello, privacy. **`forms@` is the one that is load-bearing**
  — the Worker sends from it, and without the forward its bounces would vanish.
  **`CONTACT_PHONE` is still empty**, which hides the telephone line rather than
  printing a placeholder. A good half of mosque committees will ring rather than
  write, so this is worth filling.
- **Where the form posts is decided: a Cloudflare Worker, in `worker/`.**
  Written and tested, not yet deployed. `worker/README.md` has the steps; it
  `wrangler.toml` now carries `info@masjidone.co.uk` as both `SEND_TO` and
  `destination_address` — **that address must be verified in Cloudflare Email
  Routing before the Worker will send**, which is also the condition that keeps
  it free. `SEND_FROM` is `forms@masjidone.co.uk`, which needs to exist in Email
  Routing as a sender but needs no mailbox; point it at `info@` as a forwarder
  so bounces land somewhere. Still needed: the sending domain onboarded, one
  `wrangler deploy`, and the repository variable
  `NEXT_PUBLIC_FORM_ENDPOINT` set to
  `https://forms.masjidone.co.uk/demo-request`.
  Two things about it that are easy to get wrong later:
  **IT IS NOT FREE — that claim was wrong and was corrected on 4 October 2026.**
  Sending *to* a verified destination address is free on any plan, which is true
  and is why the binding is pinned with `destination_address`. But Cloudflare
  also says *"you can only send from your routing domains"*, so the **sender**
  address forces a choice: enable Email Routing on `masjidone.co.uk` (free, and
  it **replaces the root MX records**, breaking the mailboxes bought on
  4 October), or onboard the domain to Email Sending, which the dashboard gates
  behind **Workers Paid at $5/month** and which only touches the `cf-bounce`
  subdomain. There is no free path that leaves the email working. See
  `worker/README.md`.
  Because Workers Paid includes 3,000 outbound emails a month, the old warning
  that emailing the enquirer would "leave the free case" no longer applies — it
  is a decision rather than a cost cliff.
  **The privacy notice switches itself.** `app/privacy/page.tsx` reads
  `FORM_ENDPOINT` and prints the mailto wording or the Worker wording
  accordingly, so the copy cannot be left describing the old behaviour. Do not
  replace that conditional with whichever branch happens to be true today.
  Note two corrections to the earlier brief. **Cloudflare Pages Functions are
  not available**, because the site is served by GitHub Pages. And a Worker
  does *not* mean "no processor in the policy" — Cloudflare carries the
  submission and is a processor, named in the notice. What it avoids is a form
  company keeping its own copy of every enquiry.
- **Drop the dead `masjid_theme(text)` function.** One statement —
  `DROP FUNCTION public.masjid_theme(text);` — in the Supabase SQL editor. It
  is already unreachable (EXECUTE revoked from every role, `masjids.theme` back
  to `{}`, comment marked DEAD), but it is a signpost toward a model this
  product does not have. The drop could not be issued through the MCP tooling,
  which timed out on it repeatedly while every other statement went through.
- Do not add a captcha. reCAPTCHA is a Google tracker and would trigger the
  cookie banner this site deliberately avoids. The form has a honeypot.
- Set `NEXT_PUBLIC_BASE_PATH` as a repository variable, or add a `CNAME` to
  `public/` for a custom domain.
