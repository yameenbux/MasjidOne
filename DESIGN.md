# MasjidOne — design system

The marketing site for MasjidOne, a platform that runs a UK mosque's madrasah
and its congregation on one system. A product of YSB Ventures Ltd, Bolton.

This document is the design contract. It is written to be used without reading
the code: every value below is the real value in `app/globals.css` and
`tailwind.config.ts` as of this commit.

---

## 1. Who this is for, and what that costs

The reader is a **mosque committee** — typically several trustees, often
middle-aged or older, often reading on a phone in a hall with the lights half
on. They have already met the founder. Nobody buys this from the website; the
site's job is to give them somewhere to land afterwards, look at what they
would be buying, and request a demo.

Three consequences that outrank taste:

- **Legibility beats fashion.** No thin grey-on-grey, no 12px body copy, no
  text over busy photography without a scrim.
- **Honesty is a design constraint, not a copy constraint.** Anything not built
  carries an "In development" tag, and the tag is part of the component, not an
  afterthought. A badge that overstates costs a sale and the referral behind it.
- **It must work at 360px, with no JavaScript, and in both themes.** Not as a
  nicety — the audience genuinely includes old Android phones and aggressive
  battery savers.

---

## 2. Where the design comes from

The whole palette and form language is derived from **a UK mosque prayer-time
board**: deep bottle green, a paper off-white, brass lettering, hairline
dividers, and a two-column *begins / jamāʿah* rhythm.

That vernacular is why:

- Dividers are 1px hairlines, never shadows.
- Corners are square. (Two deliberate exceptions, §6.)
- Numbers are tabular.
- Labels are condensed uppercase with wide tracking.
- The dark theme is not an inversion — it is the board itself.

If a new element cannot be explained by "this is how a prayer board behaves",
it probably does not belong.

---

## 3. Colour

All colour lives in CSS custom properties. **Never write a hex outside the
token blocks.** Two unavoidable exceptions exist: `<meta name="theme-color">`
and the favicon data-URI, neither of which can read a custom property.

### 3.1 Tokens

| Token | Light | Dark | What it is for |
| --- | --- | --- | --- |
| `--paper` | `#F3F1EA` | `#081513` | Page background |
| `--paper-2` | `#EAE7DD` | `#0D1E19` | Subtle surface: cards, list rows, featured table column |
| `--ink` | `#12201A` | `#E9E5D9` | Body text |
| `--ink-2` | `#4E5F57` | `#92A49B` | Secondary text, labels, captions |
| `--rule` | `#D5D1C4` | `#1D322A` | Hairline dividers, section rules |
| `--rule-2` | `#B4AE9D` | `#2B4438` | Stronger hairline: featured borders, node outlines |
| `--brass` | `#7D5F2D` | `#C9A567` | Accent text, focus ring, live tags, selection |
| `--brass-2` | `#C0A46A` | `#8C7240` | Secondary accent, beam gradient |
| `--board` | `#0C2A21` | `#0E241C` | Inverted panel: the hub, the prayer board, the footer |
| `--board-ink` | `#EDE9DD` | `#E7E3D7` | Text on `--board` |
| `--board-ink-2` | `#93A69B` | `#8DA096` | Secondary text on `--board` |
| `--board-rule` | `#2C4C40` | `#2A4A3C` | Hairlines on `--board` |
| `--board-brass` | `#C0A46A` | `#C9A567` | Accent on `--board` |
| `--cta-bg` / `--cta-fg` | `#0C2A21` / `#F3F1EA` | `#C9A567` / `#081513` | Primary button. Note the inversion in dark |
| `--beam-line` | `#857F6E` | `#4A7563` | Static connector in the modules diagram |
| `--beam`, `--beam-rim`, `--beam-sheen` | — | — | Spinning-border CTA only |
| `--btn-fill`, `--btn-fill-fg` | — | — | Button hover fill |
| `--shade-1` / `--shade-2` | `rgb(0 0 0 / .80)` / `rgb(0 0 0 / .52)` | same | Scrim over photography. **Theme-invariant on purpose** — it darkens a photo, not the page |

### 3.2 Three theme blocks, kept in agreement

Any new token goes in **all three** of:

1. `:root`
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
3. `:root[data-theme="dark"], .dark`

Forgetting one silently breaks a theme. The toggle sets both `data-theme` and
shadcn's `.dark` class, and is **session-only** — no `localStorage`.

### 3.3 Two token systems

`app/globals.css` defines the MasjidOne tokens **and** the shadcn HSL tokens
(`--background`, `--primary`, `--muted`, …) carrying the same palette. Change
one, change the other, or adopted components drift from the page.

The mapping is **not** what a stock shadcn component expects:

| shadcn token | Here it carries | Watch out |
| --- | --- | --- |
| `--background` / `--foreground` | paper / ink | fine |
| `--muted` | `--paper-2` | **This is the card surface.** |
| `--secondary` | board brass | An *accent*, not a surface. `bg-secondary` on a card renders a solid tan block. |
| `--primary` | board (light) / brass (dark) | Inverts between themes |
| `--accent` | brass | |
| `--border` / `--input` | `--rule` | |

When adopting a third-party block, `bg-secondary` almost always needs to become
`bg-muted`. This has already bitten once.

### 3.4 Contrast

WCAG AA is the floor, not the target: **4.5:1** for normal text, **3:1** for
large text and for any graphic that carries meaning (a connector line, an icon
that is not decorative).

Measured and holding:

- `--brass` on `--paper` — **5.17:1**; on `--paper-2` — **4.79:1**. It has been
  darkened twice to get there. If you put brass text on a new surface, measure.
- `--beam-line` against the page — **3.53:1** light, **3.56:1** dark.
- Caption over the photo scrim at `.80` — **10.7:1**; brass tag over it — **5.4:1**.

The audit script reports two permanent false positives (`figcaption.stack-card__cap`
and one `span.tag`): it walks the DOM for a background colour and finds
`--paper-2` rather than the rendered scrim-over-photograph. Real values above.

---

## 4. Typography

Two families, loaded via `<link>` in `app/layout.tsx`:

- **Newsreader** (serif, variable) — `h1`–`h3`, pull quotes, the wordmark.
  Weight 400 for headings, 300 italic for quotes.
- **Archivo** (sans, variable `wdth` 75–110, `wght` 400–700) — everything else.

### 4.1 Scale

| Token | Value | Used by |
| --- | --- | --- |
| `--t-display` | `clamp(2.5rem, 6.4vw, 4.75rem)` | `h1` |
| `--t-h2` | `clamp(1.75rem, 3.4vw, 2.6rem)` | `h2` |
| `--t-h3` | `clamp(1.15rem, 1.6vw, 1.35rem)` | `h3` |
| `--t-body` | `clamp(1rem, .35vw + .93rem, 1.1rem)` | body |
| `--t-small` | `.875rem` | captions, table cells, card copy |
| `--t-label` | `.6875rem` | eyebrows, tags, status words |

Headings: `line-height: 1.06`, `letter-spacing: -.015em`. Body: `1.55`.

### 4.2 The label voice

Eyebrows, tags and status words share one treatment, and it is the board's
label vernacular:

```
font-size: var(--t-label);
letter-spacing: .14em – .18em;
text-transform: uppercase;
font-variation-settings: "wdth" 82, "wght" 600;
```

The `wdth 82` condensed axis is doing real work — it is what makes these read
as board lettering rather than as generic small caps. Do not substitute a
different family here.

### 4.3 Numbers

Timetables, prices and any figure a person will compare down a column get
`font-variant-numeric: tabular-nums` (the `.num` class).

### 4.4 The one fixed size

The wordmark inside the diagram hub is a **fixed `2.25rem`**, not a scale
token. A lockup that must fit inside a circle of known diameter cannot be on a
fluid scale — on `--t-h2` it grew to 184px of text inside a 176px circle. The
header wordmark (`1.15rem`) is fixed for the same reason. **Lockups are sized
to their container; everything else uses the scale.**

---

## 5. Space and layout

| Token | Value |
| --- | --- |
| `--s1` … `--s6` | `.5rem`, `1rem`, `1.5rem`, `2.5rem`, `4rem`, `6.5rem` |
| `--wrap` | `74rem` max width |
| `--measure` | `36rem` — the reading measure for prose |
| `--hair` | `1px` |

`.wrap` centres content and pads `--s3` (mobile) / `--s4` (≥52em).
`.sect` gives every section `padding-block: var(--s6)` (`--s5` under 52em) and
a `border-top` hairline. Prose gets `.measure` — long lines are the fastest way
to make this page feel cheap.

### Breakpoints

`52em` (832px) is **the** breakpoint — single column below, two or more above.
Secondary: `44em` and `46em` (footer and checks grids), `60em` (header nav
appears), `64em` (widest grid variants).

Design at **360px** and **1280px**. Those are the two that matter.

---

## 6. Form language

- **Square corners, hairline rules, generous whitespace, left-aligned.**
- No drop shadows. Depth comes from a `--paper-2` fill between hairlines.
- Seamed grids are a signature move: a container with
  `background: var(--rule)` and `gap: var(--hair)`, children filled `--paper`.
  The 1px gaps become the rules, and the whole block reads as a board.

### The two deliberate exceptions

1. **The pricing block** is centred, rounded and card-based, because it was
   adopted as supplied. **Do not spread that styling outward.**
2. **The modules diagram** uses circular nodes and a circular hub. A graph node
   is not a card; a circle is the natural shape for a node. This does not
   license rounded corners elsewhere.

Third-party blocks adopted since then (comparison table, FAQ accordion, feature
cards) keep their `rounded-xl` where the block defined it, but take their
colour from the tokens above.

---

## 7. Component inventory

`components/ui/` holds adopted primitives and blocks; `components/` holds the
MasjidOne data that feeds them. That split matters — **commercial claims never
live inside `components/ui/`.**

| Component | What it is |
| --- | --- |
| `pricing.tsx` + `masjidone-pricing.tsx` | Plan cards and the monthly/yearly toggle |
| `comparison-02.tsx` + `masjidone-comparison.tsx` | The three-column "what each system keeps" table |
| `animated-beam.tsx` + `masjidone-modules-diagram.tsx` | Hub-and-spoke diagram, madrasah left / congregation right |
| `feature.tsx` | The six module cards |
| `faq-section.tsx` + `accordion.tsx` | "Your data": commitments and questions |
| `stack-spread.tsx` + `masjidone-hero.tsx` | The scroll-driven hero of device captures |
| `spinning-border-button.tsx` | The "Request a demo" CTA |
| `large-name-footer.tsx` | Footer with the oversized wordmark |
| `variable-font-hover.tsx` | Header nav, labels thicken from the middle out |

### Recurring patterns

- **Eyebrow** — condensed caps plus a hairline that fills the remaining width.
- **Tag** — `.tag` with `border: 1px solid currentColor`, so setting `color`
  restyles the whole chip. `.tag--live` is brass, `.tag--dev` is `--ink-2`,
  `.tag--rec` is board brass.
- **Inverted panel** — `--board` fill, used for exactly one thing per section:
  the single claim that section is making.
- **Scroll region** — wide content (the comparison table) sits in
  `overflow-x: auto` with `role="region"`, `aria-label` and `tabIndex={0}`, and
  a sticky first column. The page body never scrolls sideways.

---

## 8. Motion

Restraint is the rule. Motion explains structure; it does not decorate.

- **Section reveal** is the house mechanism: `.rv` plus `--i` for stagger,
  driven by an IntersectionObserver that adds `.in`. It costs no JavaScript
  framework and it is gated behind a `js` class.
- **framer-motion** is used only by adopted blocks. The package is
  `framer-motion` — never also install `motion`, they are the same library
  under two names and installing both ships two runtimes.
- **`prefers-reduced-motion: reduce` must be honoured by every new animation.**
  Not degraded — honoured. The beams keep their static path and drop the
  travelling gradient; interval loops do not start at all.
- **Scroll-linked** effects use `animation-timeline: view()` behind
  `@supports`, with a transition fallback.

---

## 9. The non-negotiables

A change is not done until all of these hold, in **both** themes:

1. **360px** — no horizontal page scroll. Verify by *scrolling* the page
   (`window.scrollX` stays 0), not by measuring `scrollWidth`, which reports
   in-scroller content and will mislead you.
2. **JavaScript disabled** — the page renders and all content is reachable.
   framer bakes its pre-animation transform into the static export, so any new
   animated block needs an `html:not(.js)` reset. Radix mounts *nothing* for a
   collapsed accordion item, so collapsed content needs a plain fallback copy.
3. **Contrast** — every pair at AA (§3.4).
4. **Heading order** — semantic, no skipped levels. Adopted blocks often ship
   an `h4`; change it to match the page.
5. **Icons** — meaningful SVGs get `role="img"` and `aria-label`; decorative
   ones (including every lucide icon) get `aria-hidden="true"`.
6. **Focus** — `:focus-visible` outlines stay, 2px `--brass` at 3px offset.
7. **Static export** — `output: 'export'` keeps working. Nothing may depend on
   a Node server at request time.

---

## 10. Content rules that shape the design

These are commercial constraints with design consequences.

- **Status tags are structural.** Madrasah portal and parent access are *in
  development*; the congregation app, website and hall screens, donations, and
  committee and roles are *live*. A component showing modules must show status.
- **A `Live` tag constrains its own copy** to what exists today. The Committee
  and roles card is live on the congregation side, so it names teacher and
  parent roles as arriving with the portal rather than implying they work now.
- **Never claim "no competitor does the whole mosque."** It is false. The
  defensible claim is narrower: *nobody joins the madrasah to the congregation.*
  The comparison table is built so rival columns genuinely tick what they
  genuinely do.
- **Do not name competitors.** Categories only. The comparison by name happens
  in the room.
- **Pricing is fixed.** Madrasah £79/mo, Masjid Complete £179/mo, setup £499
  once (waived on twelve months prepaid), 0% commission. For a monthly plan,
  `yearlyPrice` must be exactly `price × 12`. Never discount the monthly —
  waive the setup fee.
- **No social proof.** No counts, logos, testimonials or "popular" badges.
  There are no customers yet. The pricing badge says "Recommended", which is
  our own view.
- **Compliance is a commitment, not a fact.** ICO registration and the DPA are
  promised *before a masjid is invoiced*. Present tense is not yet available.
- **British English.** Arabic terms carry diacritics: jamāʿah, Jumuʿah,
  janāzah, Hifz, sadaqah, madrasah, masjid.
- **Taiyabah Masjid may be named** (permission given 16 September 2026). Never
  publish a screen containing a real child's record or a real family's fee
  history.

---

## 11. Deliberately absent

Do not add these without asking:

- Analytics, tracking pixels, anything that would trigger a cookie banner.
- `localStorage`, `sessionStorage`, cookies. The theme toggle is session-only
  by design and resets on reload.
- An open-source licence file. All rights reserved.
- A server dependency of any kind.

---

## 12. Known open items

- The three inline SVG **interface previews** are not screenshots and their
  captions must say so until real ones replace them.
- `CONTACT_EMAIL` in `lib/site.ts` is still the placeholder
  `REPLACE-ME@masjidone.example`. Every call to action on the site opens mail
  to it.
- No contact form. A static export cannot process one.
- The legal pages are honest drafts and need a solicitor before invoicing.
- ~1MB of JavaScript is the page's dominant weight. Prefer the CSS reveal over
  another framer-driven block where the choice exists.
