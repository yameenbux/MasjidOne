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

const basePath = resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export, so the site still deploys to GitHub Pages as plain files.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  // PREVIEW_RELATIVE=1 emits relative asset paths, for serving the export
  // from an arbitrary sub-path. Not used by the Pages deploy.
  assetPrefix: process.env.PREVIEW_RELATIVE ? "." : undefined,
};
export default nextConfig;
