# Hero device screenshots

The opening screen (`components/masjidone-hero.tsx`) expects these eight files.
Until a file exists, that card shows a dashed frame with its caption instead of
a broken image, so the page is never embarrassing while they are outstanding.

All eight are captures of Taiyabah Masjid's live site, app and hall screens,
used with their permission (given 16 September 2026).

| Filename                   | The screen you already have                                   |
| -------------------------- | ------------------------------------------------------------- |
| `hall-screen.png`          | Hall screen, **landscape** — big clock, next jamāʿah countdown, six prayers across |
| `hall-screen-portrait.png` | The same hall screen **portrait**, for a wall-mounted display   |
| `website.png`              | Website homepage on the laptop mockup, building photo behind    |
| `newbuild-desktop.png`     | New build appeal, **landscape** — phases left, QR and bank details right |
| `app-prayer-times.png`     | App · Prayer Times — Today, Beginning and Jamāʿah columns       |
| `app-giving.png`           | App · new build appeal with the £250 / £500 giving tiers        |
| `app-madrasah.png`         | App · "Our Curriculum — what students learn at the madrasah"     |
| `app-duas.png`             | App · "Everyday Duʿās" category grid                            |

There is also a portrait new-build capture that is not currently used. Add it as
a ninth card if you want it — the stack takes any number.

## Rules these have to follow

1. **Test data only where a person appears.** None of the eight above contain
   personal data, which is why they were chosen. Never publish a screen showing
   a real child's record, attendance, or a family's fee history.
2. **No madrasah-portal or parent-access screens.** Those modules are not built.
   An invented screen for them would be the largest untrue claim on the page.
   They join the stack when they exist.
3. If a capture ever shows another masjid, it needs that masjid's permission
   too. Taiyabah's permission covers Taiyabah.

## Format

Roughly 2× the rendered size — about 1200px on the long edge is plenty. PNG.
They are cropped with `object-fit: cover`, so keep the important part of each
screen near the centre: the card aspect ratios are set per device (wide for the
hall screen and laptop, tall for the phone shots) but they are not exact.
