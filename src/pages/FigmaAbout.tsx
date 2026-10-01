import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import FigmaNav from '../components/figma/FigmaNav';
import AboutFooter from '../components/about/AboutFooter';
import { profiles } from '../data/profiles';
import heroBg from '../assets/aboutbackground1.png';
import cocodot from '../assets/cocodot.png';
import missonDot from '../assets/misson.png';
import missionImage from '../assets/plant.png';
import visionImage from '../assets/visionimage.png';

const missionPoints = [
  'Empower farmers with technology, markets, fair pricing, and new income opportunities from coconuts and their by-products.',
  'Generate decent employment and entrepreneurship opportunities across the coconut value chain.',
  'Turn coconut waste into valuable, eco-friendly products while reducing pollution and landfill waste.',
];

const visionPoints = [
  'Farmers prosper by benefiting from fair prices, modern technology, and improved market access.',
  'Local communities benefit from job creation, entrepreneurship, and sustainable economic development.',
  'Coconut waste becomes wealth as by-products are transformed into valuable resources and innovative products.',
];

const services = [
  { number: '01', title: 'Coco-Tech', body: 'We design, fabricate, and sell innovative coconut processing machines for the entire value chain.', items: ['Dehusking Machine (500-900 nuts/hr)', 'Deshelling Machine (240-400 nuts/hr)', 'Decorticator (Separates cocopeat from husk)', 'Coconut Milk Extractor (Automatic & Manual)'] },
  { number: '03', title: 'Cococycle Hub', body: 'We convert coconut waste into valuable products, empowering women and men while promoting sustainable agriculture.', items: ['Cocopeat for soilless farming', 'Coconut fiber for crafts', 'Cocopot for homes & offices', 'Briquette charcoal'] },
  { number: '02', title: 'Coco-Connect', body: 'Our digital marketplace connects farmers, processors, suppliers, and buyers, creating a one-stop ecosystem for everything coconut.', items: ['Enable direct buyer-seller relationships', 'Provide a verified business network'] },
  { number: '04', title: 'Coco DrinkEat', body: 'We bring the ultimate coconut experience to your events with fresh pre-cut coconuts ready to drink and eat on the spot.', items: ['Fresh-cut coconuts at your venue', 'Drink coconut water on the spot', 'Custom branded serving stations'] },
];

const team = profiles.map(({ firstName, middleName, lastName, role, profileImage }) => ({
  name: `${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}`,
  role,
  image: profileImage,
}));

const impact = [
  { code: 'SDG 5', title: 'Gender Equality', items: ['Employ more women', 'Integrate women into value chain', 'Improve performance of men in the industry'] },
  { code: 'SDG 8', title: 'Decent Work', items: ['Create more decent jobs', 'Contribute to coconut industry growth', 'Access to digital marketplace'] },
  { code: 'SDG 12', title: 'Responsible production', items: ['Improve production to reduce waste', 'Promote circularity', 'Increase revenue by 20%'] },
];

function ImageCard({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full rounded-[10px] object-cover ${className}`} />;
}

function FigmaAbout({ contentOnly = false }: { contentOnly?: boolean }) {
  const teamScrollerRef = useRef<HTMLDivElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);
  // Offset + period live in refs so the marquee loop and the drag handlers agree
  // on where the strip is without forcing a re-render every frame.
  const teamOffsetRef = useRef(0);
  const teamPeriodRef = useRef(0);

  useEffect(() => {
    const viewport = teamScrollerRef.current;
    const track = teamTrackRef.current;
    if (!viewport || !track) return;

    // Marquee speed in CSS pixels per second. Tune this to taste.
    const SPEED_PX_PER_SEC = 40;

    // NOTE: deliberately no `prefers-reduced-motion` bail-out here. Windows'
    // "Animation effects" setting (HKCU\Control Panel\Desktop\UserPreferencesMask)
    // is OFF on the owner's machine, which makes Chromium report
    // `prefers-reduced-motion: reduce` — so honouring it silently froze the whole
    // carousel and looked like a bug. To restore the accessibility behaviour, bail
    // out early when window.matchMedia('(prefers-reduced-motion: reduce)').matches.

    // Travel direction of the strip: +1 = drifts left (the default), -1 = drifts right.
    // Pushing the strip flips this, so the marquee afterwards keeps travelling whichever
    // way the visitor last pushed it.
    let direction = 1;
    // How far the pointer must travel before we treat the push as a deliberate
    // direction change rather than a wobble.
    const DIRECTION_THRESHOLD_PX = 10;

    let rafId = 0;
    let lastTs = 0;
    let lastApplied = Number.NaN;
    let dragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;

    // One "period" is the distance from a card to that same card in the next copy.
    // The list is tripled, so translating by exactly one period is invisible.
    //
    // Deliberately NOT scrollWidth / 3: the flex row puts a gap *between* every pair
    // of cards, so the final copy has no trailing gap and scrollWidth/3 comes out
    // ~1 gap short. Wrapping by that value makes the strip visibly hop a few pixels
    // every cycle. Measuring card[n] against card[0] gives the true period.
    const measure = () => {
      const kids = track.children;
      const perCopy = Math.max(1, Math.round(kids.length / 3));
      const first = kids[0] as HTMLElement | undefined;
      const sameCardNextCopy = kids[perCopy] as HTMLElement | undefined;
      const measured = first && sameCardNextCopy
        ? sameCardNextCopy.offsetLeft - first.offsetLeft
        : 0;
      teamPeriodRef.current = measured > 0 ? measured : track.scrollWidth / 3;
    };

    // Keep the offset inside the middle copy, where there is always a full period of
    // content on either side to bleed into.
    const wrap = () => {
      const period = teamPeriodRef.current;
      if (period <= 0) return;
      let offset = teamOffsetRef.current;
      while (offset >= period * 2) offset -= period;
      while (offset < period * 0.5) offset += period;
      teamOffsetRef.current = offset;
    };

    const paint = () => {
      const offset = teamOffsetRef.current;
      if (offset === lastApplied) return;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      lastApplied = offset;
    };

    measure();
    teamOffsetRef.current = teamPeriodRef.current;
    paint();

    const step = (ts: number) => {
      rafId = window.requestAnimationFrame(step);
      if (!lastTs) {
        lastTs = ts;
        return;
      }
      // Clamp dt so a backgrounded tab doesn't teleport the strip on return.
      const dt = Math.min(ts - lastTs, 100);
      lastTs = ts;

      // Only a held pointer stops the marquee. Nothing else — no hover, no focus.
      if (!dragging) {
        teamOffsetRef.current += (direction * SPEED_PX_PER_SEC * dt) / 1000;
        wrap();
      }
      paint();
    };
    rafId = window.requestAnimationFrame(step);

    const onResize = () => {
      const period = teamPeriodRef.current;
      const progress = period > 0 ? teamOffsetRef.current / period : 1;
      measure();
      teamOffsetRef.current = progress * teamPeriodRef.current;
      lastApplied = Number.NaN;
      paint();
    };

    const beginDrag = (clientX: number) => {
      dragging = true;
      dragStartX = clientX;
      dragStartOffset = teamOffsetRef.current;
    };

    // Ends the drag. This is wired to pointerup, pointercancel, lostpointercapture,
    // touchend, touchcancel and window blur.
    //
    // pointercancel is the important one: pressing and dragging on a card <img> makes
    // the browser start its own native image drag-and-drop, which fires `pointercancel`
    // instead of `pointerup`. Listening only for pointerup left the strip permanently
    // "grabbed" — it followed the cursor forever and never auto-scrolled again.
    const endDrag = () => { dragging = false; };

    const onPointerDown = (event: PointerEvent) => {
      beginDrag(event.clientX);
      try {
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      } catch {
        /* pointer capture is a nicety; ignore if unsupported */
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) beginDrag(event.touches[0].clientX);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const travelled = event.clientX - dragStartX;
      teamOffsetRef.current = dragStartOffset - travelled;
      wrap();
      paint();
      // Dragging right (positive travel) moves the strip right, so it should keep
      // travelling right afterwards — and vice versa.
      if (Math.abs(travelled) >= DIRECTION_THRESHOLD_PX) {
        direction = travelled > 0 ? -1 : 1;
      }
    };

    // Suppress the native image drag that triggers the pointercancel above, so
    // grabbing a photo behaves like grabbing the strip instead of breaking it.
    const onDragStart = (event: DragEvent) => event.preventDefault();

    // A horizontal trackpad swipe or shift+wheel also sets the travel direction.
    // Only horizontal-dominant gestures are intercepted, so normal vertical page
    // scrolling is never hijacked.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      teamOffsetRef.current += event.deltaX;
      direction = event.deltaX > 0 ? 1 : -1;
      wrap();
      paint();
    };

    window.addEventListener('resize', onResize);
    viewport.addEventListener('dragstart', onDragStart);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchend', endDrag);
    viewport.addEventListener('touchcancel', endDrag);
    // Window-level safety nets: releasing outside the strip, or alt-tabbing mid-drag.
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('blur', endDrag);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      viewport.removeEventListener('dragstart', onDragStart);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', endDrag);
      viewport.removeEventListener('pointercancel', endDrag);
      viewport.removeEventListener('lostpointercapture', endDrag);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchend', endDrag);
      viewport.removeEventListener('touchcancel', endDrag);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      window.removeEventListener('blur', endDrag);
    };
  }, []);

  return (
    <div className="figma-about bg-white font-inter text-[#101010]">
      {!contentOnly && <FigmaNav />}
      <main>
        {!contentOnly && <section className="relative flex min-h-[792px] items-center justify-center overflow-hidden bg-[#142218] px-6 pb-20 pt-20 text-center text-white">
          <img src={heroBg} alt="Coconut trees and soil" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 max-w-[848px] space-y-7"><h1 className="font-gelasio text-4xl font-bold sm:text-5xl">About Us</h1><p className="text-base leading-[30px] text-white/95">Coconoto is a Smart Agritech company focused on creating technology, accessibility, and sustainability across the coconut value chain. We leverage innovative digital solutions to address challenges in coconut production, processing, distribution, and market access, while empowering farmers with better information, tools, and opportunities.</p><Link to="/buyer-signup" className="inline-flex items-center gap-2 rounded-[10px] bg-[#1ac212] px-10 py-3 font-semibold transition hover:bg-[#17AD10]">Register now <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </section>}

        <section className="relative px-6 py-8 pb-16 sm:px-10 lg:px-0 lg:py-10 lg:pb-20">
          {/* Columns are fr-based rather than fixed px: they resolve to exactly 768px/540px
              once the 1340px container is reached, but scale down instead of overflowing
              between the lg breakpoint (1024px) and that width. */}
          <div className="mx-auto grid max-w-[1340px] items-center gap-10 lg:grid-cols-[minmax(0,768fr)_minmax(0,540fr)] lg:gap-8">
            <div className="relative flex w-full max-w-[700px] self-center justify-self-center aspect-video items-center justify-center overflow-hidden rounded-[10px] border border-[#d7ccc5] bg-[#eee6e1] shadow-sm lg:aspect-auto lg:h-[500px]">
              <button type="button" aria-label="Play Coconoto story video" className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white text-[#8b5e3c] shadow-lg transition hover:scale-105">
                <span className="ml-1 text-3xl" aria-hidden="true">▶</span>
              </button>
            </div>
            <div className="space-y-6">
              <h2 className="font-sans text-4xl font-bold">Our STORY</h2>
              <p className="text-base leading-8">Born out of the need to tackle waste and inefficiency in the coconut industry, Coconoto began as a vision to merge sustainability with technology. What started as a simple observation seeing tons of coconut waste ending up in landfills and releasing harmful carbon became a mission to transform the entire coconut value chain.</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#efefef] px-6 py-16 sm:px-10 lg:px-[100px] lg:py-[107px]"><div className="mx-auto grid max-w-[1242px] gap-16 lg:grid-cols-2 lg:items-start"><div className="space-y-8 lg:pt-[42px]"><div className="space-y-6"><h2 className="font-montserrat text-4xl font-bold">Our Mission</h2><p className="max-w-xl text-base leading-8">We are committed to building a technology-enabled coconut economy that improves livelihoods, environmental sustainability &amp; creates opportunities. Through innovation and inclusive solutions, we aim to:</p></div><ul className="space-y-7">{missionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-[30px]"><span className="mt-1 h-8 w-8 shrink-0 bg-contain bg-center bg-no-repeat text-transparent" style={{ backgroundImage: `url(${missonDot})` }}>✦</span><span>{point}</span></li>)}</ul></div><div className="h-[360px] lg:h-[518px]"><ImageCard src={missionImage} alt="Hands planting young coconut trees" /></div></div><div className="mx-auto mt-28 grid max-w-[1242px] gap-16 lg:mt-[112px] lg:grid-cols-2 lg:items-start"><div className="order-2 h-[360px] lg:order-1 lg:h-[518px]"><ImageCard src={visionImage} alt="Cocoa beans held in hands" /></div><div className="order-1 space-y-8 lg:order-2 lg:pt-[45px]"><div className="space-y-6"><h2 className="font-montserrat text-4xl font-bold">Our Vision</h2><p className="text-base leading-8">Our vision is to create a sustainable, profitable, and inclusive coconut ecosystem that drives economic growth and environmental impact across Africa. We envision a future where:</p></div><ul className="space-y-7">{visionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-[30px]"><span className="mt-1 h-8 w-8 shrink-0 bg-contain bg-center bg-no-repeat text-transparent" style={{ backgroundImage: `url(${cocodot})` }}>◉</span><span>{point}</span></li>)}</ul></div></div></section>

          <section className="px-6 py-10 sm:px-10 lg:px-24 lg:py-14"><div className="mx-auto max-w-[845px] text-center"><h2 className="font-montserrat text-4xl font-bold">What we do</h2><p className="mt-4 text-base leading-7">We leverage technology and sustainable practices to transform the coconut value chain from production and processing to distribution and market access.</p></div><div className="relative mx-auto mt-10 grid max-w-[1240px] gap-5 lg:grid-cols-2">{services.map((service) => <article key={service.number} className="rounded-[10px] bg-[#8b5e3c] p-5 text-white sm:p-6"><div className="flex gap-4"><span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-white font-montserrat text-xl font-bold text-black">{service.number}</span><div><h3 className="text-lg font-bold">{service.title}</h3><p className="mt-1 text-base leading-6">{service.body}</p><ul className="mt-3 space-y-1 text-sm leading-6">{service.items.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></div></article>)}<div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white lg:block" aria-hidden="true" /></div></section>

          <section className="overflow-hidden pb-20 pt-4"><div className="mx-auto max-w-[1240px] px-6 text-center sm:px-10 lg:px-24"><h2 className="font-montserrat text-4xl font-bold">Meet the Team</h2><p className="mt-5 text-base">Meet our team of dedicated members who are committed to driving the development of Coconoto.</p></div><div ref={teamScrollerRef} className="mt-12 w-full cursor-grab touch-pan-y select-none overflow-hidden pb-6"><div ref={teamTrackRef} className="flex w-max gap-6 will-change-transform" style={{ transition: 'none' }}>{[...team, ...team, ...team].map((member, index) => <article key={`${member.name}-${index}`} className="w-[260px] shrink-0 overflow-hidden rounded-[10px]"><div className="h-[300px]"><ImageCard src={member.image} alt={member.name} /></div><div className="px-3 pt-5 text-center"><h3 className="font-montserrat text-lg font-bold">{member.name}</h3><p className="mt-1 text-sm">{member.role}</p></div></article>)}</div></div></section>

        <section className="bg-[#a77552] px-6 py-16 sm:px-10 lg:px-24 lg:py-20"><div className="mx-auto max-w-[700px] text-center"><h2 className="font-montserrat text-4xl font-bold text-[#f3efe8]">Our Social Impact</h2><p className="mt-5 text-base leading-7 text-[#f3efe8]">Meet our team of dedicated members who are committed to driving the development of Coconoto.</p></div><div className="mx-auto mt-10 flex max-w-[1050px] flex-wrap items-stretch justify-center gap-4"><div className="flex shrink-0 items-stretch gap-3"><article className="h-[300px] w-[280px] shrink-0 rounded-[18px] border border-[#d9cfc6] bg-[#f5f2f0] p-6 shadow-sm"><h3 className="font-montserrat text-3xl font-bold text-[#2d2018]">{impact[0].code}</h3><h4 className="mt-6 text-xl font-semibold text-[#2d2018]">{impact[0].title}</h4><ul className="mt-4 space-y-2 font-montserrat text-sm leading-6 text-[#2d2018]">{impact[0].items.map((item) => <li key={item}>• {item}</li>)}</ul></article><div className="flex w-[48px] shrink-0 items-center justify-center"><div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f1ece8] shadow-sm ring-1 ring-[#c2a58d]"><img src={cocodot} alt="" className="h-9 w-9 object-contain" /></div></div></div><div className="flex shrink-0 items-stretch gap-3"><article className="h-[300px] w-[280px] shrink-0 rounded-[18px] border border-[#d9cfc6] bg-[#f5f2f0] p-6 shadow-sm"><h3 className="font-montserrat text-3xl font-bold text-[#2d2018]">{impact[1].code}</h3><h4 className="mt-6 text-xl font-semibold text-[#2d2018]">{impact[1].title}</h4><ul className="mt-4 space-y-2 font-montserrat text-sm leading-6 text-[#2d2018]">{impact[1].items.map((item) => <li key={item}>• {item}</li>)}</ul></article><div className="flex w-[48px] shrink-0 items-center justify-center"><div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f1ece8] shadow-sm ring-1 ring-[#c2a58d]"><img src={cocodot} alt="" className="h-9 w-9 object-contain" /></div></div></div><div className="flex shrink-0 items-stretch"><article className="h-[300px] w-[280px] shrink-0 rounded-[18px] border border-[#d9cfc6] bg-[#f5f2f0] p-6 shadow-sm"><h3 className="font-montserrat text-3xl font-bold text-[#2d2018]">{impact[2].code}</h3><h4 className="mt-6 text-xl font-semibold text-[#2d2018]">{impact[2].title}</h4><ul className="mt-4 space-y-2 font-montserrat text-sm leading-6 text-[#2d2018]">{impact[2].items.map((item) => <li key={item}>• {item}</li>)}</ul></article></div></div></section>
      </main>
      <AboutFooter />
    </div>
  );
}

export default FigmaAbout;