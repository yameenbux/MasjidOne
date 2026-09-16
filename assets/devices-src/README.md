# Source captures

The originals as uploaded, 9.7MB in total. They are **not** in `public/`, so they
are not copied into the deploy artifact — only the optimised WebP in
`public/devices/` ships, which is 0.41MB.

Anything under `public/` is published verbatim, so leaving 9.7MB of unused PNG
there put ten megabytes of dead weight into every deploy without a single byte
of it ever reaching a visitor.

## Regenerating the WebP

The cards never render wider than about 600 CSS pixels, so even at 2x these
sources are several times larger than the browser can use. To re-encode after
replacing a capture:

    node scripts/optimise-devices.mjs

It reads this folder and writes `public/devices/<name>.webp`.
