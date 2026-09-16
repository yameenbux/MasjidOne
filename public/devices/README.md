# Device imagery

Eleven WebP files, all of them **interface previews** rather than captures of a
running masjid.

## The honesty rule that governs this folder

- **Nothing here is a screenshot.** No masjid is named, every time and figure
  is example data, and the pupil names in the madrasah screens are
  placeholders — `admin-register` prints that on the screen itself.
- The note under the hero says `Interface previews · example data, no masjid
  named`, and the previews section opens by saying the same thing. **If the
  imagery in this folder ever changes back to real captures, both of those
  lines have to change with it.** The reverse is what matters more: a preview
  described as a live capture is the worst claim this site could make.
- **Never publish a screen containing a real child's record or a real family's
  fee history.** This holds whoever the masjid is and whatever permission
  exists. It is the one rule with a child on the other side of it.

## What is here

| File | Used by |
| --- | --- |
| `hall-screen` | hero, previews tab 1 |
| `app-prayer-times` | hero, previews tab 2 |
| `admin-register` | previews tab 3 |
| `admin-fees` | previews tab 4 |
| `app-parent` | previews tab 5 |
| `foyer-appeal`, `website`, `app-notices`, `app-giving`, `app-duas`, `admin-committee` | hero |

`admin-register`, `admin-fees` and `app-parent` are the **madrasah portal and
parent access — modules in development**. Each of their captions carries
"In development for the September 2027 intake". Do not show them without it.

## Regenerating

PNG sources live in `assets/devices-src/`, deliberately outside `public/`
because everything under `public/` is published verbatim and the sources are
12MB. To re-encode after replacing one:

```bash
node scripts/optimise-devices.mjs
```

That script also knows the Taiyabah Masjid captures, which are still in
`assets/devices-src/` but no longer referenced by the site. It will regenerate
them into this folder, where they would ship unused — delete what you do not
reference.
