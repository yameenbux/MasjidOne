# Hero device screenshots

The opening screen (`components/masjidone-hero.tsx`) expects eight images here.
Until a file exists, that card shows a dashed frame with its caption instead of
a broken image, so the page is never embarrassing while these are outstanding.

| Filename            | What it should show                                        | Tagged |
| ------------------- | ---------------------------------------------------------- | ------ |
| `hall-screen.png`   | A prayer hall screen: today's begins and jamāʿah times      | Live |
| `app-jamaah.png`    | The congregation app: a jamāʿah reminder with a personal offset | Live |
| `website.png`       | The managed mosque website, on a laptop                     | Live |
| `giving.png`        | One-tap giving in the app                                   | Live |
| `janazah.png`       | A janāzah notice on the hall screens                        | Live |
| `committee.png`     | The committee view: announcements and the timetable         | Live |
| `parent.png`        | A parent seeing their child's attendance, in the app        | In development |
| `register.png`      | A teacher taking the daily register on a tablet             | In development |

## Rules these have to follow

1. **Test data only.** Never a real child's record, and never a real family's
   name, address or fee history. The house rule is that example student data
   must be obviously fictional.
2. **No masjid is named** until the reference mosque has signed. The hero
   already says "interface previews, not screenshots of a specific masjid" —
   keep that true.
3. `parent.png` and `register.png` are modules that do not exist yet. They stay
   tagged *In development* in the hero until they ship. If you have no mockup,
   leave the file out — the dashed placeholder is more honest than a fake.

## Format

Roughly 2x the rendered size, so about 1200px on the long edge. PNG for screen
captures. They are cropped with `object-fit: cover`, so keep the important part
of each screen near the centre.
