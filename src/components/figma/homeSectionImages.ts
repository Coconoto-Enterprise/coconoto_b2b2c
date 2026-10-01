/**
 * Images for the Figma "Home" sections, for the live home page.
 *
 * These sections were first built on `/figma/home` with grey placeholder slots.
 * The owner has since dropped real photos into `src/assets`, named after the
 * slot keys, and asked for them to be wired up **on `/` only** — the Figma
 * pages are a temporary test harness and will be scrapped, so they keep their
 * placeholders.
 *
 * The pillar slideshows follow the pattern the old home page already used: a
 * 4s `setInterval` cross-fading stacked images. The new `home-*-img` photo is
 * appended to the existing photo set for its section rather than replacing it.
 */

// ── Coco-Tech ──────────────────────────────────────────────────────────────
import IMG_0036 from '../../assets/IMG_0036.jpg';
import IMG_0024 from '../../assets/IMG_0024.jpg';
import IMG_0023 from '../../assets/IMG_0023.jpg';
import IMG_20250311_180248 from '../../assets/IMG_20250311_180248.jpg';
import dehusking from '../../assets/dehusking.jpg';
import dehusking2 from '../../assets/dehusking2.jpg';
import IMG_0369 from '../../assets/IMG_0369.jpg';
import homeCocotechImg from '../../assets/home-cocotech-img.jpeg';

// ── Cococycle Hub ──────────────────────────────────────────────────────────
import cocoplant from '../../assets/cocoplant.jpg';
import cocofiber from '../../assets/cocofiber.png';
import cocopeat from '../../assets/cocopeat.jpg';
import fiber2 from '../../assets/fiber2.jpg';
import cocpeat1 from '../../assets/cocpeat1.jpeg';
import fiber from '../../assets/fiber.jpeg';
import cocopot from '../../assets/cocopot.jpg';
import cocopot4 from '../../assets/cocopot4.jpg';
import cocofiber3 from '../../assets/cocofiber3.jpg';
import cocopot2 from '../../assets/cocopot2.jpg';
import homeCococycleImg from '../../assets/home-cococycle-img.png';

// ── Coco DrinkEat ──────────────────────────────────────────────────────────
import IMG_20250718_104052 from '../../assets/IMG_20250718_104052.jpg';
import coccdrinkit from '../../assets/coccdrinkit.jpg';
import homeCocodrinkeatImg from '../../assets/home-cocodrinkeat-img.png';

// ── Ecosystem card thumbnails ──────────────────────────────────────────────
import homeEcoCocotech from '../../assets/home-eco-cocotech.jpeg';
import homeEcoCococycle from '../../assets/home-eco-cococycle.png';
import homeEcoCocodrinkeat from '../../assets/home-eco-cocodrinkeat.png';
import cocoTechIcon from '../../assets/cococtechicon.svg';
import cocoCycleIcon from '../../assets/coccyclehubicon.svg';
import cocoDrinkEatIcon from '../../assets/cocdrinkeathomeicon.svg';

/**
 * The navbar wordmark, for the Figma navbar when it is used on the live home
 * page. 760 × 121, i.e. the same 6.28:1 ratio as the design's 188 × 30 slot.
 */
export { default as navLogo } from '../../assets/nav-logo.png';

/**
 * Owner-supplied glyphs for two of the three Coco-Tech feature bullets,
 * replacing the lucide `Cog` / `Wrench` stand-ins.
 *
 * Both are small PNGs (17 × 17 and 18 × 18) with `#1AC212` — the current brand
 * green — baked into the pixels, and their ink is cropped flush to the canvas
 * edge. That matters for sizing: a lucide glyph at a 20px box has ~20px of ink,
 * so drawing these at the same 20px box matches without any padding fudge.
 *
 * "Built to last" has no artwork yet and still renders its lucide `HardDrive`.
 * Re-exported from here so `FigmaHomeSections` keeps importing every home-section
 * image from one place, like `navLogo` above.
 */
export { default as efficientMachineIcon } from '../../assets/efficentimachineicon.png';
export { default as lowMaintenanceIcon } from '../../assets/lowmentainace icon.png';

/**
 * Pillar slideshows — the old home page's photo set for that section, with the
 * new `home-*-img` photo added at the end.
 *
 * The old Coco DrinkEat array listed two photos twice, which made the fade
 * visibly stutter on a repeat; de-duplicated here.
 */
export const PILLAR_SLIDESHOWS: Record<string, string[]> = {
  'home-cocotech-img': [
    IMG_0036,
    IMG_0024,
    IMG_0023,
    IMG_20250311_180248,
    dehusking,
    dehusking2,
    IMG_0369,
    homeCocotechImg,
  ],
  'home-cococycle-img': [
    cocoplant,
    cocofiber,
    cocopeat,
    fiber2,
    cocpeat1,
    fiber,
    cocopot,
    cocopot4,
    cocofiber3,
    cocopot2,
    homeCococycleImg,
  ],
  'home-cocodrinkeat-img': [
    IMG_20250718_104052,
    coccdrinkit,
    IMG_0036,
    IMG_0024,
    homeCocodrinkeatImg,
  ],
};

/**
 * Single images for the ecosystem cards.
 *
 * All three exist now — `home-eco-cocotech` landed as a `.jpeg`.
 */
export const ECOSYSTEM_IMAGES: Record<string, string> = {
  'home-eco-cocotech': homeEcoCocotech,
  'home-eco-cococycle': homeEcoCococycle,
  'home-eco-cocodrinkeat': homeEcoCocodrinkeat,
};

/**
 * The three ecosystem card glyphs, keyed by the same slot ids as above.
 *
 * These replace the lucide stand-ins the cards shipped with (`Blocks`,
 * `Recycle`, `CupSoda`). Supplied as **SVG** (24 × 24 viewBox, brown `#522212`
 * baked into `stroke`/`fill`), so they stay crisp at any size and no `text-*`
 * colour needs to be applied. Rendered via `<img>` inside the 60px white
 * circle — Vite inlines them as data URIs, so there is no extra request.
 *
 * Unlike the photos, these are design chrome rather than content: they are
 * rendered on `/` **and** `/figma/home` so both match the Figma frame.
 */
export const ECOSYSTEM_ICONS: Record<string, string> = {
  'home-eco-cocotech': cocoTechIcon,
  'home-eco-cococycle': cocoCycleIcon,
  'home-eco-cocodrinkeat': cocoDrinkEatIcon,
};
