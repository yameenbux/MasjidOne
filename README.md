# MasjidOne — Website

Marketing site for MasjidOne, a platform that runs a mosque's madrasah
and its congregation on one system: registers, fees and parent access
alongside prayer times, a congregation app, website, hall screens and
donations.

A product of YSB Ventures Ltd, Bolton.

## Stack

Next.js (App Router) with TypeScript, Tailwind CSS and shadcn/ui.
The build is a static export — `output: 'export'` writes plain HTML, CSS
and JS to `out/`, so there is no server at request time.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```

## Deploying

GitHub Actions builds and publishes to Pages
(`.github/workflows/deploy.yml`). Pages cannot build a Next app from a
branch, so set **Settings → Pages → Source** to **GitHub Actions**.

If the site is served from `<user>.github.io/MasjidOne` rather than a
custom domain, set the repository variable `NEXT_PUBLIC_BASE_PATH` to
`/MasjidOne`. For a custom domain, leave it unset and add a `CNAME` file
to `public/`.

## Editing

- Plans and prices live in `components/masjidone-pricing.tsx`
- The pricing block itself is `components/ui/pricing.tsx`
- Every other section is in `components/site-sections.tsx`, with its
  behaviour in `components/site-behaviour.tsx`
- Colour, type and spacing tokens are in `app/globals.css`
- Contact details are in the `#contact` section and the mailto links
- Interface previews are inline SVG, to be replaced with live
  screenshots before public launch

Read `CLAUDE.md` before changing copy — the pricing, the competitive
claim and the "in development" tags are commercial commitments, not
wording choices.

## Licence

All rights reserved. Not open source.
