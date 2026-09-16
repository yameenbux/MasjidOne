/**
 * Re-encode the hero captures from assets/devices-src/ into public/devices/.
 *
 * Run after replacing or adding a capture:
 *     node scripts/optimise-devices.mjs
 *
 * The originals are phone screenshots (1179x2556) and display captures
 * (1920x1080). The cards never render wider than about 600 CSS pixels, so even
 * at 2x device pixel ratio the sources are several times larger than anything
 * the browser can use. Left as-is they were 9.7MB; this brings them to ~0.4MB.
 *
 * Sources deliberately live outside public/, because everything under public/
 * is published verbatim and 9.7MB of unused PNG would ship on every deploy.
 */
import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets/devices-src");
const OUT = path.join(ROOT, "public/devices");

/** Widest the card can render, doubled for retina and rounded up. */
const TARGET_WIDTH = {
  "taiyabah-website-laptop.png": 1400, // 28vw card
  "timetable_landscape_raw.png": 1400, // 30vw
  "foyer_landscape_raw.png": 1300, // 26vw
  "timetable_portrait_raw.png": 700, // 12vw
  "foyer_portrait_raw.png": 700,
  "times.png": 640, // 11vw
  "donate.png": 640,
  "curriculum.png": 640,
  "duas.png": 640,
  "home.png": 640,
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));
if (files.length === 0) {
  console.error(`No PNG sources in ${SRC}`);
  process.exit(1);
}

let before = 0;
let after = 0;

for (const file of files.sort()) {
  const src = path.join(SRC, file);
  const out = path.join(OUT, file.replace(/\.png$/, ".webp"));
  const meta = await sharp(src).metadata();
  const width = Math.min(TARGET_WIDTH[file] ?? 900, meta.width);

  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(out);

  const b = (await stat(src)).size;
  const a = (await stat(out)).size;
  before += b;
  after += a;
  console.log(
    `${file.padEnd(32)} ${String(meta.width).padStart(4)}px ${(b / 1024).toFixed(0).padStart(5)}KB  ->  ${String(width).padStart(4)}px ${(a / 1024).toFixed(0).padStart(5)}KB`,
  );
}

console.log(
  `\nTOTAL ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(2)}MB (${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
);
