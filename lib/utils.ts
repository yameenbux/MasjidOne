import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serialise a value for a <script type="application/ld+json"> block.
 *
 * JSON.stringify DOES NOT MAKE A STRING SAFE FOR AN HTML SCRIPT ELEMENT, which
 * is the belief this function exists to retire — a comment in
 * components/structured-data.tsx used to say it did. JSON escapes quotes and
 * backslashes; it leaves `<` and `/` exactly as they are. So a value containing
 * the seven characters `</script>` closes the element early and everything
 * after it is parsed as markup, not as data.
 *
 * Every value fed to this today is one of our own constants, so nothing is
 * injectable right now. That is precisely why it is worth fixing now: structured
 * data is the kind of thing that gets wired to real content later — a masjid's
 * name, a notice title, a course description — and on the day it is, the hole
 * opens silently in a file nobody is looking at.
 *
 * Escaping the forward slash as \/ is valid JSON and parses back to the same
 * string, so `</script>` becomes `<\/script>` and never terminates the element.
 * U+2028 and U+2029 are legal in JSON but are line terminators in JavaScript,
 * so they are escaped too.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/\//g, "\\/")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
