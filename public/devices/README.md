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
| `hall-screen` | hero, previews tab 1, `/mosque-prayer-times-screens/`, `/mosque-website/` |
| `app-prayer-times` | hero, previews tab 2, `/mosque-app/` |
| `admin-register` | previews tab 3, `/madrasah-software/` |
| `admin-fees` | previews tab 4, `/madrasah-software/` |
| `app-parent` | previews tab 5, `/madrasah-software/`, `/mosque-app/` |
| `foyer-appeal` | hero, `/mosque-prayer-times-screens/`, `/mosque-donations/` |
| `website` | hero, `/mosque-website/`, `/mosque-prayer-times-screens/` |
| `app-notices` | hero, `/mosque-app/`, `/mosque-website/`, `/mosque-prayer-times-screens/` |
| `app-giving` | hero, `/mosque-donations/`, `/mosque-app/` |
| `app-duas` | hero, `/mosque-app/` |
| `admin-committee` | hero, `/madrasah-software/`, `/mosque-donations/` |

### Which of these carry a development tag

**`app-parent` only.** Its caption must always say "In development for the
September 2027 intake", because no parent has ever signed in — `user_roles`
holds zero parent accounts.

`admin-register` and `admin-fees` **do not**. This file used to group them with
`app-parent` as "modules in development", which was wrong and had gone stale:
the madrasah portal is built, and the home page has carried a Live badge and a
"Running at a named masjid" caption on both screens for some time, so this
README was contradicting the site it governs.

What is defensible about them, checked against the production database rather
than assumed: the portal holds that masjid's full roll — pupils, classes, staff,
households and guardians, with teachers assigned to classes and fee rates set —
and several thousand logged admin actions. It holds **no submitted register and
no payment**. So "built, and configured in a masjid" is supported; "registers
are taken every evening" is not, and no caption should imply it. The FAQ on the
home page is worded to that line and these captions should stay on it too.

## Regenerating

PNG sources live in `assets/devices-src/`, deliberately outside `public/`
because everything under `public/` is published verbatim and the sources are
12MB. To re-encode after replacing one:

```bash
node scripts/optimise-devices.mjs
```

That script also knows the founding masjid's captures, which are still in
`assets/devices-src/` but no longer referenced by the site. It will regenerate
them into this folder, where they would ship unused — delete what you do not
reference.
