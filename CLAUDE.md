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
  Two unavoidable exceptions: `<meta name="theme-color">` and the favicon
  data-URI, where CSS variables cannot be used.
- Left-aligned, generous whitespace, hairline rules. **The pricing block is
  the one deliberate exception** — it is centred, rounded and card-based
  because it was adopted as supplied. Don't spread that styling outward.

## Content rules — these matter more than the code

These are commercial claims. Getting one wrong loses a sale and a referral.

1. **Never claim a feature that isn't built.** The madrasah portal and parent
   access are in development, not live. Everything tagged "In development"
   must stay tagged.
2. **Never claim "no competitor does the whole mosque."** It is false —
   several platforms do the congregation side. The true, defensible claim is
   narrower: *nobody joins the madrasah to the congregation.* Keep the copy
   on that line.
3. **Pricing is fixed.** Madrasah £79/mo, Masjid Complete £179/mo, setup £499
   once (waived on twelve months prepaid), 0% commission on donations. Do not
   invent tiers, discounts or "from £" phrasing.
   **Never discount the monthly — waive the setup fee instead.** The pricing
   toggle shows the same rate two ways, and the invariant is arithmetic:
   for a plan whose `period` is `month`, `yearlyPrice` must be exactly
   `price × 12` (£79 → £948, £179 → £2,148). Anything less than 12× is a
   discount on the monthly and is wrong. Only the setup card genuinely
   falls, £499 → £0.
   In the yearly view each card also prints its monthly rate underneath, so
   a twelve-month total cannot be misread as a price rise. Keep that line.
4. **Do not name competitors on the public site.** The comparison happens in
   the room, not on the page.
5. **Taiyabah Masjid may now be named.** Permission to use their name, logo
   and screenshots was given on 16 September 2026. The hero uses real captures
   of their live site, app and hall screens. Two things still apply: get the
   permission in writing as part of the founding-customer agreement, and never
   publish a screen containing a real child's record or a real family's fee
   history — see `public/devices/README.md`. Other customers stay unnamed until
   they say otherwise.
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
  only, never a real child's record).
- Fill in the real contact email and phone in `#contact` — currently the
  placeholder `REPLACE-ME@masjidone.example`.
- Decide on a contact form. Static export can't process one; Formspree is the
  minimal option, Cloudflare Pages Functions the better one.
- Set `NEXT_PUBLIC_BASE_PATH` as a repository variable, or add a `CNAME` to
  `public/` for a custom domain.
