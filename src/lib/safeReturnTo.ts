/**
 * Sanitise a `returnTo` query parameter before handing it to `navigate()`.
 *
 * The naive guard `value.startsWith('/')` is not enough: browsers normalise a
 * backslash to a forward slash, so `/\evil.com` becomes `//evil.com`, which is
 * protocol-relative and sends the visitor to another origin. React Router's own
 * fix for this (CVE-2025-68470, patched in 7.18.4) is a major upgrade for us,
 * so we close it here — every redirect we perform goes through this function.
 *
 * Only a single-leading-slash path is allowed. Anything with a scheme, a
 * protocol-relative prefix, a backslash or a control character falls back.
 */
export function safeReturnTo(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;

  // Trim before testing so " /x" and "/x\n" cannot slip past.
  const path = value.trim();

  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//')) return fallback;
  // "\" is normalised to "/" by the URL parser — "/\evil.com" => "//evil.com".
  if (path.includes('\\')) return fallback;
  // Control characters, including tab/newline, are stripped by the parser and
  // can be used to smuggle a scheme past a naive check.
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;
  // A scheme can only appear after the first character, so test the remainder.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path.slice(1))) return fallback;

  return path;
}
