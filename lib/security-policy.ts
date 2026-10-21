import { FORM_ENDPOINT, INTEREST_ENDPOINT } from "@/lib/site";
import { PLATFORM_URL, MASJID_PORTALS, MASJID_SCREENS } from "@/lib/platform";

/**
 * The Content Security Policy, built from the same constants the code uses.
 *
 * WHY THIS IS A <meta> TAG AND NOT A HEADER, which is the first thing to
 * understand before changing it. The site is `output: 'export'` on GitHub
 * Pages, and **Pages cannot set response headers**. So there is no way to send
 * a real `Content-Security-Policy:` header from here, and the two headers that
 * only work as headers — `Strict-Transport-Security` and `X-Frame-Options` —
 * cannot be sent at all. A meta CSP carries most directives faithfully; the
 * exception that matters is `frame-ancestors`, which browsers **ignore** in
 * meta form. Clickjacking therefore cannot be mitigated on this host. Moving
 * /admin/ to somewhere that can set headers is the only fix for that, and it is
 * recorded as the open item it is rather than papered over with a directive
 * that does nothing.
 *
 * WHAT THIS POLICY HONESTLY DOES AND DOES NOT DO. `script-src` carries
 * `'unsafe-inline'`, and it has to: Next emits inline bootstrap and hydration
 * scripts, and the alternative — a nonce — needs a server to mint one per
 * request, which a static export does not have. Hashes would change on every
 * build. So **this policy does not stop injected inline script from running.**
 * Do not describe it as XSS protection. What it genuinely stops is narrower
 * and still worth having:
 *
 *   - loading script from an origin that is not ours (`script-src 'self'`)
 *   - `<base href>` hijacking, which silently repoints every relative URL
 *   - sending a form somewhere we did not nominate (`form-action`)
 *   - `<object>`/`<embed>` plugin content (`object-src 'none'`)
 *   - connecting to an origin we did not nominate (`connect-src`)
 *
 * DERIVED, NEVER TYPED. Every origin below comes from the constant the running
 * code already uses, so the policy cannot drift from the thing it is allowing.
 * That is the same reasoning as next.config.mjs reading public/CNAME: a value
 * in two places is a value that will disagree with itself eventually. Add a
 * masjid to MASJID_SCREENS and the frame-src follows on the next build.
 *
 * THE ONE WAY THIS BREAKS THE SITE, so it is checked for explicitly. The demo
 * and Martyn's Law forms carry a real `action` and `method="POST"` so that they
 * work with JavaScript disabled — see the comment at the top of
 * components/demo-request-form.tsx. A bare `form-action 'self'` would block
 * that fallback, and the failure would be invisible to anyone testing with
 * JavaScript on. `mailto:` is listed for the same reason: with no Worker
 * deployed the action *is* a mailto, and a committee with JavaScript off is
 * precisely the visitor this site is built for.
 */

/** The origin of a URL, or null when it is empty or not parseable. */
function originOf(url: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function origins(...urls: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  for (const url of urls) {
    const origin = originOf(url ?? "");
    if (origin) seen.add(origin);
  }
  return [...seen];
}

/**
 * Where a form may be sent, and where the browser may fetch.
 *
 * The billing endpoint is read straight from the environment rather than from a
 * constant because components/admin-direct-debit.tsx reads it the same way and
 * nothing else needs it.
 */
const FORM_ORIGINS = origins(
  FORM_ENDPOINT,
  INTEREST_ENDPOINT,
  process.env.NEXT_PUBLIC_FORM_ENDPOINT,
);

const API_ORIGINS = origins(
  PLATFORM_URL,
  process.env.NEXT_PUBLIC_BILLING_ENDPOINT,
);

/** The masjid sites the support console frames and links out to. */
const MASJID_ORIGINS = origins(
  ...Object.values(MASJID_SCREENS),
  ...Object.values(MASJID_PORTALS),
);

const FONTS_CSS = "https://fonts.googleapis.com";
const FONTS_FILES = "https://fonts.gstatic.com";

const DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],

  /* 'unsafe-inline' is unavoidable on a static export — see the note above.
     Keeping 'self' alongside it still refuses script from anywhere else. */
  "script-src": ["'self'", "'unsafe-inline'"],

  /* Tailwind compiles to a file, but framer-motion sets styles on elements at
     runtime, and Next inlines critical CSS. Both need 'unsafe-inline'. */
  "style-src": ["'self'", "'unsafe-inline'", FONTS_CSS],
  "style-src-elem": ["'self'", "'unsafe-inline'", FONTS_CSS],
  "font-src": ["'self'", FONTS_FILES, "data:"],

  /* data: for the inline SVG previews and the TOTP enrolment QR code, which
     supabase-js returns as a data URI. The platform origin serves the `brand`
     bucket's images to the support console. */
  "img-src": ["'self'", "data:", "blob:", ...API_ORIGINS],

  "connect-src": ["'self'", ...API_ORIGINS, ...FORM_ORIGINS],

  /* The support console frames each masjid's own front page. Empty on a build
     with no masjid configured, which correctly forbids framing anything. */
  "frame-src": ["'self'", ...MASJID_ORIGINS],

  "media-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],

  "object-src": ["'none'"],
  "base-uri": ["'self'"],

  /* 'self', the Worker, and mailto: — all three are real submission targets.
     See the note above before removing any of them. */
  "form-action": ["'self'", "mailto:", ...FORM_ORIGINS],
};

/**
 * The policy as a single attribute value.
 *
 * `upgrade-insecure-requests` is appended as a bare directive: it takes no
 * value, and giving it one makes the whole policy invalid in some browsers.
 */
export const CONTENT_SECURITY_POLICY = [
  ...Object.entries(DIRECTIVES).map(
    ([name, values]) => `${name} ${values.join(" ")}`,
  ),
  "upgrade-insecure-requests",
].join("; ");
