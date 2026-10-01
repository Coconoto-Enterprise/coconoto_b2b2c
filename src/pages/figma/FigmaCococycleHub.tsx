import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import NumberedRow from '../../components/figma/NumberedRow';
import Certifications from '../../components/figma/Certifications';
import { BookEventModal } from '../../components/BookEventModal';
import markIcon from '../../assets/mark.svg';

/* ── Desktop 11 · data ──────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    number: '01',
    title: 'Cocopeat',
    description:
      'Nutrient-rich growing medium perfect for sustainable agriculture and gardening. Key features include:',
    bullets: [
      'High Water Retention: Holds up to 10 times its weight in water, reducing irrigation needs.',
      'pH Neutral: Provides optimal growing conditions for most plants and crops.',
      'Sustainable Alternative: Eco-friendly replacement for traditional peat moss.',
      'Disease Resistant: Natural antifungal properties protect plant roots.',
    ],
    slot: 'cocycle-p1',
    label: 'Cocopeat photo',
    hint: '634 × 608',
  },
  {
    number: '02',
    title: 'Fiber',
    description:
      'Biodegradable material perfect for eco-friendly crafts and sustainable packaging solutions. Key features include:',
    bullets: [
      '100% Biodegradable: Naturally decomposes without environmental impact.',
      'High Durability: Strong fiber structure suitable for various applications.',
      'Moisture Resistant: Natural properties protect against humidity and water damage.',
      'Versatile Usage: Ideal for crafts, packaging, and industrial applications.',
    ],
    slot: 'cocycle-p2',
    label: 'Coconut fiber photo',
    hint: '634 × 608',
    reverse: true,
  },
  {
    number: '03',
    title: 'Cocopot',
    description:
      'Eco-friendly plant containers that biodegrade naturally while nurturing plant growth. Key features and benefit include:',
    bullets: [
      'Biodegradable Design: Breaks down naturally in soil, enriching the earth.',
      'Root-Friendly: Allows roots to grow through walls as pot decomposes.',
      'Zero Transplant Shock: Plant directly in ground without removing container.',
      'Sustainable Choice: Made from renewable coconut waste materials.',
    ],
    slot: 'cocycle-p3',
    label: 'Cocopot photo',
    hint: '634 × 608',
  },
  {
    number: '04',
    title: 'Biochar',
    description:
      'Premium carbon-rich soil amendment created from coconut shells through sustainable pyrolysis.',
    bullets: [
      'Carbon Sequestration: Locks carbon in soil for decades, fighting climate change.',
      'Soil Enhancement: Improves soil structure, water retention, and nutrient availability.',
      'Microbial Support: Creates ideal habitat for beneficial soil microorganisms.',
      'Long-lasting: Stable in soil for hundreds of years, providing lasting benefits.',
    ],
    slot: 'cocycle-p4',
    label: 'Biochar photo',
    hint: '634 × 608',
    reverse: true,
  },
];

const OFFERS = [
  { label: 'Coconut meat', slot: 'cocycle-offer-1' },
  { label: 'Coconut Drink', slot: 'cocycle-offer-2' },
  { label: 'Customized serving', slot: 'cocycle-offer-3' },
];

const EVENT_SERVICES = [
  'Fresh-Cut Coconuts',
  'Trained team to serve your guests',
  'Eco-Friendly Presentation',
  'Custom Serving Stations',
];

export default function FigmaCococycleHub() {
  // "Place an order now" opens Coco DrinkEat's own booking form rather than
  // sending people to the generic contact page.
  const [bookEventOpen, setBookEventOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <FigmaNav active="Services" />

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <section className="relative">
        <ImageSlot
          slot="cocycle-hero"
          label="CocoCycle Hub hero background"
          hint="1440 × 684"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          overlay="bg-black/45"
        />
        <div className="relative mx-auto flex h-[420px] max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:h-[688px] lg:px-[100px]">
          <h1 className="font-montserrat text-[36px] font-bold leading-tight text-white sm:text-[50px]">
            CocoCycle Hub
          </h1>
          <p className="mt-7 max-w-[660px] font-lora text-[16px] leading-[1.85] text-white">
            CocoCycle Hub transforms every part of the coconut into value. From sustainable products
            to innovative solutions, we promote a circular coconut economy that reduces waste,
            empowers communities, and creates a greener future
          </p>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-[70px] text-center sm:px-8">
          <h2 className="font-montserrat text-[30px] font-bold leading-tight text-black sm:text-[40px]">
            Eco-Friendly Coconut Products
          </h2>
          <p className="mx-auto mt-6 max-w-[760px] font-lora text-[16px] leading-[1.75] text-[#101010]">
            Discover sustainable products made from every part of the coconut. We turn coconut waste
            into valuable, eco-friendly solutions that support a greener future.
          </p>
        </div>
      </section>

      <div className="space-y-24 pb-24">
        {PRODUCTS.map((p) => (
          <NumberedRow
            key={p.number}
            number={p.number}
            title={p.title}
            description={p.description}
            bullets={p.bullets}
            imageSlot={p.slot}
            imageLabel={p.label}
            imageHint={p.hint}
            imageHeight="lg:h-[608px]"
            reverse={p.reverse}
          />
        ))}
      </div>

      {/* ── Coco DrinkEat event experience ───────────────────────────────── */}
      <section id="drink-eat" className="bg-white pb-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="font-lora text-[16px] font-semibold text-[#5A3015]">
            Bring the Fresh Coconut Experience to Your Events
          </p>
          <h2 className="mt-4 max-w-[520px] font-montserrat text-[26px] font-bold leading-[1.3] text-black sm:text-[30px]">
            Coco DrinkEat: Event Experience
          </h2>

          {/* Column ratio tuned so the event-services list fits on one line.
              The 520:693 split left the left card 494px wide, which gave each
              list column 202.9px — but "Trained team to serve your guests" needs
              221.8px at 14px Lora, so it wrapped to two lines. Widening the left
              card to 572 (right 556) plus the tighter gaps below buys the ~45px
              it was short. This keeps the section 400px tall; widening further
              makes the right card's photo captions wrap and pushes it to 420. */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[572fr_556fr]">
            {/* Left card */}
            <div className="flex flex-col rounded-[10px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-neutral-100">
              <p className="font-montserrat text-[16px] font-semibold text-[#101010]">
                Coco Drink Eat Experience
              </p>
              <h3 className="mt-4 font-montserrat text-[24px] font-bold text-[#653D23]">
                We come to you
              </h3>
              <p className="mt-5 font-lora text-[16px] leading-[1.7] text-black">
                We bring the ultimate coconut experience to your events fresh pre-cut coconuts ready
                to drink and eat on the spot!. Transform your event with our unique coconut
                experience. Our Services include:
              </p>

              {/* `gap-x-4` / `gap-1.5` (not the usual 6 / 2) — see the column-ratio
                  note above; these 10px are part of what lets the longest label
                  stay on one line. */}
              <ul className="mt-auto grid gap-x-4 gap-y-5 pt-8 sm:grid-cols-2">
                {EVENT_SERVICES.map((s) => (
                  <li key={s} className="flex items-start gap-1.5">
                    {/* `mark.svg` — the owner's own tick. It is a bare check with
                        no ring, replacing lucide's `CheckCircle2`. Its ink sits
                        inside the viewBox, so the 18px box is kept for alignment
                        and the mark itself draws a little smaller than the old
                        circle did. `#1AC212` is baked into the SVG, so no
                        `text-*` class applies. */}
                    <img
                      src={markIcon}
                      alt=""
                      aria-hidden="true"
                      className="mt-[2px] h-[18px] w-[18px] shrink-0"
                    />
                    <span className="font-lora text-[14px] leading-[1.5] text-black">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right card */}
            <div className="rounded-[10px] bg-[#F9F8F8] p-8">
              <h3 className="font-montserrat text-[16px] font-semibold text-black">What we offer</h3>

              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {OFFERS.map((o) => (
                  <div key={o.label}>
                    <ImageSlot
                      slot={o.slot}
                      label={`${o.label} photo`}
                      hint="199 × 162"
                      className="h-[162px] w-full rounded-[4px]"
                    />
                    <p className="mt-4 font-lora text-[16px] font-medium leading-tight text-black">
                      {o.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex justify-center">
                <button
                  type="button"
                  onClick={() => setBookEventOpen(true)}
                  className="cursor-pointer rounded-[6px] bg-[#1AC212] px-[46px] py-[13px] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#17ad10]"
                >
                  Place an order now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────────── */}
      <Certifications band="grey" />

      <FigmaFooter />

      {/* The Coco DrinkEat booking form, opened by "Place an order now". */}
      <BookEventModal isOpen={bookEventOpen} onClose={() => setBookEventOpen(false)} />
    </div>
  );
}
