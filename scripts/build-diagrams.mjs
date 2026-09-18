/**
 * Renders assets/diagrams/*.mmd to animated SVGs the README embeds.
 *
 * Why this exists rather than ```mermaid fences in the README: GitHub renders
 * mermaid, but it cannot animate it. An SVG file can — the connectors carry a
 * travelling dash, the same idea as the beam on the site's modules diagram.
 * The .mmd files stay in the repo so the diagrams are still text somebody can
 * edit and diff; this script turns them back into pictures.
 *
 *   node scripts/build-diagrams.mjs
 *
 * Needs a Chromium for mermaid-cli. On a machine without one:
 *   npx -y @mermaid-js/mermaid-cli --version
 * will fetch its own.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SRC = "assets/diagrams";

/**
 * The MasjidOne palette, as CSS custom properties inside the SVG. Declared
 * light-first on :root and redefined under prefers-color-scheme, exactly the
 * pattern app/globals.css uses — an SVG loaded through <img> still honours the
 * host page's colour scheme, so the diagrams follow GitHub's theme.
 */
const STYLE = `
  :root {
    --paper:#F3F1EA; --paper-2:#EAE7DD; --ink:#12201A; --ink-2:#4E5F57;
    --board:#0C2A21; --board-ink:#EDE9DD;
    --rule:#B4AE9D; --brass:#7D5F2D; --brass-2:#C0A46A;
    --ok:#2F6B4F; --wait:#8A6314;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --paper:#0A211A; --paper-2:#132C22; --ink:#EDE9DD; --ink-2:#9DB0A6;
      --board:#061711; --board-ink:#EDE9DD;
      --rule:#39604F; --brass:#C0A46A; --brass-2:#D4BE8C;
      --ok:#7FC49B; --wait:#D8B266;
    }
  }

  svg { background: var(--paper); }
  .cluster rect { fill: var(--paper-2) !important; stroke: var(--rule) !important; }
  .cluster-label .nodeLabel, .cluster span { fill: var(--ink-2) !important; color: var(--ink-2) !important; }
  .edgeLabel .labelBkg, .edgeLabel rect { fill: var(--paper) !important; }
  .edgeLabel, .edgeLabel * {
    color: var(--ink-2) !important; fill: var(--ink-2) !important;
    background: transparent !important; font-size: 12px !important;
  }
  .edgeLabel .labelBkg { fill: var(--paper) !important; }
  .nodeLabel, .nodeLabel * { font-family: system-ui, sans-serif; }

  /* The travelling dash. One rule, every connector. */
  .flowchart-link {
    stroke: var(--brass-2) !important;
    stroke-width: 1.6px !important;
    stroke-dasharray: 10 8 !important;
    animation: mo-flow 1.15s linear infinite;
  }
  @keyframes mo-flow { from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; } }
  .arrowMarkerPath { fill: var(--brass-2) !important; stroke: var(--brass-2) !important; }

  /* A masjid committee reading this on a laptop that asks for less motion
     gets a still picture, not a stuttering one. Same guard the site keeps. */
  @media (prefers-reduced-motion: reduce) {
    .flowchart-link { animation: none; stroke-dasharray: none !important; }
  }
`;

const files = readdirSync(SRC).filter((f) => f.endsWith(".mmd")).sort();
if (!files.length) throw new Error(`No .mmd files in ${SRC}`);

const work = mkdtempSync(join(tmpdir(), "mmd-"));
const cfg = join(work, "puppeteer.json");
writeFileSync(cfg, JSON.stringify({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }));

for (const file of files) {
  const out = join(SRC, file.replace(/\.mmd$/, ".svg"));
  execFileSync("npx", ["-y", "@mermaid-js/mermaid-cli", "-i", join(SRC, file),
                       "-o", out, "-p", cfg, "-b", "transparent", "-q"],
               { stdio: "inherit" });

  // mermaid emits exactly one <style> block; append rather than replace so its
  // own layout rules survive.
  let svg = readFileSync(out, "utf8");
  const at = svg.indexOf("</style>");
  if (at === -1) throw new Error(`No <style> block in ${out} — mermaid output changed`);
  svg = svg.slice(0, at) + STYLE + svg.slice(at);
  writeFileSync(out, svg);
  console.log(`${out}  ${(svg.length / 1024).toFixed(1)} kB`);
}
