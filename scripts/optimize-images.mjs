#!/usr/bin/env node
/**
 * optimize-images.mjs — shrink the site's images for free, offline, no service.
 *
 * Why this exists
 * ---------------
 * `src/assets` ships ~49 MB of raster images. The worst offenders are phone
 * photos straight off a camera (one headshot is 4480 x 6720 = 30 megapixels,
 * 7.5 MB) being displayed in a card a few hundred pixels wide. Vite copies
 * whatever you import straight into `dist/`, so the browser downloads the
 * original. Resizing to the size it is actually displayed at, and re-encoding
 * to WebP, removes ~90-98% of those bytes.
 *
 * Usage
 * -----
 *   node scripts/optimize-images.mjs            # report only — writes nothing
 *   node scripts/optimize-images.mjs --write    # emit .webp + repoint imports
 *   node scripts/optimize-images.mjs --json     # machine-readable report
 *
 * `--write` is safe to undo: it only *adds* .webp files and edits import
 * specifiers, so `git checkout -- src` reverts everything.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'src', 'assets');
const SRC = path.join(ROOT, 'src');

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const JSON_OUT = argv.includes('--json');

const RASTER = new Set(['.png', '.jpg', '.jpeg']);
const WEBP_QUALITY = 80;

/**
 * How wide should each image actually be?
 *
 * Rules are matched in order, first hit wins. These are derived from how the
 * images are rendered in the components — headshots sit in small round cards,
 * full-bleed backgrounds span the viewport, everything else is a content image
 * in a grid that tops out around 1200 CSS px (and 2x DPR is not worth the
 * bytes for a marketing site).
 */
const WIDTH_RULES = [
  // Team headshots — rendered in small avatar cards.
  { test: (rel) => rel.startsWith('team' + path.sep) || /headshot/i.test(rel), width: 640 },
  // Full-bleed backgrounds and hero art — want the full viewport width.
  { test: (rel) => /bg|background|hero|banner|footer/i.test(rel), width: 1920 },
  // Everything else — content images in grids / offer cards.
  { test: () => true, width: 1200 },
];

/** Never upscale, and never emit a file bigger than the original. */
function targetWidth(relPath, intrinsicWidth) {
  const rule = WIDTH_RULES.find((r) => r.test(relPath));
  return Math.min(rule.width, intrinsicWidth);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function mb(bytes) {
  return bytes / 1048576;
}

/** `1.234 MB` / `56 KB` */
function human(bytes) {
  return bytes >= 1048576 ? `${mb(bytes).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  if (!fs.existsSync(ASSETS)) {
    console.error(`No assets directory at ${ASSETS}`);
    process.exit(1);
  }

  const files = walk(ASSETS).sort();
  const results = [];

  for (const file of files) {
    const rel = path.relative(ASSETS, file);
    const before = fs.statSync(file).size;
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      results.push({ rel, file, before, error: 'unreadable' });
      continue;
    }

    const width = targetWidth(rel, meta.width ?? 0);
    // `withoutEnlargement` keeps the aspect ratio and refuses to upscale.
    const pipeline = sharp(file, { failOn: 'none' })
      .rotate() // honour EXIF orientation, then drop the EXIF block
      .resize({ width, withoutEnlargement: true })
      .flatten({ background: '#ffffff' }) // PNG transparency -> white, so WebP is lossy-safe
      .webp({ quality: WEBP_QUALITY, effort: 6 });

    const out = await pipeline.toBuffer();
    const outPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const smaller = out.length < before;

    results.push({
      rel,
      file,
      outPath,
      before,
      after: out.length,
      width: meta.width,
      height: meta.height,
      targetWidth: width,
      saved: before - out.length,
      pct: before ? 1 - out.length / before : 0,
      smaller,
    });

    if (WRITE && smaller) {
      fs.writeFileSync(outPath, out);
    }
  }

  const ok = results.filter((r) => !r.error);
  const totalBefore = ok.reduce((s, r) => s + r.before, 0);
  const totalAfter = ok.reduce((s, r) => s + (r.smaller ? r.after : r.before), 0);

  if (WRITE) {
    const written = ok.filter((r) => r.smaller);
    const rewrites = repointImports(written);
    if (!JSON_OUT) {
      console.log(`\nWrote ${written.length} .webp files, repointed ${rewrites} import(s).`);
      console.log('Originals were left in place. Revert with: git checkout -- src');
    }
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({ results, totalBefore, totalAfter }, null, 2));
    return;
  }

  // ---- report ----
  const offenders = [...ok].sort((a, b) => b.before - a.before).slice(0, 20);
  console.log('\nLargest images — what they cost now vs. resized + WebP\n');
  console.log(
    '   before      after   saved        dimensions -> target   file',
  );
  console.log('  ' + '-'.repeat(78));
  for (const r of offenders) {
    console.log(
      `${human(r.before).padStart(9)} ${human(r.smaller ? r.after : r.before).padStart(9)} ` +
        `${(r.pct * 100).toFixed(0).padStart(5)}%  ` +
        `${r.width}x${r.height} -> ${r.targetWidth}px   ${r.rel}`,
    );
  }

  console.log('\n  ' + '-'.repeat(78));
  console.log(
    `  ${files.length} images: ${mb(totalBefore).toFixed(1)} MB -> ${mb(totalAfter).toFixed(1)} MB ` +
      `(${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}% smaller, ${mb(totalBefore - totalAfter).toFixed(1)} MB saved)`,
  );
  if (!WRITE) {
    console.log('\n  Report only — nothing was written. Run with --write to apply.\n');
  } else {
    console.log('\n  Done. Next: npm run build, then check the page weight in DevTools.\n');
  }
}

/**
 * Point every `import x from '.../photo.jpg'` at the generated `.webp`.
 *
 * Resolves each import specifier relative to the file it lives in, so it only
 * rewrites imports that actually resolve to an image we just optimised — a
 * string that merely *looks* like a path is left alone.
 */
function repointImports(written) {
  const map = new Map(written.map((r) => [path.resolve(r.file), r.outPath]));

  const sourceFiles = [];
  (function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(full);
    }
  })(SRC);

  let count = 0;
  for (const srcFile of sourceFiles) {
    const original = fs.readFileSync(srcFile, 'utf8');
    const updated = original.replace(
      /(from\s+['"])([^'"]+\.(?:png|jpe?g))(['"])/gi,
      (match, pre, spec, post) => {
        const resolved = path.resolve(path.dirname(srcFile), spec);
        const webp = map.get(resolved);
        if (!webp) return match;
        const relWebp = path
          .relative(path.dirname(srcFile), webp)
          .split(path.sep)
          .join('/');
        const nextSpec = spec.startsWith('.') ? relWebp : spec.replace(/\.(png|jpe?g)$/i, '.webp');
        count += 1;
        return `${pre}${nextSpec}${post}`;
      },
    );
    if (updated !== original) fs.writeFileSync(srcFile, updated);
  }
  return count;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
