import React from 'react';
import { Settings, TrendingUp, Presentation, ShieldCheck } from 'lucide-react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import NumberedRow from '../../components/figma/NumberedRow';
import Certifications from '../../components/figma/Certifications';

/* ── Desktop 8 · data ───────────────────────────────────────────────────── */

const MACHINES = [
  {
    number: '01',
    title: 'Coconut Desheller',
    description:
      'High-efficiency coconut deshelling machine for removing coconut kernel from shell. We sell this machine for commercial and industrial use.',
    bullets: [
      'Removes kernel cleanly from shell',
      'Processes up to 240-400 coconuts per hour',
      'Stainless steel construction',
      'Engineered for simultaneous operation by two users, enhancing workflow efficiency and output.',
      'Suitable for various settings from small farms to large processing plants.',
      '60% Upfront 40% Payment on delivery',
    ],
    slot: 'equip-1',
    label: 'Coconut Desheller machine',
    hint: '634 × 651',
    height: 'lg:h-[651px]',
  },
  {
    number: '02',
    title: 'Coconut Dehusker',
    description:
      'Professional coconut dehusking service for farms, processors, and traders. We offer fast, safe, and efficient dehusking using industrial-grade equipment.',
    bullets: [
      'Quick turnaround for bulk orders',
      'Safe and minimal kernel damage',
      'Pickup and delivery options available',
      'Automated operation minimizes injury risk, operable by a single user with minimal training.',
      'Suitable for various settings from small farms to large processing plants.',
    ],
    slot: 'equip-2',
    label: 'Coconut Dehusker machine',
    hint: '634 × 610',
    height: 'lg:h-[610px]',
    reverse: true,
  },
  {
    number: '03',
    title: 'Coconut Milk Extractor (Auto)',
    description:
      'Premium coconut milk extractor for efficient coconut milk production. We sell high-quality coconut milk extractors.',
    bullets: [
      'Removes kernel cleanly from shell',
      'Pure stainless steel construction',
      'Low maintenance design',
      'Hydraulic press operation',
      'Available for purchase on request',
      'Automated operation minimizes injury risk, operable by a single user with minimal training.',
      'Suitable for various settings from small farms to large processing plants.',
    ],
    slot: 'equip-3',
    label: 'Coconut Milk Extractor (Auto)',
    hint: '634 × 651',
    height: 'lg:h-[651px]',
  },
  {
    number: '04',
    title: 'Coconut Milk Extractor (Manual)',
    description:
      'Premium coconut milk extractor for efficient coconut milk production. We sell high-quality coconut milk extractors.',
    bullets: [
      'Pure stainless steel construction',
      'Low maintenance design',
      'Hydraulic press operation',
      'Available for purchase on request',
      'Can be handled easily',
      'Suitable for various settings from small farms to large processing plants.',
    ],
    slot: 'equip-4',
    label: 'Coconut Milk Extractor (Manual)',
    hint: '634 × 610',
    height: 'lg:h-[610px]',
    reverse: true,
  },
];

const PRODUCTION_CARDS = [
  {
    icon: Settings,
    title: 'Process Optimization',
    copy: 'Streamline your production with our expert consultation',
  },
  {
    icon: TrendingUp,
    title: 'Efficiency Improvement',
    copy: 'Increase output while reducing operational costs',
  },
  {
    icon: Presentation,
    title: 'Staff Training',
    copy: 'Comprehensive training for your production team',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    copy: 'Implement robust quality control systems',
  },
];

export default function FigmaEquipment() {
  return (
    <div className="min-h-screen bg-white">
      <FigmaNav active="Services" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-[70px] text-center sm:px-8">
          <h1 className="font-montserrat text-[34px] font-bold leading-tight text-black sm:text-[50px]">
            Our Processing Equipment
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] font-lora text-[16px] leading-[1.75] text-[#101010]">
            We design, fabricate, and sell innovative coconut processing machines for the entire
            value chain, Innovative, Patented Technology for Coconut Processing
          </p>
        </div>
      </section>

      {/* ── Numbered machine list ────────────────────────────────────────── */}
      <div className="space-y-24 pb-24">
        {MACHINES.map((m) => (
          <NumberedRow
            key={m.number}
            number={m.number}
            title={m.title}
            description={m.description}
            bullets={m.bullets}
            imageSlot={m.slot}
            imageLabel={m.label}
            imageHint={m.hint}
            imageHeight={m.height}
            reverse={m.reverse}
          />
        ))}
      </div>

      {/* ── Production management ────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="font-lora text-[16px] font-semibold text-[#5A3015]">
            we manage every stage of production with precision.
          </p>
          <h2 className="mt-4 max-w-[420px] font-montserrat text-[26px] font-bold leading-[1.3] text-black sm:text-[30px]">
            Production Management, Made Simple
          </h2>
        </div>

        {/* Full-bleed band with the four service cards */}
        <div className="relative mt-10 w-full">
          <ImageSlot
            slot="equip-production-bg"
            label="Hands holding soil background"
            hint="1530 × 486"
            labelPosition="corner"
            className="absolute inset-0 h-full w-full"
          />

          <div className="relative mx-auto max-w-[1440px] px-5 py-[70px] sm:px-8 lg:px-[100px]">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[44px]">
              {PRODUCTION_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="flex flex-col items-center rounded-[12px] bg-white px-6 py-10 text-center shadow-sm"
                  >
                    <Icon className="h-[34px] w-[34px] text-[#6F4A32]" strokeWidth={1.4} aria-hidden="true" />
                    <h3 className="mt-6 font-montserrat text-[18px] font-semibold text-[#101010]">
                      {c.title}
                    </h3>
                    <p className="mt-3 font-lora text-[14px] leading-[1.6] text-[#101010]">
                      {c.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────────── */}
      <div className="mt-20">
        <Certifications band="white" />
      </div>

      <FigmaFooter />
    </div>
  );
}
