import React, { useState } from 'react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import FigmaHomeSections from '../../components/figma/FigmaHomeSections';
import { WaitlistModal } from '../../components/WaitlistModal';

/* ───────────────────────────────────────────────────────────────────────────
 *  Desktop 42 · Home — vertical rhythm lifted from the Figma node tree
 *  (frame 142:729, 1440 × 5046).  The section stack, measured from the top:
 *
 *      navbar            0 →  108
 *      hero title          235      buttons 427..471, hero ends 692
 *      "EXPLORE …"         708      ecosystem cards 905..1314
 *      marketplace panels 1464..1846   dots 1854
 *      pillar 1 image     2034..2483
 *      pillar 2 grey band 2633..3182   (#EFEFEF)
 *      pillar 3 image     3332..3781
 *      "Why Choose…"      3980      items 4052..4185
 *      brown CTA panel    4251..4449   (x=90, w=1260)
 *      footer             4530..5035   (505 tall)
 *
 *  Content sits in a 1240px column (x=100 → 1340) inside the 1440 frame.
 *
 *  Everything below the hero now lives in `FigmaHomeSections`, because the live
 *  home page (`/`) renders the same sections with real photos. This page keeps
 *  the placeholder slots — it is a temporary harness for checking the design
 *  against Figma and will be scrapped.
 * ─────────────────────────────────────────────────────────────────────────── */

export default function FigmaHome() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <FigmaNav active="Home" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-[1440px]">
          <ImageSlot
            slot="home-hero-lines"
            label="Hero line artwork"
            hint="1440 × 318"
            variant="background"
            className="pointer-events-none absolute left-0 top-[169px] hidden h-[318px] w-[1440px] lg:block"
          />
          <ImageSlot
            slot="home-hero-coconut-left"
            label="Coconut art (left)"
            hint="300 × 300"
            className="pointer-events-none absolute -left-[79px] top-[247px] hidden h-[300px] w-[300px] !bg-transparent [&>div]:border-0 [&>div]:bg-transparent lg:block"
            imgClassName="object-contain"
          />
          <ImageSlot
            slot="home-hero-coconut-right"
            label="Coconut art (right)"
            hint="300 × 300"
            className="pointer-events-none absolute left-[1240px] top-[215px] hidden h-[300px] w-[300px] !bg-transparent [&>div]:border-0 [&>div]:bg-transparent lg:block"
            imgClassName="object-contain"
          />

          <div className="relative px-5 pt-[60px] text-center sm:px-8 lg:px-[100px] lg:pb-[221px] lg:pt-[127px]">
            <h1 className="font-lora text-[36px] font-bold leading-tight text-black sm:text-[50px] lg:leading-[64px]">
              Welcome to Coconoto
            </h1>
            <p className="mx-auto mt-[24px] max-w-[832px] font-montserrat text-[16px] leading-[32px] text-black">
              We are a Smart Agritech company focused on creating technology, Accessibility and
              Sustainability in everything that concerns the coconut value chain.
            </p>

            {/* Coco-Connect is not live yet, so the design's "Sign Up Now" /
                "Log In" pair is replaced by the site-wide "Join Waitlist" CTA.
                Same geometry as the Figma buttons — 211 × 44, r 15 — so the
                hero rhythm is untouched. */}
            <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[32px]">
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="flex h-[44px] w-[211px] items-center justify-center rounded-[15px] bg-[#17AD10] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#167911]"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem · Coco-Connect marketplace · 3 pillars · Why choose · CTA */}
      <FigmaHomeSections />

      <FigmaFooter />

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
