/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FIGMA PAGES — IMAGE REGISTRY  (this is the ONLY file you need to edit)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every picture / background on the Figma pages is referenced through a slot
 *  name below. While a slot is an empty string you will see a placeholder box
 *  with the SLOT NAME and the recommended size written on it — that is exactly
 *  where the image belongs.
 *
 *  HOW TO ADD AN IMAGE
 *  -------------------
 *  Option A — put the file in `src/assets/` and import it at the top:
 *
 *      import heroBg from '../../assets/home-hero-bg.jpg';
 *      export const FIGMA_IMAGES = { 'home-hero-bg': heroBg, ... }
 *
 *  Option B — host it somewhere and paste the URL:
 *
 *      'home-hero-bg': 'https://example.com/hero.jpg',
 *
 *  That's it. Nothing else in the code needs to change — the placeholder is
 *  replaced automatically as soon as the slot has a value.
 *
 *  TIP: keep the recommended aspect ratio so the layout stays identical to the
 *  Figma design. Anything roughly close is fine because every slot uses
 *  `object-cover`, so the image is cropped rather than stretched.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Shared chrome ──────────────────────────────────────────────────────────
import navLogo from '../../assets/nav-logo.png';

// ── Home ───────────────────────────────────────────────────────────────────
import homeEcoCocotech from '../../assets/home-eco-cocotech.jpeg';
import homeEcoCococycle from '../../assets/home-eco-cococycle.png';
import homeEcoCocodrinkeat from '../../assets/home-eco-cocodrinkeat.png';
import homeMarketCocopeat from '../../assets/home-market-cocopeat.png';
import homeMarketFibre from '../../assets/home-market-fibre.png';
import homeMarketOil from '../../assets/home-market-oil.png';
import homeMarketShell from '../../assets/home-market-shell.png';
import homeCocotechImg from '../../assets/home-cocotech-img.jpeg';
import homeCococycleImg from '../../assets/home-cococycle-img.png';
import homeCocodrinkeatImg from '../../assets/home-cocodrinkeat-img.png';

// ── Desktop 8 · Our Processing Equipment ───────────────────────────────────
import equip1 from '../../assets/equip-1.jpeg';
import equip2 from '../../assets/equip-2.png';
import equip3 from '../../assets/equip-3.png';
import equip4 from '../../assets/equip-4.png';
import equipProductionBg from '../../assets/equip-production-bg.png';

// ── Desktop 11 · CocoCycle Hub ─────────────────────────────────────────────
import cocycleHero from '../../assets/cocycle-hero.png';
import cocycleP1 from '../../assets/cocycle-p1.png';
import cocycleP2 from '../../assets/cocycle-p2.png';
import cocycleP3 from '../../assets/cocycle-p3.png';
import cocycleP4 from '../../assets/cocycle-p4.png';
import cocycleOffer1 from '../../assets/cocycle-offer-1.png';
import cocycleOffer2 from '../../assets/cocycle-offer-2.png';
import cocycleOffer3 from '../../assets/cocycle-offer-3.png';

// ── Certificates (used by Desktop 8 and Desktop 11) ────────────────────────
import cert1 from '../../assets/cert-1-photo.jpg';
import cert2 from '../../assets/cert-2-photo.jpg';
import cert3 from '../../assets/cert-3-photo.jpg';
import certificateBg from '../../assets/CERTIFICATEBG.png';

// ── Desktop 20 · Login ─────────────────────────────────────────────────────
import loginPanel from '../../assets/login-panel.png';

// ── S 19 · Sign up ─────────────────────────────────────────────────────────
import signupPanel from '../../assets/signup-panel.png';

// ── Desktop 43 · Contact us ────────────────────────────────────────────────
import contactBg from '../../assets/contact-bg.png';
import contactCoconutIcon from '../../assets/contact-coconut-icon.png';

export const FIGMA_IMAGES: Record<string, string> = {
  // ── Shared chrome ────────────────────────────────────────────────────────
  'nav-logo': navLogo, //  188 × 30   – Coconoto wordmark on the navbar

  //  ⚠️ NOT SUPPLIED, and not used. The live pages render the *real* site footer
  //  (`components/about/AboutFooter.tsx`), which pulls in its own `Logo_1.png` /
  //  `fotterimage.png`. These two slots only matter if the Figma footer is ever
  //  restored — drop in `footer-logo.png` / `footer-bg.png` if that happens.
  'footer-logo': '', //  154 × 25   – green Coconoto mark
  'footer-bg': '', // 1440 × 505  – soil photo behind the footer

  // ── Home ─────────────────────────────────────────────────────────────────
  //  ⚠️ NOT SUPPLIED. The Figma hero's decorative artwork. The live home page
  //  uses the site's own `Hero` (Threads background + coconut photos), so these
  //  three are only ever rendered by `/figma/home`.
  'home-hero-lines': '', // 1440 × 318  – thin flowing line artwork behind hero
  'home-hero-coconut-left': '', //  300 × 300  – coconut illustration, left edge
  'home-hero-coconut-right': '', //  300 × 300  – coconut illustration, right edge

  'home-eco-cocotech': homeEcoCocotech, //  231 × 154  – machine photo, card 1
  'home-eco-cococycle': homeEcoCococycle, //  371 × 248  – cocopeat photo, card 2
  'home-eco-cocodrinkeat': homeEcoCocodrinkeat, //  289 × 193  – drink photo, card 3
  'home-market-cocopeat': homeMarketCocopeat, //  155 × 169  – Cocopeat product shot
  'home-market-fibre': homeMarketFibre, //  155 × 169  – Coconut Fibre product shot
  'home-market-oil': homeMarketOil, //  155 × 169  – Coconut Oil product shot
  'home-market-shell': homeMarketShell, //  155 × 169  – Coconut Shell Charcoal
  'home-cocotech-img': homeCocotechImg, //  628 × 449  – machine close-up
  'home-cococycle-img': homeCococycleImg, //  628 × 449  – waste-to-value flat lay
  'home-cocodrinkeat-img': homeCocodrinkeatImg, //  628 × 449  – event setup photo

  // ── Desktop 8 · Our Processing Equipment ─────────────────────────────────
  'equip-1': equip1, //  634 × 651  – Coconut Desheller machine
  'equip-2': equip2, //  634 × 610  – Coconut Dehusker machine
  'equip-3': equip3, //  634 × 651  – Coconut Milk Extractor (Auto)
  'equip-4': equip4, //  634 × 610  – Coconut Milk Extractor (Manual)
  'equip-production-bg': equipProductionBg, // 1530 × 486  – hands holding soil

  // ── Desktop 11 · CocoCycle Hub ───────────────────────────────────────────
  'cocycle-hero': cocycleHero, // 1440 × 684  – coconut drink hero background
  'cocycle-p1': cocycleP1, //  634 × 608  – Cocopeat
  'cocycle-p2': cocycleP2, //  634 × 608  – Fiber
  'cocycle-p3': cocycleP3, //  634 × 608  – Cocopot
  'cocycle-p4': cocycleP4, //  634 × 608  – Biochar
  'cocycle-offer-1': cocycleOffer1, //  199 × 162  – Coconut meat
  'cocycle-offer-2': cocycleOffer2, //  199 × 162  – Coconut Drink
  'cocycle-offer-3': cocycleOffer3, //  199 × 162  – Customized serving

  // ── Certificates (used by Desktop 8 and Desktop 11) ──────────────────────
  'cert-1-photo': cert1, //  portrait A4  – Deshelling patent scan
  'cert-2-photo': cert2, //  portrait A4  – Dehusking patent scan
  'cert-3-photo': cert3, //  portrait A4  – business-name registration
  //  Photo the certificate scans are laid on top of. Fills the whole box
  //  edge-to-edge (`object-cover`), so there is no bare strip below it.
  'cert-backdrop': certificateBg,

  // ── Desktop 20 · Login ───────────────────────────────────────────────────
  //  The artwork already contains the "Good People. Greater Tomorrows." panel,
  //  so the page hides its HTML stand-in copy once this slot is filled.
  'login-panel': loginPanel, //  612 × 899  – palm + coconuts photo

  // ── S 19 · Sign up ───────────────────────────────────────────────────────
  //  NOTE: in Figma this is ONE image — "A Greener Brighter Future.", the green
  //  rule and the paragraph are painted into the artwork, not text layers. Now
  //  that the photo is here, the HTML stand-in copy disappears on its own. Best
  //  source ratio is 1145 × 1374 (it is cropped from the left, `object-left`).
  'signup-panel': signupPanel, //  612 × 899  – hands holding a coconut

  // ── Desktop 43 · Contact us ──────────────────────────────────────────────
  'contact-bg': contactBg, // 1440 × 916  – palm frond background
  'contact-coconut-icon': contactCoconutIcon, //  128 × 128  – coconut illustration

  // ── Frame 624908 · Decorative banner ─────────────────────────────────────
  //  ⚠️ NOT SUPPLIED. The flat-lay artwork behind "Everything Coconut."
  'banner-image': '', // 1460 × 543
};

/** Returns the URL for a slot, or `undefined` when it is still a placeholder. */
export const img = (slot: string): string | undefined =>
  FIGMA_IMAGES[slot] ? FIGMA_IMAGES[slot] : undefined;
