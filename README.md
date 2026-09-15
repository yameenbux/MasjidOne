# MasjidOne
Marketing site for MasjidOne — one platform running both the madrasah and the congregation for UK mosques. Static single-file build, deployed via GitHub Pages.

# MasjidOne — Website

Marketing site for MasjidOne, a platform that runs a mosque's madrasah
and its congregation on one system: registers, fees and parent access
alongside prayer times, a congregation app, website, hall screens and
donations.

A product of YSB Ventures Ltd, Bolton.

## Structure

Single self-contained `index.html`. No build step, no dependencies,
no framework. All CSS is inline; the only external requests are
Google Fonts (Newsreader and Archivo).

## Deploying

Settings → Pages → deploy from branch `main`, folder `/ (root)`.

For a custom domain, add a `CNAME` file at the root containing the
domain, and point a CNAME DNS record at `<username>.github.io`.

## Editing

- Pricing lives in the `#pricing` section
- Contact details are in the `#contact` section and the mailto links
- Interface previews are inline SVG, to be replaced with live
  screenshots before public launch

## Licence

All rights reserved. Not open source.
