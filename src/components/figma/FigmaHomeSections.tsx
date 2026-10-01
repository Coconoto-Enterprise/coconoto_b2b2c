import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Shield,
  Globe,
  Zap,
  Users,
  HardDrive,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ImageSlot from './ImageSlot';
import { LongArrow } from './NumberedRow';
import { BookEventModal } from '../BookEventModal';
import {
  PILLAR_SLIDESHOWS,
  ECOSYSTEM_IMAGES,
  ECOSYSTEM_ICONS,
  efficientMachineIcon,
  lowMaintenanceIcon,
} from './homeSectionImages';

/* ───────────────────────────────────────────────────────────────────────────
 *  The content sections of the Figma "Home" frame (Desktop 42), extracted so
 *  they can be rendered in two places:
 *
 *    · `/`            → `withImages` — real photos from `src/assets`
 *    · `/figma/home`  → placeholders, because the Figma pages are a temporary
 *                        test harness that will be scrapped
 *
 *  Deliberately excludes the navbar, the hero and the footer — those are owned
 *  by whichever page mounts these sections.
 * ─────────────────────────────────────────────────────────────────────────── */

interface EcosystemCard {
  title: string;
  copy: string;
  slot: string;
  label: string;
  hint: string;
  bg: string;
  to: string;
  imgClass: string;
  /**
   * When set, the title opens a form instead of navigating. Coco DrinkEat has no
   * page of its own — its "Book Coconut Event Experience" request form IS the
   * destination, so the card opens that modal rather than linking out.
   */
  action?: 'book-event';
}

const ECOSYSTEM: EcosystemCard[] = [
  {
    title: 'Coco-Tech',
    copy: 'High-performance machines and processing solutions for efficient coconut processing',
    slot: 'home-eco-cocotech',
    label: 'Coco-Tech machine photo',
    hint: '231 × 154',
    bg: 'bg-[#F5F7F2]',
    to: '/services',
    // 750 × 1000 portrait inside a 362 × 165 landscape box, so `cover` has to
    // crop ~2/3 of the frame away. Anchor to the TOP: the machine body and its
    // control panel live in the top third, the bottom is just bare frame legs.
    imgClass: 'object-cover object-top',
  },
  {
    title: 'Cococycle Hub',
    copy: 'We convert coconut waste into valuable, eco-friendly products with real impact.',
    slot: 'home-eco-cococycle',
    label: 'Cocopeat photo',
    hint: '371 × 248',
    bg: 'bg-[#F9F8F7]',
    to: '/product',
    // 371 × 248 landscape — the 1.5:1 ratio the design slots all share, so
    // `cover` only trims ~20% vertically and bottom-anchoring keeps the ground
    // line the subject sits on.
    imgClass: 'object-cover object-bottom',
  },
  {
    title: 'Coco DrinkEat',
    copy: 'Unique coconut experiences and event services that bring people together.',
    slot: 'home-eco-cocodrinkeat',
    label: 'Coconut drink photo',
    hint: '289 × 193',
    bg: 'bg-[#FCF8F3]',
    to: '/product#drink-eat',
    action: 'book-event',
    imgClass: 'object-cover object-bottom',
  },
];

const MARKET_PRODUCTS = [
  { name: 'Cocopeat', unit: '5 kg', price: '10,000', slot: 'home-market-cocopeat' },
  { name: 'Coconut Fibre', unit: 'Full Sack', price: '15,000', slot: 'home-market-fibre' },
  { name: 'Coconut Oil', unit: '1L', price: '5,000', slot: 'home-market-oil' },
  { name: 'Coconut Shell', unit: 'Charcoal', price: '6,500', slot: 'home-market-shell' },
];

const MARKET_FEATURES = [
  'Wide range of products',
  'Safe & secure transcations',
  'Verified suppliers & buyers',
  'Support for farmers & business',
];

/**
 * One bullet in a pillar's feature list.
 *
 * `iconSrc` is owner-supplied artwork dropped into `src/assets`; it wins over
 * the lucide `icon` when both are set. Either may be omitted — Coco DrinkEat's
 * bullets carry neither and render as plain text.
 */
type FeatureBullet = { label: string; icon?: LucideIcon; iconSrc?: string };

type Pillar = {
  label: string;
  heading: string;
  copy: string;
  features: FeatureBullet[];
  /** Figma draws the three pillars' bullets three different ways. */
  featureLayout: 'row' | 'stack' | 'col';
  slot: string;
  label2: string;
  to: string;
};

const PILLARS: Pillar[] = [
  {
    label: 'Coco-Tech',
    heading: 'Technology that moves coconut processing forward.',
    copy: 'From dehusking to deshelling and beyond, our machines are built for efficiency, durability and performance. Thereby ensuring Fast, cost-effective coconut processing',
    features: [
      { label: 'Efficient Machines', iconSrc: efficientMachineIcon },
      { label: 'Low maintenance', iconSrc: lowMaintenanceIcon },
      { label: 'Built to last', icon: HardDrive },
    ],
    featureLayout: 'row',
    slot: 'home-cocotech-img',
    label2: 'Machine close-up',
    to: '/services',
  },
  {
    label: 'Cococycle Hub',
    heading: 'Turning coconut waste into valuable resources.',
    copy: 'We transform coconut by-products into eco-friendly solutions that create environmental and economic value.',
    features: [
      { label: 'Reduce Waste', icon: Recycle },
      { label: 'Eco-friendly product', icon: Leaf },
      { label: 'Sustainable impact', icon: Globe },
    ],
    featureLayout: 'stack',
    slot: 'home-cococycle-img',
    label2: 'Waste-to-value flat lay',
    to: '/product',
  },
  {
    label: 'Coco DrinkEat',
    heading: 'More than an event. A coconut experience.',
    copy: 'We bring you a unique Coconut experience where you eat and drink coconut',
    features: [
      { label: 'Fresh-cut coconuts with custom serving options' },
      { label: 'Sustainable and eco-friendly presentation' },
      { label: 'Unique and memorable event experience' },
    ],
    featureLayout: 'col',
    slot: 'home-cocodrinkeat-img',
    label2: 'Coconut event setup',
    to: '/product#drink-eat',
  },
];

const WHY = [
  {
    icon: Shield,
    title: 'Verified Partners',
    copy: 'All suppliers and buyers are thoroughly vetted for your security',
    tone: 'text-[#2B2B2B]',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    copy: 'Access markets worldwide and expand your business internationally',
    tone: 'text-[#2B2B2B]',
  },
  {
    icon: Zap,
    title: 'Quick Transactions',
    copy: 'Streamlined process for faster and efficient deal closure',
    tone: 'text-[#6F4A32]',
  },
  {
    icon: Users,
    title: 'Community Driven',
    copy: 'Join a thriving community of successful businesses',
    tone: 'text-[#6F4A32]',
  },
];

/** 53 × 2 green rule that sits above each pillar label. */
function Dash() {
  return <span className="block h-[2px] w-[53px] bg-[#17AD10]" aria-hidden="true" />;
}

/**
 * A feature bullet's glyph: owner-supplied artwork when the bullet has any,
 * otherwise its lucide icon.
 *
 * Both paths get the identical box from `className`, so the row's 16px gap and
 * the label's vertical centring hold whether the bullet is artwork or an icon.
 * The artwork carries its own `#1AC212` in the pixels, which is why the lucide
 * fallback is tinted to match rather than left on the old `#17AD10`.
 */
function FeatureGlyph({
  feature,
  className,
  strokeWidth,
}: {
  feature: FeatureBullet;
  className: string;
  strokeWidth: number;
}) {
  if (feature.iconSrc) {
    return (
      <img
        src={feature.iconSrc}
        alt=""
        aria-hidden="true"
        className={`${className} object-contain`}
      />
    );
  }
  const Icon = feature.icon;
  return Icon ? <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" /> : null;
}

/**
 * Cross-fading image slideshow — the same behaviour the home page's original
 * Coco-Tech / Cococycle Hub / Coco DrinkEat sections used: every image is
 * stacked `absolute inset-0` and the current one fades in over 800ms on a 4s
 * interval.
 */
function FadingSlideshow({
  images,
  className = '',
  alt = '',
}: {
  images: string[];
  className?: string;
  alt?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Every frame must be loaded up-front, so no `loading="lazy"` here. With
          lazy frames the fade advances onto an image the browser has not fetched
          yet and the box goes blank for a beat. The old home page sections did
          the same thing (plain <img>, eager by default). */}
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

export default function FigmaHomeSections({ withImages = false }: { withImages?: boolean }) {
  // Owned here rather than by a page: the Coco DrinkEat card lives inside this
  // component, so the form it opens has to be mounted alongside it.
  const [bookEventOpen, setBookEventOpen] = useState(false);
  return (
    <>
      {/* ── Ecosystem ────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-[100px] lg:pb-[150px] lg:pt-[80px]">
          <div className="text-center">
            <p className="font-montserrat text-[20px] font-semibold uppercase leading-[24px] text-[#5A3015]">
              Explore the Coconoto Ecosystem
            </p>
            <h2 className="mt-[20px] font-montserrat text-[26px] font-semibold leading-tight text-black sm:text-[32px] lg:leading-[39px]">
              More than coconut. Endless possibilities.
            </h2>
            <p className="mx-auto mt-[10px] max-w-[475px] font-montserrat text-[16px] leading-[32px] text-black">
              Discover specialized solutions across the entire value chain, built to empower
              business and communities
            </p>
          </div>

          <div className="mt-[40px] grid gap-[32px] md:grid-cols-3">
            {ECOSYSTEM.map((card) => {
              return (
                // Not a link any more: only the title navigates, so the card no
                // longer behaves like one giant click target.
                <div
                  key={card.title}
                  className={`group flex h-[409px] flex-col overflow-hidden rounded-[24px] ${card.bg} px-[32px] py-[20px]`}
                >
                  <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white">
                    <img
                      src={ECOSYSTEM_ICONS[card.slot]}
                      alt=""
                      aria-hidden="true"
                      className="h-[24px] w-[24px]"
                    />
                  </span>
                  <h3 className="mt-[15px] font-montserrat text-[18px] font-bold leading-[22px] text-[#140504]">
                    {card.action === 'book-event' ? (
                      // A <button>, not a <Link>: this card opens the booking
                      // form instead of navigating.
                      <button
                        type="button"
                        onClick={() => setBookEventOpen(true)}
                        className="cursor-pointer underline-offset-[3px] transition-colors hover:text-[#17AD10] hover:underline"
                      >
                        {card.title}
                      </button>
                    ) : (
                      <Link
                        to={card.to}
                        className="underline-offset-[3px] transition-colors hover:text-[#17AD10] hover:underline"
                      >
                        {card.title}
                      </Link>
                    )}
                  </h3>
                  <p className="mt-[15px] max-w-[252px] font-lora text-[16px] leading-[24px] text-black">
                    {card.copy}
                  </p>
                  {/* `mt-auto` soaks up the leftover height and becomes the gap
                      between the copy and the photo — ~20px at 409px tall. */}
                  <ImageSlot
                    slot={card.slot}
                    src={withImages ? ECOSYSTEM_IMAGES[card.slot] : undefined}
                    label={card.label}
                    hint={card.hint}
                    className="mt-auto h-[165px] w-full"
                    imgClassName={card.imgClass}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Coco-Connect Marketplace ─────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
          <div className="grid items-start gap-[20px] lg:grid-cols-[521fr_699fr]">
            {/* Left: pitch */}
            <div className="flex h-[382px] flex-col rounded-[10px] bg-[#F9F8F8] p-[20px]">
              <p className="font-montserrat text-[16px] font-semibold text-[#17AD10]">
                Coco-Connect Marketplace
              </p>
              <h3 className="mt-[14px] font-montserrat text-[24px] font-semibold leading-[29px] text-[#4F2616]">
                Buy. Sell. Connect. Grow.
              </h3>
              <p className="mt-[16px] font-lora text-[16px] leading-[24px] text-black">
                Access quality coconut products, materials and equipment from verified suppliers.
                Connect with the right people, close deals faster, and grow your bussiness
              </p>

              <ul className="mt-[35px] grid grid-cols-1 gap-x-[19px] gap-y-[20px] sm:grid-cols-2">
                {MARKET_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-[8px]">
                    <CheckCircle2 className="h-[24px] w-[24px] shrink-0 text-[#17AD10]" aria-hidden="true" />
                    <span className="font-lora text-[14px] leading-[18px] text-black">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/marketplace"
                className="group mt-auto inline-flex h-[44px] w-fit items-center gap-[10px] rounded-[15px] bg-[#17AD10] px-[30px] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#167911]"
              >
                Explore Marketplace
                <LongArrow className="w-[24px]" />
              </Link>
            </div>

            {/* Right: popular products */}
            <div>
              <div className="h-[382px] rounded-[10px] bg-[#F8F8F8] p-[20px]">
                <h3 className="font-montserrat text-[16px] font-semibold text-black">
                  Popular on the marketplace
                </h3>

                <div className="mt-[18px] grid grid-cols-2 gap-[13px] sm:grid-cols-4">
                  {MARKET_PRODUCTS.map((p) => (
                    <div key={p.name}>
                      <ImageSlot
                        slot={p.slot}
                        label={`${p.name} photo`}
                        hint="155 × 169"
                        className="h-[169px] w-full"
                      />
                      <p className="mt-[33px] font-lora text-[16px] font-medium leading-[20px] text-black">
                        {p.name}
                      </p>
                      <p className="mt-[9px] font-lora text-[14px] leading-[18px] text-black">
                        {p.unit}
                      </p>
                      <p className="mt-[11px] font-lora text-[16px] font-medium leading-[20px] text-[#17AD10]">
                        &#8358;{p.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[8px] flex h-[30px] items-center justify-center gap-[29px]" aria-hidden="true">
                <span className="h-[7px] w-[7px] rounded-full bg-[#C4C4C4]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#C4C4C4]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#C4C4C4]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillar sections ──────────────────────────────────────────────── */}
      {PILLARS.map((p, i) => {
        const imageRight = i === 1;
        const boxClass = `h-[380px] w-full rounded-[15px] lg:h-[449px] ${
          imageRight ? 'lg:order-2' : 'lg:order-1'
        }`;
        const slideshow = withImages ? PILLAR_SLIDESHOWS[p.slot] : undefined;

        return (
          <section
            key={p.label}
            className={`${i === 1 ? 'mt-[150px] bg-[#EFEFEF]' : 'pt-[150px] bg-white'}`}
          >
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
              <div
                className={`grid items-center gap-12 ${
                  imageRight ? 'lg:grid-cols-[544fr_628fr]' : 'lg:grid-cols-[628fr_544fr]'
                } lg:gap-[68px] ${i === 1 ? 'py-[50px]' : ''}`}
              >
                {slideshow && slideshow.length > 0 ? (
                  <FadingSlideshow images={slideshow} alt={p.label2} className={boxClass} />
                ) : (
                  <ImageSlot slot={p.slot} label={p.label2} hint="628 × 449" className={boxClass} />
                )}

                <div className={imageRight ? 'lg:order-1' : 'lg:order-2'}>
                  <Dash />
                  <p className="mt-[20px] font-montserrat text-[24px] font-semibold leading-[29px] text-[#17AD10]">
                    {p.label}
                  </p>
                  <h3 className="mt-[20px] font-montserrat text-[26px] font-bold leading-[39px] text-black sm:text-[32px]">
                    {p.heading}
                  </h3>
                  <p className="mt-[24px] font-lora text-[16px] leading-[24px] text-[#101010]">
                    {p.copy}
                  </p>

                  {/* Figma uses three different feature treatments:
                      row (20px icon, 16 gap, 24 apart) · stack (35px icon above
                      the label, 50 apart) · col (16px dot, 15 gap, 20 apart). */}
                  {p.featureLayout === 'stack' ? (
                    <ul className="mt-[40px] flex flex-wrap items-start gap-x-[50px] gap-y-[20px]">
                      {p.features.map((f) => (
                        <li key={f.label} className="flex flex-col items-center gap-[20px] text-center">
                          <FeatureGlyph
                            feature={f}
                            className="h-[35px] w-[35px] shrink-0 text-[#17AD10]"
                            strokeWidth={1.3}
                          />
                          <span className="font-lora text-[16px] leading-[20px] text-[#101010]">{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : p.featureLayout === 'col' ? (
                    <ul className="mt-[40px] flex flex-col gap-[20px]">
                      {p.features.map((f) => (
                        <li key={f.label} className="flex items-center gap-[15px]">
                          <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center" aria-hidden="true">
                            <span className="h-[8px] w-[8px] rounded-full bg-[#101010]" />
                          </span>
                          <span className="font-lora text-[16px] leading-[20px] text-[#101010]">{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mt-[40px] flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
                      {p.features.map((f) => (
                        <li key={f.label} className="flex items-center gap-[16px]">
                          <FeatureGlyph
                            feature={f}
                            className="h-[20px] w-[20px] shrink-0 text-[#1AC212]"
                            strokeWidth={1.5}
                          />
                          <span className="font-lora text-[16px] leading-[20px] text-[#101010]">{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    to={p.to}
                    className="group mt-[32px] inline-flex items-center gap-[10px] font-lora text-[16px] font-medium leading-[20px] text-[#17AD10] transition-opacity hover:opacity-80"
                  >
                    Learn more
                    <LongArrow className="w-[24px] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Why choose ───────────────────────────────────────────────────── */}
      <section className="bg-white pt-[199px]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
          <h2 className="text-center font-montserrat text-[20px] font-bold leading-[24px] text-black">
            Why Choose Coconoto?
          </h2>

          <div className="mt-[48px] grid gap-[33px] sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <Icon
                    className={`h-[35px] w-[35px] ${item.tone}`}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  <h3 className="mt-[20px] font-lora text-[18px] font-medium leading-[23px] text-black">
                    {item.title}
                  </h3>
                  <p className="mt-[19px] max-w-[285px] font-lora text-[14px] leading-[18px] text-[#101010]">
                    {item.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <section className="bg-white pb-[81px] pt-[66px]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[90px]">
          <div className="flex min-h-[198px] flex-col items-start justify-between gap-8 rounded-[15px] bg-[#6F4A32] px-6 py-8 lg:flex-row lg:items-center lg:px-[60px] lg:pb-[53px] lg:pt-[60px]">
            <div>
              <h2 className="font-montserrat text-[20px] font-semibold leading-[29px] text-white sm:text-[24px]">
                Ready to be part of the coconut value chain?
              </h2>
              <p className="mt-[20px] max-w-[468px] font-lora text-[14px] leading-[18px] text-white">
                Explore products, access technology, and connect with opportunities that grow your
                business and impact.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-[12px]">
              <Link
                to="/marketplace"
                className="flex h-[40px] items-center justify-center rounded-[15px] bg-white px-[30px] font-lora text-[16px] font-medium text-[#101010] transition-colors hover:bg-neutral-100"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/about"
                className="flex h-[42px] items-center justify-center rounded-[15px] border border-white px-[10px] font-lora text-[16px] font-medium text-white transition-colors hover:bg-white hover:text-[#6F4A32] lg:px-[22px]"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Coco DrinkEat card's destination: its own booking form. */}
      <BookEventModal isOpen={bookEventOpen} onClose={() => setBookEventOpen(false)} />
    </>
  );
}
