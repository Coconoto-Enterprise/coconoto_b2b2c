import React, { useRef, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Leaf, Check } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { WaitlistModal } from './WaitlistModal';

import heroBg from '../assets/about/hero-bg.jpg';
import storyVideo from '../assets/about/story-video.jpg';
import missionHand from '../assets/about/mission-hand.jpg';
import visionCocoa from '../assets/about/vision-cocoa.jpg';
import portrait1 from '../assets/about/portrait-1.jpg';
import portrait2 from '../assets/about/portrait-2.jpg';
import portrait3 from '../assets/about/portrait-3.jpg';
import portrait4 from '../assets/about/portrait-4.jpg';

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
    role: 'Founder / CEO',
    img: portrait3,
    featured: true,
    email: 'Bongoeq@example.com',
    phone: '+233 45 678 0972',
  },
  { name: 'Kehinde Omotoyin', role: 'Finance Manager', img: portrait4 },
  { name: 'Tunde Bakare', role: 'Agronomist', img: portrait3 },
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

function CoconutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <circle cx="12" cy="13" r="8.5" fill="#5d3a1f" />
      <ellipse cx="12" cy="13" rx="5.5" ry="4.5" fill="#f8efe1" />
      <ellipse cx="12" cy="13" rx="4.5" ry="3.5" fill="#fff7ea" />
    </svg>
  );
}

export function About() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)), url(${heroBg})`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 pt-36 pb-32 text-center text-white">
          <h1
            id="about-hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            About Us
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            Coconoto is a Smart Agritech company focused on creating technology,
            accessibility, and sustainability across the coconut value chain. We
            leverage innovative digital solutions to address challenges in coconut
            production, processing, distribution, and market access, while
            empowering farmers with better information, tools, and opportunities.
          </p>
          <button
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Register now
          </button>
        </div>
      </section>

      {/* OUR STORY */}
      <section aria-labelledby="our-story" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative">
            <img
              src={storyVideo}
              alt="Coconoto team recording the company story"
              className="w-full rounded-lg object-cover aspect-[4/3]"
            />
            <button
              type="button"
              aria-label="Play story video"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <span className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-lg transition">
                <Play className="h-8 w-8 text-green-700 fill-current" />
              </span>
            </button>
          </div>
          <div>
            <h2
              id="our-story"
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            >
              Our STORY
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Born out of the need to tackle waste and inefficiency in the coconut
              industry, Coconoto began as a vision to merge sustainability with
              technology. What started as a simple observation seeing tons of
              coconut waste ending up in landfills and releasing harmful carbon
              became a mission to transform the entire coconut value chain.
            </p>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section aria-labelledby="our-mission" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2
              id="our-mission"
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            >
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are committed to building a technology-enabled coconut economy that
              improves livelihoods, environmental sustainability &amp; creates
              opportunities. Through innovation and inclusive solutions, we aim to:
            </p>
            <ul className="space-y-3">
              {MISSION_BULLETS.map((b, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <Leaf
                    className="h-5 w-5 text-green-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={missionHand}
              alt="Farmer tending to coconut seedlings"
              className="w-full rounded-lg object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section aria-labelledby="our-vision" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <img
              src={visionCocoa}
              alt="Hands holding cocoa beans"
              className="w-full rounded-lg object-cover aspect-[4/3]"
            />
          </div>
          <div>
            <h2
              id="our-vision"
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            >
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our vision is to create a sustainable, profitable, and inclusive
              coconut ecosystem that drives economic growth and environmental
              impact across Africa. We envision a future where:
            </p>
            <ul className="space-y-3">
              {VISION_BULLETS.map((b, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <CoconutIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section aria-labelledby="what-we-do" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              id="what-we-do"
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            >
              What we do
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700">
              We leverage technology and sustainable practices to transform the
              coconut value chain from production and processing to distribution
              and market access.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {WHAT_WE_DO.map((card) => (
              <article
                key={card.n}
                className="relative bg-amber-900 text-white rounded-2xl p-8 shadow-md"
              >
                <div className="absolute -top-5 left-8 bg-white text-amber-900 font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow">
                  {card.n}
                </div>
                <h3 className="text-2xl font-bold mb-3 mt-2">{card.title}</h3>
                <p className="text-amber-100 mb-4 leading-relaxed">
                  {card.desc}
                </p>
                <ul className="space-y-2 text-amber-50">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <Check
                        className="h-4 w-4 mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section aria-labelledby="meet-the-team" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2
              id="meet-the-team"
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            >
              Meet the Team
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700">
              Meet our team of dedicated members who are committed to driving the
              development of Coconoto.
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous team member"
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div
              ref={carouselRef}
              role="region"
              aria-label="Team carousel"
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none' }}
            >
              {TEAM.map((m, i) => (
                <article
                  key={i}
                  className={[
                    'shrink-0 snap-center bg-white rounded-xl border border-gray-200 p-4 text-center',
                    m.featured ? 'w-72 md:w-80' : 'w-64',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'mx-auto rounded-lg overflow-hidden bg-gray-100',
                      m.featured ? 'h-80' : 'h-72',
                    ].join(' ')}
                  >
                    <img
                      src={m.img}
                      alt={`Portrait of ${m.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold mt-4">{m.name}</h3>
                  <p className="text-sm text-gray-600">{m.role}</p>
                  {m.featured && (
                    <div className="mt-3 text-left text-sm space-y-1">
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="block text-green-700 hover:underline truncate"
                        >
                          {m.email}
                        </a>
                      )}
                      {m.phone && (
                        <a
                          href={`tel:${m.phone.replace(/\s/g, '')}`}
                          className="block text-gray-700"
                        >
                          {m.phone}
                        </a>
                      )}
                      <a
                        href="#"
                        aria-label={`${m.name} on LinkedIn`}
                        className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700"
                      >
                        <FaLinkedin className="h-5 w-5" aria-hidden="true" />
                        <span className="text-xs">LinkedIn</span>
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
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* OUR SOCIAL IMPACT */}
      <section aria-labelledby="social-impact" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2
              id="social-impact"
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            >
              Our Social Impact
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700">
              Coconoto aligns with the UN Sustainable Development Goals (SDGs 5,
              8 &amp; 12), promoting gender equality, decent work, and
              responsible production.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SDG.map((s) => (
              <article
                key={s.code}
                className="relative bg-white rounded-xl border border-gray-200 p-6"
              >
                <CoconutIcon className="absolute top-6 right-6 h-6 w-6" />
                <h3 className="text-2xl font-bold mb-2">SDG {s.code}</h3>
                <p className="font-semibold mb-4">{s.title}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-gray-400">
                        ·
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </div>
  );
}