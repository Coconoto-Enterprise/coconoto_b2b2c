import React, { useRef, useState, type ReactNode } from 'react';
import { Play, ChevronLeft, ChevronRight, Leaf, Check } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import { WaitlistModal } from './WaitlistModal';

import heroBg from '../assets/about/hero-bg.jpg';
import storyVideo from '../assets/about/story-video.jpg';
import missionHand from '../assets/about/mission-hand.jpg';
import visionCocoa from '../assets/about/vision-cocoa.jpg';
import portrait1 from '../assets/about/portrait-1.jpg';
import portrait2 from '../assets/about/portrait-2.jpg';
import portrait3 from '../assets/about/portrait-3.jpg';
import portrait4 from '../assets/about/portrait-4.jpg';
import portrait5 from '../assets/about/portrait-5.jpg';

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const MISSION_BULLETS = [
  'Empower Farmers with technology, markets, fair pricing, and new income opportunities from coconuts and their by-products.',
  'Generate decent employment and entrepreneurship opportunities across the coconut value chain.',
  'Turn coconut waste into valuable, eco-friendly products while reducing pollution and landfill waste.',
];

const VISION_BULLETS = [
  'Farmers Prosper by benefiting from fair prices, modern technology, and improved market access.',
  'Local communities benefit from job creation, entrepreneurship, and sustainable economic development.',
  'Coconut waste becomes Wealth and by-products are transformed into valuable resources and innovative products.',
];

const WHAT_WE_DO = [
  {
    n: '01',
    title: 'Coco-Tech',
    desc: 'We design, fabricate, and sell innovative coconut processing machines for the entire value chain. Our Machines:',
    bullets: [
      'Dehusking Machine (500–900 nuts/hr)',
      'Deshelling Machine (240–400 nuts/hr)',
      'Decorticator (Separates cocopeat from husk)',
      'Coconut Milk Extractor (Automatic & Manual)',
    ],
  },
  {
    n: '02',
    title: 'Coco-Connect',
    desc: 'Our digital marketplace is a B2B2C platform that connects farmers, processors, suppliers, and buyers creating a one-stop ecosystem for everything coconut. We Act as a Facilitator:',
    bullets: [
      'Enable direct buyer-seller partnerships',
      'Ensure direct seller relationships',
      'Provide verified business network',
    ],
  },
  {
    n: '03',
    title: 'Cocycle Hub',
    desc: 'We convert coconut waste into valuable products, empowering women and men while promoting sustainable agriculture.',
    bullets: [
      'Cocopeat for soilless farming',
      'Coconut fiber for crafts',
      'Cocopot for homes & offices',
      'Briquette charcoal',
    ],
  },
  {
    n: '04',
    title: 'Coco DrinkEat',
    desc: 'We bring the ultimate coconut experience to your events fresh pre-cut coconuts ready to drink and eat on the spot. Event Services:',
    bullets: [
      'Fresh-cut coconuts at your venue',
      'Drink coconut water on the spot',
      'Custom branded serving stations',
    ],
  },
];

interface TeamMember {
  name: string;
  role: string;
  img: string;
  featured?: boolean;
  email?: string;
  phone?: string;
}

const TEAM: TeamMember[] = [
  { name: 'Adesuwa Ojo', role: 'Operations Lead', img: portrait1 },
  { name: 'ENOCH Bamigboye', role: 'Software Engineer', img: portrait2 },
  {
    name: 'Jacob O. Abiodun',
    role: 'Founder/CEO',
    img: portrait3,
    featured: true,
    email: 'Bongoeq@example.com',
    phone: '+233 45 678 0972',
  },
  { name: 'Kehinde Omotoyin', role: 'Finance Manager', img: portrait4 },
  { name: 'Tunde Bakare', role: 'Agronomist', img: portrait5 },
];

const SDG = [
  {
    code: '5',
    title: 'Gender Equality',
    bullets: [
      'Employ more women',
      'Integrate women into value chain',
      'Improve performance of men in the industry',
    ],
  },
  {
    code: '8',
    title: 'Decent Work',
    bullets: [
      'Create more decent jobs',
      'Contribute to coconut industry growth',
      'Access to digital marketplace',
    ],
  },
  {
    code: '12',
    title: 'Responsible production',
    bullets: [
      'Improve production to reduce waste',
      'Promote circularity',
      'Increase revenue by 20%',
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Coconut mark used for the vision + SDG bullets. */
function CoconutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" role="img">
      <circle cx="12" cy="13" r="8.5" fill="#5d3a1f" />
      <ellipse cx="12" cy="13" rx="5.5" ry="4.5" fill="#f8efe1" />
      <ellipse cx="12" cy="13" rx="4.5" ry="3.5" fill="#fff7ea" />
    </svg>
  );
}

/** Fade + rise on scroll. Honours prefers-reduced-motion. */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/** Shared content shell: 1440 max, 100px gutters at desktop (Figma frame). */
const Shell = 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[100px]';

/** Section heading — Montserrat 700 / 40px. */
function SectionTitle({
  id,
  children,
  tone = 'dark',
}: {
  id: string;
  children: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <h2
      id={id}
      className={`font-montserrat text-3xl font-bold leading-tight md:text-[40px] ${
        tone === 'dark' ? 'text-black' : 'text-white'
      }`}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export function About() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 400, behavior: 'smooth' });
  };

  return (
    <div className="bg-white font-lora text-ink">
      {/* ---------------- HERO ---------------- */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative isolate flex min-h-[520px] items-center overflow-hidden"
      >
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Figma: #033A34 @ 60% scrim over the hero photo */}
        <div className="absolute inset-0 -z-10 bg-forest/60" aria-hidden="true" />

        <div className={`${Shell} py-32 md:py-40`}>
          <div className="mx-auto max-w-[848px] text-center">
            <h1
              id="about-hero-heading"
              className="font-montserrat text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              About Us
            </h1>
            <p className="mx-auto mt-6 font-lora text-base leading-[30px] text-white/90 md:text-lg">
              Coconoto is a Smart Agritech company focused on creating technology,
              accessibility, and sustainability across the coconut value chain. We leverage
              innovative digital solutions to address challenges in coconut production,
              processing, distribution, and market access, while empowering farmers with
              better information, tools, and opportunities.
            </p>
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="mt-8 inline-flex items-center justify-center rounded-[10px] bg-brand px-8 py-3 font-lora text-base font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              Register now
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- OUR STORY ---------------- */}
      <section aria-labelledby="our-story" className="bg-white py-16 md:py-24">
        <div className={Shell}>
          <Reveal className="grid items-center gap-8 lg:grid-cols-[minmax(0,768px)_minmax(0,540px)]">
            <div className="relative overflow-hidden rounded-[10px]">
              <img
                src={storyVideo}
                alt="Coconoto team recording the company story"
                className="aspect-[4/3] w-full rounded-[10px] object-cover"
              />
              <div className="absolute inset-0 bg-forest/60" aria-hidden="true" />
              <button
                type="button"
                aria-label="Play story video"
                className="group absolute inset-0 flex items-center justify-center focus:outline-none"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-white/60 md:h-[98px] md:w-[98px]">
                  <Play className="h-9 w-9 fill-forest text-forest md:h-10 md:w-10" aria-hidden="true" />
                </span>
              </button>
            </div>

            <div>
              <SectionTitle id="our-story">Our STORY</SectionTitle>
              <p className="mt-4 font-lora text-base leading-[32px] text-ink">
                Born out of the need to tackle waste and inefficiency in the coconut
                industry, Coconoto began as a vision to merge sustainability with
                technology. What started as a simple observation seeing tons of coconut
                waste ending up in landfills and releasing harmful carbon became a mission
                to transform the entire coconut value chain.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- MISSION + VISION ---------------- */}
      <section aria-labelledby="our-mission" className="bg-mist py-16 md:py-24">
        <div className={`${Shell} flex flex-col gap-16 md:gap-24`}>
          {/* Mission — text left, image right */}
          <Reveal className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <SectionTitle id="our-mission">Our Mission</SectionTitle>
              <p className="mt-4 font-lora text-base leading-[32px] text-ink">
                We are committed to building a technology-enabled coconut economy that
                improves livelihoods, environmental sustainability &amp; creates
                opportunities. Through innovation and inclusive solutions, we aim to:
              </p>
              <ul className="mt-8 space-y-6">
                {MISSION_BULLETS.map((b) => (
                  <li key={b} className="flex gap-4">
                    <Leaf className="mt-1 h-5 w-5 shrink-0 text-coconut" aria-hidden="true" />
                    <span className="font-lora text-sm leading-[30px] text-black">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={missionHand}
              alt="Farmer tending to coconut seedlings"
              className="aspect-[604/518] w-full rounded-[10px] object-cover"
            />
          </Reveal>

          {/* Vision — image left, text right */}
          <Reveal className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <img
              src={visionCocoa}
              alt="Hands holding cocoa beans"
              className="aspect-[604/518] w-full rounded-[10px] object-cover md:order-1"
            />
            <div className="md:order-2">
              <SectionTitle id="our-vision">Our Vision</SectionTitle>
              <p className="mt-4 font-lora text-base leading-[32px] text-ink">
                Our vision is to create a sustainable, profitable, and inclusive coconut
                ecosystem that drives economic growth and environmental impact across
                Africa. We envision a future where:
              </p>
              <ul className="mt-8 space-y-6">
                {VISION_BULLETS.map((b) => (
                  <li key={b} className="flex gap-4">
                    <CoconutIcon className="mt-1 h-5 w-5 shrink-0" />
                    <span className="font-lora text-sm leading-[30px] text-black">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WHAT WE DO ---------------- */}
      <section aria-labelledby="what-we-do" className="bg-white py-16 md:py-24">
        <div className={Shell}>
          <Reveal className="mx-auto max-w-[845px] text-center">
            <SectionTitle id="what-we-do">What we do</SectionTitle>
            <p className="mt-4 font-lora text-base leading-[32px] text-ink">
              We leverage technology and sustainable practices to transform the coconut
              value chain from production and processing to distribution and market access.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2">
            {WHAT_WE_DO.map((card) => (
              <Reveal key={card.n}>
                <article className="h-full rounded-[20px] bg-coconut p-6 text-white shadow-sm md:p-8">
                  <div className="flex items-start gap-6 md:gap-8">
                    <span
                      aria-hidden="true"
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white font-montserrat text-2xl font-bold text-black md:h-[86px] md:w-[86px] md:text-[30px]"
                    >
                      {card.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-lora text-xl font-bold leading-snug md:text-[20px]">
                        {card.title}
                      </h3>
                      <p className="mt-2 font-lora text-base leading-relaxed text-white/90">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 border-t border-white/25 pt-6">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                        <span className="font-lora text-sm leading-relaxed text-white/95">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MEET THE TEAM ---------------- */}
      <section aria-labelledby="meet-the-team" className="bg-white pb-16 md:pb-24">
        <div className={Shell}>
          <Reveal className="mx-auto max-w-[700px] text-center">
            <SectionTitle id="meet-the-team">Meet the Team</SectionTitle>
            <p className="mt-4 font-lora text-base leading-[32px] text-ink">
              Meet our team of dedicated members who are committed to driving the
              development of Coconoto.
            </p>
          </Reveal>

          <div className="relative mt-12">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous team member"
              className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-coconut md:flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div
              ref={carouselRef}
              role="region"
              aria-label="Team carousel"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-coconut [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {TEAM.map((m) => (
                <article
                  key={m.name}
                  className={`shrink-0 snap-center ${
                    m.featured
                      ? 'w-[300px] rounded-[10px] border border-gray-300 p-4 md:w-[392px]'
                      : 'w-[240px] md:w-[280px]'
                  }`}
                >
                  <div
                    className={`overflow-hidden rounded-[10px] bg-gray-100 ${
                      m.featured ? 'aspect-[392/464]' : 'aspect-[3/4]'
                    }`}
                  >
                    <img
                      src={m.img}
                      alt={`Portrait of ${m.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h3 className="mt-4 font-montserrat text-xl font-bold leading-[26px] text-ink">
                    {m.name}
                  </h3>
                  <p className="font-montserrat text-base text-ink">{m.role}</p>

                  {m.featured && (
                    <div className="mt-3 space-y-1 text-left text-sm">
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="block truncate text-cocoTeal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cocoTeal"
                        >
                          {m.email}
                        </a>
                      )}
                      {m.phone && (
                        <a
                          href={`tel:${m.phone.replace(/\s/g, '')}`}
                          className="block text-ink hover:underline"
                        >
                          {m.phone}
                        </a>
                      )}
                      <a
                        href="#"
                        aria-label={`${m.name} on LinkedIn`}
                        className="mt-2 inline-flex items-center text-[#0A66C2] hover:text-[#004182] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
                      >
                        <FaLinkedin className="h-12 w-12" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next team member"
              className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-coconut md:flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- OUR SOCIAL IMPACT ---------------- */}
      <section
        aria-labelledby="social-impact"
        className="bg-forest py-16 text-white md:py-24"
      >
        <div className={Shell}>
          <Reveal className="mx-auto max-w-[700px] text-center">
            <SectionTitle id="social-impact" tone="light">
              Our Social Impact
            </SectionTitle>
            <p className="mt-4 font-lora text-base leading-[32px] text-white/90">
              Coconoto aligns with the UN Sustainable Development Goals (SDGs 5, 8 &amp;
              12), promoting gender equality, decent work, and responsible production.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
            {SDG.map((s) => (
              <Reveal key={s.code}>
                <article className="h-full rounded-[10px] border border-black/10 bg-white p-6 text-ink shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-montserrat text-[32px] font-bold leading-tight text-coconut">
                      SDG {s.code}
                    </h3>
                    <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
                      <CoconutIcon className="h-8 w-8" />
                    </span>
                  </div>
                  <p className="mt-4 font-lora text-xl font-semibold text-ink">{s.title}</p>
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden="true" className="text-coconut">
                          •
                        </span>
                        <span className="font-montserrat text-base text-ink">{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
