import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import { FIGMA_IMAGES } from './images';

interface FrameEntry {
  frame: string;
  nodeId: string;
  size: string;
  title: string;
  blurb: string;
  to: string;
}

const FRAMES: FrameEntry[] = [
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
      'Numbered 01–04 machine catalogue (Desheller, Dehusker, Milk Extractor Auto & Manual), Production Management band with four service cards, and Our Certifications.',
    to: '/services',
  },
  {
    frame: 'Desktop 11',
    nodeId: '92:1744',
    size: '1440 × 6179',
    title: 'CocoCycle Hub',
    blurb:
      'Full-bleed hero, Eco-Friendly Coconut Products 01–04 (Cocopeat, Fiber, Cocopot, Biochar), the Coco DrinkEat event experience cards and Our Certifications.',
    to: '/product',
  },
  {
    frame: 'Desktop 20',
    nodeId: '164:8',
    size: '1440 × 919',
    title: 'Login — Welcome Back',
    blurb:
      'Split screen: “Good People. Greater Tomorrows.” photo panel beside the email / password form with Google and Apple sign-in.',
    to: '/login',
  },
  {
    frame: 'S 19',
    nodeId: '164:3060',
    size: '1440 × 919',
    title: 'Sign up — Create Your Account',
    blurb:
      'The pair to the login page: “A Greener Brighter Future.” photo panel beside full name, email, password and confirm password, with Google and Apple sign-in.',
    to: '/signup',
  },
  {
    frame: 'Desktop 43',
    nodeId: '234:39',
    size: '1440 × 1691',
    title: 'Contact us',
    blurb:
      'Palm background with a single white card: contact information on the left, the enquiry form on the right.',
    to: '/contact',
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
 * Index of every frame built from the Coconoto Figma file — one link per page.
 */
export default function FigmaIndex() {
  return (
    <div className="min-h-screen bg-white">
      <FigmaNav active="Home" />

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-[70px] sm:px-8">
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
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {FRAMES.map((f) => (
              <Link
                key={f.nodeId}
                to={f.to}
                className="group flex flex-col rounded-[10px] border border-neutral-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#17AD10] hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-montserrat text-[13px] font-semibold uppercase tracking-[0.1em] text-[#17AD10]">
                      {f.frame}
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
                  <span>node {f.nodeId}</span>
                  <span className="text-neutral-300">|</span>
                  <span>{f.size}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-[#17AD10]">{f.to}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <PendingImages />
          </div>
        </div>
      </section>

      <FigmaFooter />
    </div>
  );
}
