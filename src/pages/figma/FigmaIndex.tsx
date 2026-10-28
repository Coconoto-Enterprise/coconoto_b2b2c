import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import { FIGMA_IMAGES } from './images';

interface FrameEntry {
  frame: string;
  /** Figma node id, where the frame has one. */
  nodeId?: string;
  size?: string;
  title: string;
  blurb: string;
  to: string;
  /** Marks the frames built in this round so they are easy to find. */
  isNew?: boolean;
}

/**
 * Every frame, newest first.
 *
 * The `to` values are the **canonical** routes, not the old `/figma/*` aliases —
 * those still redirect here, so a bookmarked preview URL keeps working, but a
 * link on this page should point at the URL the page actually lives on.
 */
const FRAMES: FrameEntry[] = [
  {
    frame: 'Desktop 41 · Frame 110',
    title: 'Coco-connect — browse the marketplace',
    blurb:
      'Frame 110 is the hero: full-bleed market photo, “Welcome to Coco-connect”, and the search field. Below it, Desktop 41 runs a category rail with counts against a three-up product grid — muted unit price, name, price and the green add-to-cart check. Black nav with cart, Buy pill and avatar.',
    to: '/shop',
    isNew: true,
  },
  {
    frame: 'Desktop 49',
    title: 'Coco-connect — product detail',
    blurb:
      'Breadcrumb, gallery with three thumbnails, Add to cart / Buy now, rating and description, and the sticky Order Details panel that recalculates as the quantity steps. Customer Reviews and Similar Products sit underneath.',
    to: '/shop/product/broccoli-for-your-stew',
    isNew: true,
  },
  {
    frame: 'Desktop · checkout',
    title: 'Checkout — delivery details',
    blurb:
      'Delivery Details and Shipping Address on the left with the shipping and payment radios; Order Summary on the right, priced live from the cart and the chosen shipping method.',
    to: '/shop/checkout',
    isNew: true,
  },
  {
    frame: 'Desktop · confirmation',
    title: 'Order Confirmed',
    blurb:
      'The green tick, the order summary of what was actually bought, and the confirmation / shipping address cards. Reachable only after a real checkout — it reads the order you just placed.',
    to: '/shop/order-confirmed',
    isNew: true,
  },
  {
    frame: 'Desktop 42',
    nodeId: '142:729',
    size: '1440 × 5046',
    title: 'Home — Welcome to Coconoto',
    blurb:
      'Hero with coconut artwork, the three-pillar ecosystem, Coco-Connect marketplace with popular products, Coco-Tech / Cococycle Hub / Coco DrinkEat blocks, Why Choose Coconoto and the brown CTA band.',
    to: '/',
  },
  {
    frame: 'Desktop 8',
    nodeId: '53:477',
    size: '1440 × 5650',
    title: 'Our Processing Equipment',
    blurb:
      'Numbered 01–04 machine catalogue (Desheller, Dehusker, Milk Extractor Auto & Manual) — each order control now opens its own quote form — plus Production Management and Our Certifications.',
    to: '/cocotech',
  },
  {
    frame: 'Desktop 11',
    nodeId: '92:1744',
    size: '1440 × 6179',
    title: 'CocoCycle Hub',
    blurb:
      'Full-bleed hero, Eco-Friendly Coconut Products 01–04 (Cocopeat, Fiber, Cocopot, Biochar) with the product cart and checkout wired in, the Coco DrinkEat event cards and Our Certifications.',
    to: '/cococycle-hub',
  },
  {
    frame: 'Desktop 20',
    nodeId: '164:8',
    size: '1440 × 919',
    title: 'Login — Welcome Back',
    blurb:
      'Split screen: “Good People. Greater Tomorrows.” photo panel beside the email / password form with Google and Apple sign-in.',
    to: '/buyer-login',
  },
  {
    frame: 'S 19',
    nodeId: '164:3060',
    size: '1440 × 919',
    title: 'Sign up — Create Your Account',
    blurb:
      'The pair to the login page: “A Greener Brighter Future.” photo panel beside full name, email, password and confirm password, with Google and Apple sign-in.',
    to: '/buyer-signup',
  },
  {
    frame: 'Desktop 43',
    nodeId: '234:39',
    size: '1440 × 1691',
    title: 'Contact us',
    blurb:
      'Palm background with a single white card: contact information on the left, the enquiry form on the right, writing to Supabase and sending both emails.',
    to: '/contact',
  },
  {
    frame: 'Marketplace',
    title: 'Coco-connect — live vendor marketplace',
    blurb:
      'The Supabase-backed marketplace that predates the Figma frames: vendor products, buyer accounts and guest ordering. Still live at its own route while the Desktop 41 build sits on /shop.',
    to: '/cococonnect',
  },
  {
    frame: 'Frame 624908',
    nodeId: '141:701',
    size: '1460 × 543',
    title: 'Decorative banner strip',
    blurb:
      'The wide flat-lay artwork frame, presented full-bleed. Also exported as a reusable <BannerStrip /> component.',
    to: '/figma/banner',
  },
];

/** Screenshots of the frames built in this round, captured from the live pages. */
const PREVIEWS = [
  {
    src: '/figma-previews/shop-browse.jpg',
    frame: 'Frame 110',
    caption: 'The hero — market photo, headline and search, under the black nav.',
    to: '/shop',
  },
  {
    src: '/figma-previews/shop-grid.jpg',
    frame: 'Desktop 41',
    caption: 'Category rail with counts, “Results for cash crops”, and the product grid.',
    to: '/shop',
  },
  {
    src: '/figma-previews/shop-product.jpg',
    frame: 'Desktop 49',
    caption: 'Product detail with the Order Details panel priced live from the quantity.',
    to: '/shop/product/broccoli-for-your-stew',
  },
  {
    src: '/figma-previews/shop-checkout.jpg',
    frame: 'Desktop · checkout',
    caption: 'Delivery details and payment method beside the order summary.',
    to: '/shop/checkout',
  },
  {
    src: '/figma-previews/shop-confirmed.jpg',
    frame: 'Desktop · confirmation',
    caption: 'Order Confirmed — the summary of what was actually ordered.',
    to: '/shop/order-confirmed',
  },
  {
    src: '/figma-previews/shop-mobile.jpg',
    frame: 'Desktop 41 · 390px',
    caption: 'The same page on a phone: the rail stacks above the grid, the nav collapses.',
    to: '/shop',
  },
];

/** A short summary of the image slots so it is obvious what still needs art. */
function PendingImages() {
  const slots = Object.entries(FIGMA_IMAGES);
  const pending = slots.filter(([, url]) => !url);

  return (
    <div className="rounded-[10px] bg-[#F9F8F8] p-8">
      <h2 className="font-montserrat text-[18px] font-bold text-black">Adding your images</h2>
      <p className="mt-3 max-w-[720px] font-lora text-[15px] leading-[1.7] text-black">
        Every picture and background is a named slot in a single file —{' '}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[13px] text-[#17AD10]">
          src/pages/figma/images.ts
        </code>
        . Fill in a slot with a URL or an imported asset and the grey placeholder is replaced
        automatically. Nothing else needs to change.
      </p>
      <p className="mt-5 font-lora text-[15px] text-black">
        <strong className="font-semibold">{pending.length}</strong> of {slots.length} slots are
        still waiting for artwork.
      </p>

      <div className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {pending.map(([slot]) => (
          <code key={slot} className="font-mono text-[12px] text-[#5A3015]">
            {slot}
          </code>
        ))}
      </div>
    </div>
  );
}

/**
 * Index of every frame built from the Coconoto Figma file — one link per page,
 * with screenshots of the newest set underneath.
 */
export default function FigmaIndex() {
  return (
    <div className="min-h-screen bg-white">
      <FigmaNav active="Home" />

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-[70px] sm:px-8">
          <p className="font-montserrat text-[16px] font-semibold uppercase tracking-[0.06em] text-[#5A3015]">
            Coconoto Figma build
          </p>
          <h1 className="mt-4 font-montserrat text-[32px] font-bold leading-tight text-black sm:text-[44px]">
            The frames, and where they live now
          </h1>
          <p className="mt-5 max-w-[700px] font-lora text-[16px] leading-[1.75] text-[#101010]">
            These frames are no longer a preview harness — each one is served at its real URL, and
            the links below point at the live route. The old <code className="font-mono text-[15px]">/figma/*</code>{' '}
            addresses redirect here, so nothing that was bookmarked breaks.
          </p>
          <p className="mt-4 max-w-[700px] font-lora text-[16px] leading-[1.75] text-[#101010]">
            The four Coco-connect frames are new this round. Every image on them is a labelled
            placeholder — see the slot list at the bottom for exactly what still needs artwork.
          </p>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {FRAMES.map((f) => (
              <Link
                key={`${f.frame}-${f.to}`}
                to={f.to}
                className={`group flex flex-col rounded-[10px] border bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#17AD10] hover:shadow-lg ${
                  f.isNew ? 'border-[#1AC212]/40' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-montserrat text-[13px] font-semibold uppercase tracking-[0.1em] text-[#17AD10]">
                      {f.frame}
                      {f.isNew && (
                        <span className="rounded-full bg-[#1AC212] px-2 py-[2px] text-[10px] font-bold tracking-[0.04em] text-white">
                          New
                        </span>
                      )}
                    </p>
                    <h2 className="mt-2 font-montserrat text-[20px] font-bold leading-snug text-black">
                      {f.title}
                    </h2>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-6 w-6 shrink-0 text-neutral-400 transition-colors group-hover:text-[#17AD10]"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 font-lora text-[15px] leading-[1.7] text-[#101010]">{f.blurb}</p>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 font-mono text-[12px] text-neutral-500">
                  {f.nodeId && <span>node {f.nodeId}</span>}
                  {f.nodeId && f.size && <span className="text-neutral-300">|</span>}
                  {f.size && <span>{f.size}</span>}
                  {(f.nodeId || f.size) && <span className="text-neutral-300">|</span>}
                  <span className="text-[#17AD10]">{f.to}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── The images, down the page ─────────────────────────────────────── */}
      <section className="border-t border-neutral-100 bg-[#FCFCFB] py-16">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <h2 className="font-montserrat text-[26px] font-bold text-black sm:text-[32px]">
            What they look like
          </h2>
          <p className="mt-3 max-w-[640px] font-lora text-[15px] leading-[1.7] text-[#101010]">
            Captured from the running site at 1440px, plus one phone view. Click any of them to open
            the page itself.
          </p>

          <div className="mt-10 space-y-12">
            {PREVIEWS.map((p) => (
              <figure key={p.src}>
                <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-montserrat text-[13px] font-semibold uppercase tracking-[0.1em] text-[#17AD10]">
                    {p.frame}
                  </span>
                  <a
                    href={p.to}
                    className="inline-flex items-center gap-1 font-mono text-[12px] text-neutral-500 hover:text-[#17AD10]"
                  >
                    {p.to}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </figcaption>

                <a href={p.to} className="block">
                  <img
                    src={p.src}
                    alt={`${p.frame} — ${p.caption}`}
                    loading="lazy"
                    className="w-full rounded-[10px] border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  />
                </a>

                <p className="mt-3 font-lora text-[14px] leading-[1.7] text-[#101010]">{p.caption}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <PendingImages />
        </div>
      </section>

      <FigmaFooter />
    </div>
  );
}
