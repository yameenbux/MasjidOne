import { existsSync, readFileSync } from "node:fs";

/**
 * public/CNAME is the single source of truth for where this site is served.
 *
 * It used to be NEXT_PUBLIC_BASE_PATH, a repository variable typed into a web
 * form, and it silently broke production: the custom domain was configured in
 * GitHub Pages while the variable still said "/MasjidOne", so every stylesheet
 * and script was requested from masjidone.co.uk/MasjidOne/_next/... and 404ed.
 * The deploy was green. The page loaded. It just had no CSS, on the real
 * domain, for as long as nobody looked.
 *
 * A file in the repository cannot drift from the deployment the way a variable
 * in a settings page can — Pages reads the same CNAME to decide which domain to
 * answer on. So if it exists, it decides both values and the variables are
 * ignored, with a line in the build log saying so.
 */
function readCustomDomain() {
  const file = new URL("./public/CNAME", import.meta.url);
  if (!existsSync(file)) return null;
  const domain = readFileSync(file, "utf8").trim();
  return domain === "" ? null : domain;
}

/**
 * NEXT_PUBLIC_BASE_PATH is the most expensive value in this repo to get wrong.
 * A bad one either fails the build with a message that does not say what to do,
 * or — worse — succeeds with an empty basePath and 404s every asset, leaving a
 * page that loads but has no styling. It is a repository variable typed by
 * hand into a web form, so normalise what is unambiguously meant and reject
 * everything else with a message that names the problem.
 *
 * Legal values:
 *   ""            a custom domain, served from the root
 *   "/MasjidOne"  a GitHub project page at <user>.github.io/MasjidOne
 */
function resolveBasePath(raw) {
  const value = (raw ?? "").trim();
  if (value === "") return "";

  let path = value;
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, "");

  if (!/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(path)) {
    throw new Error(
      [
        "NEXT_PUBLIC_BASE_PATH is not a usable path.",
        `  Received: ${JSON.stringify(raw)}`,
        '  Expected: "/MasjidOne" for a GitHub project page,',
        "            or leave it unset for a custom domain.",
        "  Set the value only — the variable's name and the \"=\" sign",
        "  do not belong inside it.",
      ].join("\n"),
    );
  }

  if (path !== value) {
    console.log(
      `next.config: normalised NEXT_PUBLIC_BASE_PATH ${JSON.stringify(value)} -> ${JSON.stringify(path)}`,
    );
  }
  return path;
}

const customDomain = readCustomDomain();

/**
 * A custom domain serves the export from the root, so its base path is always
 * empty. Announce the override rather than applying it quietly — a stale
 * variable is exactly how this broke last time, and the log line is what tells
 * whoever is looking that the variable is now doing nothing.
 */
let basePath;
if (customDomain) {
  const stale = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  if (stale !== "" && stale !== "/") {
    console.log(
      `next.config: public/CNAME names ${customDomain}, so the site is served` +
        ` from the root. Ignoring NEXT_PUBLIC_BASE_PATH=${JSON.stringify(stale)}.`,
    );
  }
  basePath = "";
} else {
  basePath = resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
}

/**
 * The absolute origin, for canonical URLs, Open Graph tags, the sitemap and
 * robots.txt. Same reasoning: the CNAME knows the answer, so it decides.
 * Without one, fall back to the repository variable and then to the project
 * page, which is where an unconfigured build genuinely does land.
 */
const siteUrl = customDomain
  ? `https://${customDomain}`
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yameenbux.github.io").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export, so the site still deploys to GitHub Pages as plain files.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  /**
   * Both values are inlined into the client bundle, not just applied to the
   * router. lib/site.ts builds SITE_ORIGIN from them, and the hero and the
   * previews prefix their <img> and <video> sources by hand because next/image
   * is not in use — so if the bundle disagreed with `basePath` here, the pages
   * would style correctly and then 404 every device shot and the walkthrough.
   */
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  // PREVIEW_RELATIVE=1 emits relative asset paths, for serving the export
  // from an arbitrary sub-path. Not used by the Pages deploy.
  assetPrefix: process.env.PREVIEW_RELATIVE ? "." : undefined,
};
export default nextConfig;
