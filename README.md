<div align="center">

# MasjidOne

**One system for a masjid's madrasah and its congregation.**

Registers, fees and parent access on one side. Prayer times, a congregation
app, the website, the hall screens and donations on the other.
The same family, on both.

A product of **YSB Ventures Ltd**, Bolton.

![Next.js](https://img.shields.io/badge/Next.js-15-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%2017-0C2A21?style=flat-square&labelColor=0C2A21&color=2C4C40)
![Static export](https://img.shields.io/badge/build-static%20export-C0A46A?style=flat-square&labelColor=0C2A21)
![Licence](https://img.shields.io/badge/licence-all%20rights%20reserved-7D5F2D?style=flat-square&labelColor=0C2A21)

</div>

---

## The problem, in one picture

A typical masjid runs its week across half a dozen things that have never
heard of each other. The office knows a family three separate times and
can join them up only by remembering.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"system-ui","fontSize":"14px"}}}%%
flowchart LR
    subgraph TODAY["❌ How it usually works"]
        direction TB
        A1[Paper register<br/>in a drawer]
        A2[Fees in a<br/>spreadsheet]
        A3[WhatsApp<br/>for parents]
        A4[A website<br/>nobody can edit]
        A5[Prayer times<br/>typed twice]
        A6[Donations on<br/>a third-party page]
    end

    subgraph ONE["✅ MasjidOne"]
        direction TB
        B1[One record<br/>of the family]
        B1 --> B2[Madrasah side]
        B1 --> B3[Congregation side]
    end

    TODAY -.->|"the same family,<br/>six times over"| ONE

    classDef bad fill:#EAE7DD,stroke:#B4AE9D,stroke-width:1px,color:#4E5F57
    classDef good fill:#0C2A21,stroke:#C0A46A,stroke-width:1px,color:#F3F1EA
    class A1,A2,A3,A4,A5,A6 bad
    class B1,B2,B3 good
```

Plenty of products do the congregation side, and do it well. The part
nobody else does is running the **madrasah's daily operations** — the
register marked each evening, the sabaq heard, the fee due — in the same
system, and then giving a parent a view of their own child.

---

## The four surfaces

Every masjid on MasjidOne gets the same four things. Same layout, their
colours, their domain.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"system-ui","fontSize":"14px"}}}%%
flowchart TD
    CORE(("MasjidOne"))

    CORE --> W["🌐 <b>Website</b><br/>Prayer times, notices,<br/>hall hire, nikāḥ, classes,<br/>donations"]
    CORE --> S["🖥️ <b>In-masjid screens</b><br/>Hall and foyer boards,<br/>same published timetable<br/>as the website"]
    CORE --> A["📱 <b>Congregation app</b><br/>One app, masjid picker.<br/>Push for janāzah and<br/>jamāʿah changes"]
    CORE --> M["🎓 <b>Madrasah portal</b><br/>Registers, fees,<br/>parent access"]

    W --- WL(["Live"])
    S --- SL(["Live"])
    A --- AL(["Live"])
    M --- ML(["In development"])

    classDef core fill:#0C2A21,stroke:#C0A46A,stroke-width:3px,color:#F3F1EA,font-size:16px
    classDef live fill:#EAE7DD,stroke:#2F6B4F,stroke-width:2px,color:#12201A
    classDef soon fill:#EAE7DD,stroke:#8A6314,stroke-width:2px,color:#12201A,stroke-dasharray:4 3
    classDef tagok fill:#E2EDE5,stroke:#2F6B4F,color:#2F6B4F
    classDef tagsoon fill:#F3EBD8,stroke:#8A6314,color:#8A6314
    class CORE core
    class W,S,A live
    class M soon
    class WL,SL,AL tagok
    class ML tagsoon
```

> **The madrasah portal and parent access are not built yet.** They are
> tagged "in development" here, on the website and in the console, and
> they stay tagged until they are real.

---

## How the pieces actually fit

This is the technical picture. **This repository is only the top-left box** —
the marketing website. The platform lives in its own repository.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"system-ui","fontSize":"13px"}}}%%
flowchart TB
    subgraph BROWSE["What people open"]
        direction LR
        MKT["<b>Marketing site</b><br/>── this repo ──<br/>Next.js 15 · TypeScript<br/>Tailwind · shadcn/ui"]
        SITE["<b>Masjid website</b><br/>Next.js · themed per masjid"]
        SCREEN["<b>Hall screens</b><br/>Browser display"]
        APP["<b>Congregation app</b><br/>React Native · Expo"]
        CONSOLE["<b>Office portal</b><br/>+ MasjidOne console"]
    end

    MKT --> GHA["<b>GitHub Actions</b><br/>builds the static export"]
    GHA --> PAGES["<b>GitHub Pages / CDN</b><br/>plain HTML, CSS, JS<br/>no server at request time"]

    subgraph SUPA["Supabase — one project, one database"]
        AUTH["<b>Auth</b><br/>email + two-step"]
        PG[("<b>Postgres 17</b><br/>every table carries masjid_id")]
        RLS["<b>Row Level Security</b><br/>+ SECURITY DEFINER functions<br/>scoped to one masjid"]
        CRON["<b>pg_cron + pg_net</b><br/>overnight retention,<br/>weekly digest, health check"]
        FN["<b>Edge Functions</b><br/>Deno · notify"]
    end

    SITE --> PG
    SCREEN --> PG
    APP --> PG
    CONSOLE --> AUTH
    AUTH --> PG
    PG --- RLS
    CRON --> PG
    CRON --> FN
    PG --> FN
    FN --> SIGNAL["<b>OneSignal</b><br/>push, per masjid"]
    STRIPE["<b>Stripe</b><br/>one account per masjid<br/>0% commission"] -.->|"webhook"| FN
    FN -.-> PG

    classDef repo fill:#C0A46A,stroke:#0C2A21,stroke-width:3px,color:#0C2A21
    classDef ui fill:#EAE7DD,stroke:#B4AE9D,color:#12201A
    classDef infra fill:#0C2A21,stroke:#2C4C40,color:#F3F1EA
    classDef db fill:#2C4C40,stroke:#C0A46A,stroke-width:3px,color:#F3F1EA
    classDef ext fill:#F3F1EA,stroke:#7D5F2D,stroke-width:2px,color:#12201A
    class MKT repo
    class SITE,SCREEN,APP,CONSOLE ui
    class GHA,PAGES,AUTH,FN,CRON infra
    class PG,RLS db
    class STRIPE,SIGNAL ext
```

### Why one database and not one per masjid

Every table carries a `masjid_id`. Every function and every security
policy filters on it, and a person can only ever act for one masjid at a
time.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"system-ui","fontSize":"13px"}}}%%
flowchart LR
    U["Signed-in<br/>administrator"] --> CM{{"which masjid<br/>are they acting for?"}}
    CM --> T["Taiyabah's rows"]
    CM -.->|"never"| X["Another masjid's rows"]

    classDef p fill:#EAE7DD,stroke:#B4AE9D,color:#12201A
    classDef g fill:#0C2A21,stroke:#C0A46A,stroke-width:2px,color:#F3F1EA
    classDef ok fill:#E2EDE5,stroke:#2F6B4F,stroke-width:2px,color:#12201A
    classDef no fill:#F3F1EA,stroke:#B4AE9D,stroke-dasharray:4 3,color:#8A9A91
    class U p
    class CM g
    class T ok
    class X no
```

A database each would mean a separate migration, a separate set of keys
and a separate auth setup for every customer — and the whole point of the
product, one record of one family reachable from both sides, happens
*inside* a masjid rather than between them. Separation buys nothing there
and costs a great deal to run.

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

### Deploying

GitHub Actions builds and publishes to Pages
(`.github/workflows/deploy.yml`). Pages cannot build a Next app from a
branch, so **Settings → Pages → Source** must be **GitHub Actions**.

| Setting | When | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Served from `<user>.github.io/MasjidOne` | `/MasjidOne` |
| `NEXT_PUBLIC_BASE_PATH` | Custom domain | leave unset, add `CNAME` to `public/` |
| `NEXT_PUBLIC_SITE_URL` | Custom domain | the full origin |

Getting the base path wrong 404s every asset on the page.

### Where things live

| What you want to change | File |
| --- | --- |
| Plans and prices | `components/masjidone-pricing.tsx` |
| The pricing block itself | `components/ui/pricing.tsx` |
| Every other section | `components/site-sections.tsx` |
| Behaviour for those sections | `components/site-behaviour.tsx` |
| Colour, type and spacing | `app/globals.css` |
| Canonical URL, contact address | `lib/site.ts` |
| The full design system | `DESIGN.md` |

---

## What it costs

| | |
| --- | --- |
| **Madrasah** | £79 / month |
| **Masjid Complete** | £179 / month |
| Setup | £499 once — waived on twelve months prepaid |
| Donations | 0% commission |

Yearly billing is the same rate shown twelve times over, not a discount.
Only the setup fee falls.

---

## Before you change any copy

Read **`CLAUDE.md`** first. The prices, the competitive claim and the
"in development" tags are commercial commitments, not wording choices.
Three that catch people out:

- **Never claim a feature that is not built.** The madrasah portal and
  parent access are in development.
- **Never say no competitor does the whole masjid.** Several do the
  congregation side. The defensible claim is narrower and it is written
  down in `CLAUDE.md`.
- **Compliance is a commitment, not a fact.** ICO registration and the
  data processing agreement are promised *before a masjid is invoiced*.
  Do not rewrite them into the present tense until they are done.

British English throughout, and Arabic terms keep their diacritics:
jamāʿah, Jumuʿah, janāzah, nikāḥ, Hifz, sadaqah, madrasah, masjid.

---

## Licence

All rights reserved. Not open source.
