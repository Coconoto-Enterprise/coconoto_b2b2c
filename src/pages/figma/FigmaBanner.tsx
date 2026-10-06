import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BadgeCheck, Leaf, Globe } from 'lucide-react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { LongArrow } from '../../components/figma/NumberedRow';

/* ───────────────────────────────────────────────────────────────────────────
 *  Frame 624908 — "Everything Coconut. One Platform."
 *
 *  IMPORTANT: in Figma the copy is NOT inside the frame. Frame 141:701 holds
 *  only the flat-lay photo; the headline, paragraph, buttons and trust row are
 *  loose layers floating on top of it at the page level (node ids 140:24–140:49).
 *  So the frame render on its own looks like a plain photo — it isn't.
 *
 *  Geometry below is those floating layers, measured from the frame origin and
 *  then re-based onto the photo area (the photo sits inset 10px, 1440 × 523):
 *
 *      headline   (100,  50)  666 × 128   Lora 600 50 / 64     (2 lines)
 *      body       (100, 210)  599 ×  96   Lora 400 20 / 32   (3 lines)
 *      buttons    (100, 354)  h 44        250 + 20 + 211, r 15
 *      trust row  (100, 455)  h 24        4 items, 31 apart
 *
 *  NOTE ON THE FONT: the headline's node style says `Inter SemiBold`, but its
 *  `characterStyleOverrides` reassign EVERY character to `Lora-SemiBold` — so
 *  the rendered face is Lora, not Inter. Same for the body and the buttons.
 *  That is also why the block is 128 tall and not 121: 60.51 is *Inter's*
 *  intrinsic line-height, whereas Lora at 50px naturally leads at 64.
 * ─────────────────────────────────────────────────────────────────────────── */

const TRUST = [
  { icon: ShieldCheck, label: 'Trusted partners' },
  { icon: BadgeCheck, label: 'Quality assured' },
  { icon: Leaf, label: 'Sustainable future' },
  { icon: Globe, label: 'Global reach' },
];

export function BannerStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#F8FAF7] ${className}`}>
      <ImageSlot
        slot="banner-image"
        label="Flat-lay artwork — palm leaves, coconut, coconut chunks"
        hint="1440 × 523"
        variant="background"
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative px-5 pb-12 pt-12 sm:px-8 lg:pb-[44px] lg:pl-[100px] lg:pt-[50px]">
        <h2 className="font-lora text-[30px] font-semibold leading-[1.2] text-black sm:text-[40px] lg:w-[666px] lg:text-[50px] lg:leading-[64px]">
          Everything Coconut. <span className="text-[#17AD10]">One Platform.</span>
        </h2>

        <p className="mt-[24px] max-w-[599px] font-lora text-[17px] leading-[1.6] text-black lg:mt-[32px] lg:text-[20px] lg:leading-[32px]">
          From advanced processing technology to sustainable products and a digital marketplace
          connecting farmers, processors, traders, and buyers.
        </p>

        <div className="mt-[36px] flex flex-wrap items-center gap-[20px] lg:mt-[48px]">
          <Link
            to="/cococonnect"
            className="flex h-[44px] items-center justify-center gap-[10px] whitespace-nowrap rounded-[15px] border border-black bg-[#17AD10] px-[26px] font-lora text-[16px] font-medium leading-[20.48px] text-white transition-colors hover:bg-[#167911] lg:w-[250px]"
          >
            Explore Marketplace
            <LongArrow className="w-[24px] shrink-0" />
          </Link>
          <Link
            to="/about"
            className="flex h-[44px] items-center justify-center whitespace-nowrap rounded-[15px] border border-[#17AD10] bg-white px-[26px] font-lora text-[16px] font-medium leading-[20.48px] text-[#17AD10] transition-colors hover:bg-[#17AD10] hover:text-white lg:w-[211px]"
          >
            Discover Coconoto
          </Link>
        </div>

        <ul className="mt-[40px] flex flex-wrap items-center gap-x-[31px] gap-y-[16px] lg:mt-[57px]">
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-[10px]">
              <Icon className="h-[24px] w-[24px] shrink-0 text-black" strokeWidth={1.5} aria-hidden="true" />
              <span className="font-lora text-[16px] leading-[20.48px] text-black">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FigmaBanner() {
  return (
    // Column flex + `flex-1` on the strip: the real footer is only 317px now, so
    // this page's content (72 + 523 + 317 = 912) is shorter than a 919px
    // viewport. Without this the `min-h-screen` wrapper stretches and leaves a
    // 7px white strip under the dark footer. Letting the strip absorb the slack
    // keeps the footer flush with the bottom of the viewport.
    <div className="flex min-h-screen flex-col bg-white">
      {/* No `active` override: this frame isn't a site page, so no nav item
          should light up. */}
      <FigmaNav />

      <section className="flex flex-1 flex-col bg-white">
        <BannerStrip className="flex-1" />
      </section>

      <FigmaFooter />
    </div>
  );
}
