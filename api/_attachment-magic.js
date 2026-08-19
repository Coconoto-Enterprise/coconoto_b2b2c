// Magic-byte MIME detector for attachment uploads.
//
// We don't trust the upload's claimed `Content-Type` header to make policy
// decisions — a polyglot SVG/HTML file could be served as `image/svg+xml`
// from the user's point of view while still executing JS in the browser. We
// inspect the first several bytes of the buffer and return a conservative
// match. If nothing matches, returns `null` so the caller can reject the
// upload outright.

const MAGIC = [
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { mime: 'image/webp', bytes: null, offset: 8, matcher: (b) => b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP' },
];

const isPlainText = (buf) => {
  // Heuristic: no NUL bytes, mostly printable ASCII / common Unicode bytes.
  if (!buf || buf.length === 0) return false;
  let printable = 0;
  const sample = Math.min(buf.length, 2048);
  for (let i = 0; i < sample; i++) {
    const b = buf[i];
    if (b === 0) return false;
    if (b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x20 && b < 0x7f)) {
      printable++;
    } else if (b >= 0xc0) {
      // Likely UTF-8 continuation — give it credit but don't make it binding.
      printable++;
    }
  }
  return printable / sample > 0.95;
};

export const detectMimeFromBuffer = (buf) => {
  if (!buf || buf.length === 0) return null;

  for (const entry of MAGIC) {
    if (typeof entry.matcher === 'function') {
      if (entry.matcher(buf)) return entry.mime;
      continue;
    }
    if (!entry.bytes) continue;
    if (buf.length < entry.bytes.length) continue;
    let ok = true;
    for (let i = 0; i < entry.bytes.length; i++) {
      if (buf[i] !== entry.bytes[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return entry.mime;
  }

  if (isPlainText(buf)) return 'text/plain';

  return null;
};
