import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin } from 'lucide-react';
import AboutNavbar from '../components/about/AboutNavbar';
import AboutFooter from '../components/about/AboutFooter';
import heroBg from '../assets/about/hero-bg.jpg';
import storyImage from '../assets/about/story-video.jpg';
import missionImage from '../assets/about/mission-hand.jpg';
import visionImage from '../assets/about/vision-cocoa.jpg';
import teamOne from '../assets/about/team-row.jpg';
import teamTwo from '../assets/team/enoch.jpeg';
import teamThree from '../assets/team/Jacob.jpg';
import teamFour from '../assets/team/Kehinde Elizabeth OMITOYIN.jpg';

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

const team = [
  { name: 'Shafiu Yushawu', role: 'Chief Executive Officer', image: teamOne },
  { name: 'ENOCH Bamigboye', role: 'Software Engineer', image: teamTwo },
  { name: 'Jacob O. Abiodun', role: 'Founder/CEO', image: teamThree, featured: true },
  { name: 'Kehinde Omitoyin', role: 'Finance Manager', image: teamFour },
];

const impact = [
  { code: 'SDG 5', title: 'Gender Equality', items: ['Employ more women', 'Integrate women into value chain', 'Improve performance of men in the industry'] },
  { code: 'SDG 8', title: 'Decent Work', items: ['Create more decent jobs', 'Contribute to coconut industry growth', 'Access to digital marketplace'] },
  { code: 'SDG 12', title: 'Responsible production', items: ['Improve production to reduce waste', 'Promote circularity', 'Increase revenue by 20%'] },
];

function ImageCard({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full rounded-[10px] object-cover ${className}`} />;
}

function FigmaAbout() {
  return (
    <div className="bg-white font-lora text-[#101010]">
      <AboutNavbar designHeight />
      <main>
        <section className="relative flex min-h-[792px] items-center justify-center overflow-hidden bg-[#142218] px-6 pb-20 pt-[108px] text-center text-white">
          <img src={heroBg} alt="Coconut trees and soil" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 max-w-[848px] space-y-7"><h1 className="font-montserrat text-4xl font-bold sm:text-5xl">About Us</h1><p className="text-base leading-[30px] text-white/95">Coconoto is a Smart Agritech company focused on creating technology, accessibility, and sustainability across the coconut value chain. We leverage innovative digital solutions to address challenges in coconut production, processing, distribution, and market access, while empowering farmers with better information, tools, and opportunities.</p><Link to="/buyer-signup" className="inline-flex items-center gap-2 rounded-[10px] bg-[#1ac212] px-10 py-3 font-semibold transition hover:bg-[#16a90f]">Register now <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </section>

        <section className="relative px-6 py-16 sm:px-10 lg:h-[616px] lg:px-0 lg:py-0">
          <div className="mx-auto grid max-w-[1340px] gap-10 lg:absolute lg:inset-y-0 lg:left-0 lg:right-0 lg:grid-cols-[768px_540px] lg:items-end lg:gap-8">
            <div className="relative h-[360px] overflow-hidden rounded-[10px] lg:h-[616px]">
              <img src={storyImage} alt="Coconoto team member working on a laptop" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[#8b5e3c]/20" />
              <button type="button" aria-label="Play Coconoto story video" className="absolute left-1/2 top-1/2 flex h-[98px] w-[98px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#8b5e3c] shadow-lg transition hover:scale-105">
                <span className="ml-1 text-3xl">▶</span>
              </button>
            </div>
            <div className="space-y-6 pb-0 lg:pb-12">
              <h2 className="font-sans text-4xl font-bold">Our STORY</h2>
              <p className="text-base leading-8">Born out of the need to tackle waste and inefficiency in the coconut industry, Coconoto began as a vision to merge sustainability with technology. What started as a simple observation seeing tons of coconut waste ending up in landfills and releasing harmful carbon became a mission to transform the entire coconut value chain.</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#efefef] px-6 py-16 sm:px-10 lg:px-[100px] lg:py-[107px]"><div className="mx-auto grid max-w-[1242px] gap-16 lg:grid-cols-2 lg:items-start"><div className="space-y-8 lg:pt-[42px]"><div className="space-y-6"><h2 className="font-montserrat text-4xl font-bold">Our Mission</h2><p className="max-w-xl text-base leading-8">We are committed to building a technology-enabled coconut economy that improves livelihoods, environmental sustainability &amp; creates opportunities. Through innovation and inclusive solutions, we aim to:</p></div><ul className="space-y-7">{missionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-[30px]"><span className="mt-1 text-2xl text-[#05897c]">✦</span><span>{point}</span></li>)}</ul></div><div className="h-[360px] lg:h-[518px]"><ImageCard src={missionImage} alt="Hands planting young coconut trees" /></div></div><div className="mx-auto mt-16 grid max-w-[1242px] gap-16 lg:mt-[80px] lg:grid-cols-2 lg:items-start"><div className="order-2 h-[360px] lg:order-1 lg:h-[518px]"><ImageCard src={visionImage} alt="Cocoa beans held in hands" /></div><div className="order-1 space-y-8 lg:order-2 lg:pt-[45px]"><div className="space-y-6"><h2 className="font-montserrat text-4xl font-bold">Our Vision</h2><p className="text-base leading-8">Our vision is to create a sustainable, profitable, and inclusive coconut ecosystem that drives economic growth and environmental impact across Africa. We envision a future where:</p></div><ul className="space-y-7">{visionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-[30px]"><span className="mt-1 text-2xl text-[#8b5e3c]">◉</span><span>{point}</span></li>)}</ul></div></div></section>

        <section className="px-6 py-20 sm:px-10 lg:px-24 lg:py-28"><div className="mx-auto max-w-[845px] text-center"><h2 className="font-montserrat text-4xl font-bold">What we do</h2><p className="mt-6 text-base leading-8">We leverage technology and sustainable practices to transform the coconut value chain from production and processing to distribution and market access.</p></div><div className="mx-auto mt-14 grid max-w-[1240px] gap-7 lg:grid-cols-2">{services.map((service) => <article key={service.number} className="rounded-[20px] bg-[#8b5e3c] p-8 text-white sm:p-10"><div className="flex gap-6"><span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-white font-montserrat text-2xl font-bold text-black">{service.number}</span><div><h3 className="text-xl font-bold">{service.title}</h3><p className="mt-2 text-base leading-7">{service.body}</p><ul className="mt-3 space-y-1 text-base leading-7">{service.items.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></div></article>)}</div></section>

        <section className="overflow-hidden px-6 pb-20 pt-4 sm:px-10 lg:px-24"><div className="mx-auto max-w-[1240px] text-center"><h2 className="font-montserrat text-4xl font-bold">Meet the Team</h2><p className="mt-5 text-base">Meet our team of dedicated members who are committed to driving the development of Coconoto.</p></div><div className="mx-auto mt-12 grid max-w-[1180px] gap-8 sm:grid-cols-2 lg:grid-cols-4">{team.map((member) => <article key={member.name} className={`overflow-hidden rounded-[10px] ${member.featured ? 'border border-[#c9c9c9] pb-6' : ''}`}><div className={`h-[300px] ${member.featured ? 'h-[360px]' : ''}`}><ImageCard src={member.image} alt={member.name} /></div><div className="px-3 pt-5 text-center"><h3 className="font-montserrat text-lg font-bold">{member.name}</h3><p className="mt-1 text-sm">{member.role}</p>{member.featured && <><a href="mailto:LBhconnect@gmail.com" className="mt-4 block text-sm text-[#05897c] underline">LBhconnect@gmail.com</a><p className="mt-2 text-sm">+233 45 678 0972</p><a href="#linkedin" aria-label={`${member.name} on LinkedIn`} className="mt-4 inline-flex text-[#05897c]"><Linkedin size={22} /></a></>}</div></article>)}</div></section>

        <section className="bg-[#fafafa] px-6 py-20 sm:px-10 lg:px-24 lg:py-28"><div className="mx-auto max-w-[700px] text-center"><h2 className="font-montserrat text-4xl font-bold">Our Social Impact</h2><p className="mt-5 text-base leading-7">Coconoto aligns with the UN Sustainable Development Goals (SDGs 5, 8 &amp; 12), promoting gender equality, decent work, and responsible production.</p></div><div className="mx-auto mt-14 grid max-w-[1158px] gap-8 lg:grid-cols-3">{impact.map((goal) => <article key={goal.code} className="rounded-[10px] border border-[#d8d8d8] bg-white p-8"><h3 className="font-montserrat text-3xl font-bold">{goal.code}</h3><h4 className="mt-8 text-xl font-semibold">{goal.title}</h4><ul className="mt-5 space-y-2 font-montserrat text-sm leading-6">{goal.items.map((item) => <li key={item}>• {item}</li>)}</ul></article>)}</div></section>
      </main>
      <AboutFooter />
    </div>
  );
}

export default FigmaAbout;