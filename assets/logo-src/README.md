# MasjidOne logo · concept A2

Dome between two minarets, the seam running through the base rule. Brass
`#7D5F2D` on paper, `#C0A46A` on the board. Wordmark: Newsreader, "One" in
italic. Everything around it: Archivo.

## What's here

### `svg/` — the mark, scalable, no text
| File | Use |
| --- | --- |
| `mark-brass.svg` | On paper (`#F3F1EA`, `#EAE7DD`) |
| `mark-board-brass.svg` | On the board (`#0C2A21`) |
| `mark-board-green.svg` | On brass or pale photography |
| `mark-black.svg` / `mark-white.svg` | One-colour print, stamps, embroidery |
| `icon-512.svg` | App icon, store listing |
| `icon-180-apple-touch.svg` | `apple-touch-icon` |
| `favicon-32.svg` | Favicon, dark. Pair with `favicon-light-32.svg` via `prefers-color-scheme` |

Drop straight into the repo:

```html
<link rel="icon" href="/favicon-32.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon-180-apple-touch.svg">
```

### `png/` — lockups, at 2× (4× for the avatar)
| File | Use |
| --- | --- |
| `lockup-stacked.png` | Primary. Decks, posters, the carousel end slide |
| `lockup-horizontal.png` | Headers, signatures, anywhere wide and short |
| `lockup-reversed.png` | The same, on the board |
| `lockup-mono.png` | One colour, both polarities |
| `avatar-1080.png` | Instagram / X / LinkedIn profile picture — safe inside the circle |
| `social-card-1200x630.png` | Open Graph card, link previews |
| `site-header.png` | Reference for the built header, light and board |
| `email-signature.png` | 600px signature block |
| `letterhead-a4.png` | A4 letter, with the body copy as a specimen |
| `business-card.png` | 85×55mm, both faces |
| `clear-space-rules.png` | The rules sheet, for anyone else using the mark |

The lockups are PNG rather than SVG because their wordmark is live Newsreader:
an SVG carrying `font-family="Newsreader"` renders in Georgia on any machine
without the font. If you want true vector lockups, open `lockup-stacked.png`'s
source in the bundle and convert the text to outlines in Illustrator or
Inkscape once — then it is safe as SVG forever.

## Rules

Clear space equals the dome's height on all four sides. Minimum sizes: mark
alone 16px, horizontal lockup 120px wide, stacked lockup 180px wide — below
that, use the mark on its own.

Never rotate, outline or shadow the mark; never stretch the minarets to fill a
space; never set the wordmark in another family; and don't put brass on
`--paper-2` below 14px — use ink, per the contrast note in DESIGN.md §3.4.
