/**
 * "Every masjid in its own colours" — shown rather than asserted.
 *
 * WHY THIS EXISTS. The demo used to be bottle green with a committee's name on
 * it, and a line underneath admitting the green was ours and not theirs. An
 * admission is weaker than a demonstration. These let the same screens be
 * repainted in front of somebody, so the point lands by being watched: the
 * registers, the fees, the prayer board and every rule behind them do not
 * change. Only the paint does.
 *
 * THESE PALETTES ARE INVENTED, like every other masjid in this demo. Taiyabah's
 * real theme lives in the platform — `masjids.theme`, read by
 * `masjid_theme(slug)` — and is not reproduced here, because a sales demo
 * carrying a real customer's branding is social proof by another route.
 *
 * THE SHAPE MATCHES `masjids.theme` EXACTLY, deliberately. The same six groups,
 * the same key names. A theme copied out of the database should drop in here
 * unchanged, and when the portals learn to read the column this file becomes
 * sample data rather than a second way of describing the same thing.
 *
 * ACCENT IS THREE VALUES, NOT ONE, AND THAT IS THE WHOLE TRAP. Taiyabah's own
 * stylesheet carries the note: their gold reads 2.3:1 on a light card and is
 * unreadable there. An accent that looks right on the dark brand colour is
 * almost never the one that works as text on paper. `on_brand` and `on_paper`
 * are separate so nobody has to rediscover that, and the test asserts both
 * clear AA for every palette here.
 */

export type Theme = {
  brand: { deep: string; mid: string; soft: string };
  accent: { on_brand: string; bright: string; on_paper: string };
  surface: { paper: string; card: string; line: string };
  ink: { body: string; muted: string };
  /** Family names. Not applied yet — see DEMO_THEME_NOTE. */
  type: { headings: string; body: string };
  shape: { radius: string };
};

export type NamedTheme = { key: string; label: string; theme: Theme | null };

/** MasjidOne's own, as the page already is. `null` means "change nothing". */
const OURS: NamedTheme = { key: "masjidone", label: "MasjidOne", theme: null };

export const DEMO_THEMES: NamedTheme[] = [
  OURS,
  {
    key: "plum",
    label: "Plum & gold",
    theme: {
      brand: { deep: "#3A1230", mid: "#4C1A3F", soft: "#60244F" },
      accent: { on_brand: "#D7B065", bright: "#E6C681", on_paper: "#7A5A1C" },
      surface: { paper: "#F6F1EA", card: "#FCF9F4", line: "#E3DACE" },
      ink: { body: "#241B21", muted: "#665A62" },
      type: { headings: "Fraunces", body: "Hanken Grotesk" },
      shape: { radius: "14px" },
    },
  },
  {
    key: "navy",
    label: "Navy & copper",
    theme: {
      brand: { deep: "#11223C", mid: "#1A3154", soft: "#24416C" },
      accent: { on_brand: "#D99460", bright: "#E8AE80", on_paper: "#8A4F22" },
      surface: { paper: "#F2F3F5", card: "#FAFBFC", line: "#D8DCE2" },
      ink: { body: "#141A22", muted: "#4C5765" },
      type: { headings: "Newsreader", body: "Archivo" },
      shape: { radius: "4px" },
    },
  },
  {
    key: "teal",
    label: "Teal & sand",
    theme: {
      brand: { deep: "#0C3238", mid: "#13454D", soft: "#1B5A64" },
      accent: { on_brand: "#D8B88A", bright: "#E8CFA9", on_paper: "#705228" },
      surface: { paper: "#F4F2EC", card: "#FBFAF6", line: "#DCD8CC" },
      ink: { body: "#10201F", muted: "#4A5A58" },
      type: { headings: "Newsreader", body: "Archivo" },
      shape: { radius: "10px" },
    },
  },
];

/**
 * Why the typefaces in each theme are carried but not applied.
 *
 * Colour is a token in this stylesheet; the two families are not — they are
 * written into 31 rules by name. Tokenising those without a second family
 * loaded would be churn, and loading a webfont per masjid on a public demo
 * means fetching type for a masjid the visitor is not. So the palettes repaint
 * and the lettering does not, and saying so is better than a committee
 * noticing.
 */
export const DEMO_THEME_NOTE =
  "Colour only. The typefaces and the device pictures are fixed here — a masjid's " +
  "real build carries its own lettering too.";

/**
 * A theme as CSS custom properties, overriding MasjidOne's own on a wrapper.
 *
 * The two accent mappings are the ones to get right, and they are crossed on
 * purpose: --board-brass sits ON the brand colour and takes `on_brand`, while
 * --brass is accent text on paper and must take `on_paper`. Swapping them
 * produces exactly the unreadable gold-on-card that Taiyabah's stylesheet
 * warns about.
 */
export function themeVars(t: Theme | null): React.CSSProperties {
  if (!t) return {};
  return {
    "--board": t.brand.deep,
    "--cta-bg": t.brand.deep,
    "--board-rule": t.brand.soft,
    "--board-ink": t.surface.paper,
    "--cta-fg": t.surface.paper,
    "--board-ink-2": t.accent.bright,
    "--board-brass": t.accent.on_brand,
    "--brass": t.accent.on_paper,
    "--brass-2": t.accent.on_brand,
    "--paper": t.surface.paper,
    "--paper-2": t.surface.line,
    "--ink": t.ink.body,
    "--ink-2": t.ink.muted,
    "--rule": t.surface.line,
    "--rule-2": t.ink.muted,
    "--beam": t.accent.on_brand,
    "--beam-rim": t.brand.soft,
    "--beam-sheen": t.brand.soft,
  } as React.CSSProperties;
}
