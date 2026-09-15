/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export, so the site still deploys to GitHub Pages as plain files.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Empty for a custom domain; "/MasjidOne" for a project page.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // PREVIEW_RELATIVE=1 emits relative asset paths, for serving the export
  // from an arbitrary sub-path. Not used by the Pages deploy.
  assetPrefix: process.env.PREVIEW_RELATIVE ? '.' : undefined,
};
export default nextConfig;
