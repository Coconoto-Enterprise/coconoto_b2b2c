import { createClient } from '@supabase/supabase-js';
import { LEGAL_PAGES, LEGAL_UPDATED } from './_legal-content.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const SITE_URL = (process.env.SITE_URL || 'https://www.coconoto.africa').replace(/\/$/, '');
const DEFAULT_OG_IMAGE = '/Icon_green.png';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const escapeXml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const escapeHtml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const slugifyBlogTitle = (title = '') => String(title || '')
  .trim()
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)
  .replace(/-+$/g, '');

const buildBlogUrlSlug = (blog = {}) => {
  const storedSlug = String(blog.slug || '').trim();
  if (storedSlug) return storedSlug;
  const baseTitle = slugifyBlogTitle(blog.title || 'blog-post');
  const blogId = String(blog.blog_id || blog.id || '').trim();

  if (!baseTitle) return blogId ? blogId.slice(0, 12) : 'blog-post';
  if (!blogId) return baseTitle;

  const shortId = blogId.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 6);
  return shortId ? `${baseTitle}-${shortId}` : baseTitle;
};

const matchBlogUrlParam = (blog = {}, param = '') => {
  const value = String(param || '').trim();
  if (!value) return false;
  const blogId = String(blog.blog_id || blog.id || '').trim();
  return value === buildBlogUrlSlug(blog) || value === blogId;
};

// ─── The public page map ──────────────────────────────────────────────────────
//
// SINGLE SOURCE OF TRUTH for the crawlable pages. Both the sitemap and the
// per-route <head> injection read from this table, so a page can never appear in
// one and be missing from the other — which is exactly how /contact and the
// legal pages ended up absent from the sitemap before.
//
// Only genuinely public content belongs here. Login, dashboards, /figma/*
// (legacy aliases), /profile, /vintage*, /tweetit* and the error pages are
// deliberately excluded — they are disallowed in public/robots.txt and carry no
// SEO value.
//
// The three business-unit pages are listed under the name of the unit, not the
// generic noun they used to sit under: /cocotech, /cococycle-hub and
// /cococonnect. The old /services, /product and /marketplace URLs still resolve
// (they 301 forward in the SPA), but they are deliberately NOT listed here — a
// sitemap should advertise one canonical URL per page, and listing a redirect
// makes Google crawl the same content twice.
//
// `title` and `description` are what Google shows in results. Edit them here and
// both the sitemap and the rendered <head> follow.
const PUBLIC_PAGES = {
  '/': {
    title: "Coconoto Africa - Leading B2B2C Platform for Africa's Coconut Value Chain",
    description:
      "Coconoto is Africa's B2B2C platform for the coconut value chain — connecting farmers, processors and buyers, with machines, services and a marketplace turning coconut waste into wealth.",
    changefreq: 'weekly',
    priority: '1.0',
  },
  '/about': {
    title: 'About Coconoto Africa | Coconut Value Chain Innovators',
    description:
      'Who we are and why we build for the coconut value chain — our mission to turn every part of the coconut into value for farmers, processors and communities across Africa.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  '/cocotech': {
    title: 'Coconut Processing Equipment & Services | Coconoto Africa',
    description:
      'Coconut deshellers, dehuskers and milk extractors engineered for commercial processing, plus production management, efficiency improvement and staff training.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  '/cococycle-hub': {
    title: 'Eco-Friendly Coconut Products | CocoCycle Hub',
    description:
      'Cocopeat, coconut fibre, cocopot and biochar made from every part of the coconut — sustainable products from a circular coconut economy.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  '/cococonnect': {
    title: 'Coconut Marketplace | Buy and Sell | Coconoto Africa',
    description:
      'Buy and sell coconuts, coconut products and processing equipment across Africa on the Coconoto marketplace.',
    changefreq: 'daily',
    priority: '0.8',
  },
  // Coco-connect shop — the Figma Desktop 41 build. `/shop/product/:slug` is
  // deliberately absent: its canonical has to be per-product, and the catalogue
  // is still placeholder data, so those pages should not be advertised yet.
  '/shop': {
    title: 'Shop Fresh Farm Produce & Coconut Products | Coco-connect',
    description:
      'Browse fresh produce, coconut products and farm inputs on Coco-connect — the Coconoto marketplace that connects you directly to what you need.',
    changefreq: 'daily',
    priority: '0.8',
  },
  '/blog': {
    title: 'Coconut Industry Insights & News | Coconoto Africa Blog',
    description:
      'Guides, news and analysis on coconut farming, processing technology and the coconut value chain in Nigeria and across Africa.',
    changefreq: 'daily',
    priority: '0.8',
  },
  '/contact': {
    title: 'Contact Coconoto Africa',
    description:
      'Get in touch with Coconoto Africa about coconut processing equipment, products, partnerships and support.',
    changefreq: 'yearly',
    priority: '0.6',
  },
  '/help-center': {
    title: 'Help Center | Coconoto Africa',
    description:
      'Answers to common questions about ordering, delivery, machines and using the Coconoto Africa platform.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Coconoto Africa',
    description: 'How Coconoto Africa collects, uses, stores and protects your personal data.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Coconoto Africa',
    description:
      'The terms governing your use of the Coconoto Africa platform, marketplace and coconut processing services.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Coconoto Africa',
    description: 'How Coconoto Africa uses cookies and similar technologies on its websites.',
    changefreq: 'yearly',
    priority: '0.3',
  },
};

const STATIC_ROUTES = Object.entries(PUBLIC_PAGES).map(([path, cfg]) => ({ path, ...cfg }));

const normalizePath = (raw = '') => {
  let p = String(Array.isArray(raw) ? raw[0] : raw || '').trim();
  if (!p) return '/';
  p = p.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
};

const getOrigin = (req) => {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
};

// ─── Sitemap ──────────────────────────────────────────────────────────────────

const urlEntry = ({ loc, lastmod, changefreq, priority }) => {
  const parts = [`    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod)   parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority)  parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
};

async function handleSitemap(req, res) {
  const urls = STATIC_ROUTES.map(r =>
    urlEntry({ loc: `${SITE_URL}${r.path}`, changefreq: r.changefreq, priority: r.priority })
  );

  if (supabase) {
    const { data: blogs, error } = await supabase
      .from('mern_blogs')
      .select('blog_id, title, slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && blogs) {
      for (const blog of blogs) {
        const lastmod = blog.updated_at || blog.published_at;
        urls.push(urlEntry({
          loc: `${SITE_URL}/blog/${buildBlogUrlSlug(blog)}`,
          lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
          changefreq: 'weekly',
          priority: '0.9',
        }));
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(xml);
}

// ─── <head> injection ─────────────────────────────────────────────────────────

/**
 * Build the tags that replace whatever the SPA shell shipped with. Every value is
 * escaped — titles and descriptions come from the database for blog posts, so an
 * unescaped quote there would break out of the attribute.
 */
const renderMetaBlock = ({ title, description, url, image, type = 'website' }) => {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeUrl = escapeHtml(url);
  const safeImage = escapeHtml(image);
  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Coconoto Africa" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />`;
};

/**
 * Strip the shell's own title/description/canonical/social tags and put ours in
 * their place. The canonical is the important one: without this every route
 * inherits the homepage canonical and Google treats it as a duplicate.
 */
const injectHead = (html, metaBlock) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace('</head>', `${metaBlock}\n  </head>`);

/**
 * A visually-hidden navigation block that gives crawlers real <a href> links to
 * follow. Without this, the HTML shell contains zero internal links — a crawler
 * that does not execute JavaScript sees a dead end. The block is hidden from
 * human visitors (CSS clips it to 1px) and React overwrites it on mount.
 */
const SEO_NAV_HTML = `
    <nav aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/cocotech">CocoTech — Processing Equipment</a>
      <a href="/cococycle-hub">CocoCycle Hub — Eco-Friendly Products</a>
      <a href="/cococonnect">CocoConnect — Marketplace</a>
      <a href="/shop">Shop</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
      <a href="/help-center">Help Center</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-of-service">Terms of Service</a>
    </nav>`;

const injectSeoNav = (html) =>
  html.replace(/<body([^>]*)>/, `<body$1>${SEO_NAV_HTML}`);

/**
 * Fetch the built SPA shell and serve it, optionally with rewritten tags.
 * `headReplacer` is omitted for the plain fallback. The SEO nav is always
 * injected so every page has crawlable internal links.
 */
async function serveShell(req, res, headReplacer, fallbackPath = '/') {
  const origin = getOrigin(req);
  try {
    const shellRes = await fetch(`${origin}/index.html`);
    let html = await shellRes.text();
    if (headReplacer) html = headReplacer(html);
    html = injectSeoNav(html);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    // Explicitly indexable — the catch-all /index.html carries noindex, but
    // these pages are real content served through the SEO API.
    res.setHeader('X-Robots-Tag', 'index, follow');
    return res.status(200).send(html);
  } catch (err) {
    console.error('seo shell fetch error:', err);
    res.setHeader('Location', fallbackPath);
    return res.status(302).end();
  }
}

// ─── Legal body (server-rendered) ─────────────────────────────────────────────
//
// The three legal pages used to ship an empty <div id="root"> — every word was
// rendered by React after hydration, so a client that does not execute
// JavaScript saw ~32 characters of text. Google's OAuth branding review rejected
// the privacy policy for precisely that reason, and the same emptiness makes the
// pages invisible to search crawlers.
//
// Rendering the body into the shell puts the real text in the HTML response.
// React then replaces it with the designed version on mount — no hydrateRoot, so
// there is no markup mismatch to reconcile.

const renderInline = (text = '') =>
  escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const renderBlock = (block = {}) => {
  if (block.p) return `<p>${renderInline(block.p)}</p>`;
  if (block.h3) return `<h3>${escapeHtml(block.h3)}</h3>`;
  if (block.ul) return `<ul>${block.ul.map((i) => `<li>${renderInline(i)}</li>`).join('')}</ul>`;
  if (block.note) return `<div class="legal-note">${renderInline(block.note)}</div>`;
  if (block.dl) {
    const rows = block.dl
      .map(([term, value]) => `<div><dt>${escapeHtml(term)}</dt><dd>${renderInline(value)}</dd></div>`)
      .join('');
    return `<dl class="legal-dl">${rows}</dl>`;
  }
  return '';
};

const renderLegalBody = (page) => {
  const sections = page.sections
    .map((section) => {
      const inner = section.blocks.map(renderBlock).join('\n');
      return `<section>\n<h2>${escapeHtml(section.heading)}</h2>\n${inner}\n</section>`;
    })
    .join('\n');

  const intro = page.intro ? `<p>${renderInline(page.intro)}</p>` : '';

  return `<article class="legal-doc"><div class="legal-card">` +
    `<h1>${escapeHtml(page.heading)}</h1>` +
    `<p class="legal-meta">Last updated: ${escapeHtml(LEGAL_UPDATED)}</p>` +
    intro + sections +
    `</div></article>`;
};

/**
 * Scoped to `#root` so these rules win against Tailwind's preflight (which
 * strips heading sizes and list markers) but stop applying the moment React
 * replaces the children with its own Tailwind-styled markup.
 */
const LEGAL_STYLES = `
    <style>
      #root .legal-doc{background:#f9fafb;padding:48px 24px;color:#1f2937;line-height:1.7;
        font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
      #root .legal-card{max-width:768px;margin:0 auto;background:#fff;border-radius:12px;
        box-shadow:0 1px 3px rgba(0,0,0,.1);padding:40px}
      #root .legal-card h1{font-size:30px;font-weight:700;text-align:center;margin:0 0 8px;color:#111827;line-height:1.25}
      #root .legal-meta{text-align:center;font-size:13px;color:#6b7280;margin:0 0 32px}
      #root .legal-card h2{font-size:22px;font-weight:600;margin:32px 0 16px;color:#111827;line-height:1.35}
      #root .legal-card h3{font-size:17px;font-weight:600;margin:20px 0 10px;color:#1f2937}
      #root .legal-card p{margin:0 0 14px;color:#374151}
      #root .legal-card ul{margin:0 0 14px;padding-left:24px;list-style:disc}
      #root .legal-card li{margin:0 0 8px;color:#374151}
      #root .legal-card strong{font-weight:600;color:#111827}
      #root .legal-note{background:#f0f9ff;border-left:4px solid #0ea5e9;padding:16px;border-radius:8px;margin:0 0 14px}
      #root .legal-dl{background:#f3f4f6;padding:20px;border-radius:10px;margin:0 0 14px}
      #root .legal-dl div{display:flex;gap:8px;margin:0 0 6px;font-size:14px}
      #root .legal-dl dt{font-weight:600;color:#111827;min-width:90px;margin:0}
      #root .legal-dl dd{margin:0;color:#374151}
      @media(max-width:640px){
        #root .legal-doc{padding:24px 16px}
        #root .legal-card{padding:24px}
        #root .legal-card h1{font-size:24px}
        #root .legal-card h2{font-size:19px}
      }
    </style>`;

const injectLegalStyles = (html) => html.replace('</head>', `${LEGAL_STYLES}\n  </head>`);

/** Put the rendered article inside the SPA mount point. */
const injectBody = (html, bodyHtml) => {
  const emptyRoot = /<div id="root">\s*<\/div>/i;
  if (emptyRoot.test(html)) return html.replace(emptyRoot, `<div id="root">${bodyHtml}</div>`);
  // Shell shape changed — fall back to appending, which still gives crawlers the text.
  return html.replace('</body>', `${bodyHtml}\n  </body>`);
};

// ─── Server-rendered page bodies (SEO) ────────────────────────────────────────
//
// Every page that is not a legal page used to ship `<div id="root"></div>` — an
// empty body. Google deprioritised them ("Discovered – currently not indexed")
// because the crawler saw a page with a correct title but zero body text. The
// bodies below put real, keyword-rich content into the HTML response so Google
// has something to index. React replaces all of it on mount — no hydrateRoot, so
// there is no markup mismatch to reconcile.
//
// The styling reuses the legal-doc / legal-card shell so the pre-hydration view
// is not jarring. Each page provides an h1, intro paragraph, and section
// headings with real text — enough for Google to understand the page without
// executing JavaScript.

const PAGE_STYLES = LEGAL_STYLES;

/**
 * Server-rendered body content for each public page. The text mirrors what the
 * React component renders, but is intentionally condensed — headings, intro
 * paragraphs, and key bullet points. The full designed experience loads when
 * React hydrates.
 */
const PAGE_BODIES = {
  '/about': `
    <article class="legal-doc"><div class="legal-card">
      <h1>About Coconoto Africa</h1>
      <p>Coconoto is a Smart Agritech company focused on creating technology, accessibility, and sustainability across the coconut value chain. We connect farmers, processors and buyers across Africa, turning coconut waste into wealth through equipment, products and a marketplace.</p>
      <section>
        <h2>Our Mission</h2>
        <p>To empower coconut farmers and processors with the technology, market access and knowledge needed to build profitable and sustainable businesses.</p>
      </section>
      <section>
        <h2>Our Vision</h2>
        <p>To become Africa's leading platform for the coconut value chain, where every part of the coconut creates value for farmers, processors and communities.</p>
      </section>
      <section>
        <h2>What We Do</h2>
        <ul>
          <li><strong>CocoTech</strong> — Coconut processing equipment including deshellers, dehuskers and milk extractors, plus production management and staff training.</li>
          <li><strong>CocoCycle Hub</strong> — Eco-friendly coconut products: cocopeat, coconut fibre, cocopot and biochar made from every part of the coconut.</li>
          <li><strong>CocoConnect</strong> — A marketplace to buy and sell coconuts, coconut products and processing equipment across Africa.</li>
        </ul>
      </section>
      <section>
        <h2>Our Social Impact</h2>
        <p>We contribute to UN Sustainable Development Goals: SDG 5 (gender equality), SDG 8 (decent work and economic growth), and SDG 12 (responsible consumption and production).</p>
      </section>
    </div></article>`,

  '/cocotech': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Coconut Processing Equipment &amp; Services</h1>
      <p>We design, fabricate, and sell innovative coconut processing machines for the entire value chain. Our equipment is engineered for commercial processing operations in Nigeria and across Africa, built to be durable, efficient and safe.</p>
      <section>
        <h2>Processing Equipment</h2>
        <ul>
          <li><strong>Coconut Desheller</strong> — Removes the coconut shell with minimal damage to the meat, designed for high-throughput processing.</li>
          <li><strong>Coconut Dehusker</strong> — Strips the fibrous husk from the coconut quickly and safely, reducing manual labour and injury risk.</li>
          <li><strong>Coconut Milk Extractor (Auto)</strong> — Automated extraction of fresh coconut milk with high yield and consistent quality.</li>
          <li><strong>Coconut Milk Extractor (Manual)</strong> — A cost-effective manual option for smaller operations and startups.</li>
        </ul>
      </section>
      <section>
        <h2>Production Management, Made Simple</h2>
        <ul>
          <li><strong>Process Optimization</strong> — We analyse your production line and recommend improvements to increase throughput and reduce waste.</li>
          <li><strong>Efficiency Improvement</strong> — Training and workflow redesign to help your team get more from existing equipment.</li>
          <li><strong>Staff Training</strong> — Hands-on training for your operators on safe and efficient machine use.</li>
          <li><strong>Quality Assurance</strong> — Systems and protocols to ensure consistent product quality across every batch.</li>
        </ul>
      </section>
    </div></article>`,

  '/cococycle-hub': `
    <article class="legal-doc"><div class="legal-card">
      <h1>CocoCycle Hub</h1>
      <p>CocoCycle Hub transforms every part of the coconut into value. Instead of burning or burying coconut husks and shells, we turn them into products that farmers, growers and businesses actually need.</p>
      <section>
        <h2>Eco-Friendly Coconut Products</h2>
        <ul>
          <li><strong>Cocopeat</strong> — A soilless growing medium made from coconut husk fibre. High water retention, excellent aeration, and ideal for hydroponic farming and seed starting.</li>
          <li><strong>Coconut Fibre (Cocofiber)</strong> — Durable natural fibre for erosion control, mulch, rope, mats and upholstery. Sells by the bag or by the ton.</li>
          <li><strong>Cocopot</strong> — Biodegradable plant pots made from coconut husk. Plastic-free, compostable and perfect for nurseries and transplanting.</li>
          <li><strong>Biochar</strong> — Carbon-rich soil amendment produced from coconut shells. Improves soil fertility, retains water and sequesters carbon for centuries.</li>
        </ul>
      </section>
      <section>
        <h2>Coco DrinkEat: Event Experience</h2>
        <p>We bring fresh coconuts to your events with trained service teams, eco-friendly presentation and custom serving stations. Perfect for weddings, corporate events and festivals.</p>
      </section>
    </div></article>`,

  '/cococonnect': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Coconut Marketplace — Buy and Sell on Coconoto</h1>
      <p>Discover quality coconut products direct from verified farmers and processors across the value chain. Coconoto's marketplace connects buyers and sellers across Africa with nationwide delivery and quality guarantees.</p>
      <section>
        <h2>Why Buy on Coconoto</h2>
        <ul>
          <li><strong>Verified vendors</strong> — Every seller is vetted to ensure product quality and reliability.</li>
          <li><strong>Nationwide delivery</strong> — We ship coconut products and equipment across Nigeria.</li>
          <li><strong>Quality guaranteed</strong> — If a product doesn't meet expectations, our support team will make it right.</li>
        </ul>
      </section>
      <section>
        <h2>Sell on Coconoto</h2>
        <p>Are you a coconut farmer, processor or equipment manufacturer? List your products on Coconoto and reach buyers across Africa. Create a vendor account to start selling.</p>
      </section>
      <section>
        <h2>Product Categories</h2>
        <ul>
          <li>Fresh coconuts and coconut meat</li>
          <li>Cocopeat, cocofiber and biochar</li>
          <li>Coconut oil, milk and water</li>
          <li>Processing equipment and machines</li>
        </ul>
      </section>
    </div></article>`,

  '/shop': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Coco-connect Shop</h1>
      <p>Welcome to our marketplace where we connect you directly to what you need. Browse fresh produce, coconut products and farm inputs from verified vendors.</p>
      <section>
        <h2>Categories</h2>
        <ul>
          <li>Fresh farm produce</li>
          <li>Coconut products — oil, milk, water, snacks</li>
          <li>Cocopeat and growing media</li>
          <li>Farm inputs and equipment</li>
        </ul>
      </section>
    </div></article>`,

  '/blog': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Coconoto Blog</h1>
      <p>Insights and stories from our community. Guides, news and analysis on coconut farming, processing technology and the coconut value chain in Nigeria and across Africa.</p>
      <section>
        <h2>Topics We Cover</h2>
        <ul>
          <li>Coconut farming and agricultural practices</li>
          <li>Processing technology and equipment</li>
          <li>Cocopeat, cocofiber and sustainable products</li>
          <li>Market trends and industry insights</li>
        </ul>
      </section>
    </div></article>`,

  '/contact': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Contact Coconoto Africa</h1>
      <p>Have questions, ideas, or want to learn more about what we do? Get in touch with our team today.</p>
      <section>
        <h2>Contact Information</h2>
        <ul>
          <li><strong>Email:</strong> coconotoenterprise@gmail.com</li>
          <li><strong>Phone:</strong> +234 813 777 5689</li>
          <li><strong>Address:</strong> No 67. Cele estate, Mowokekere, Ikorodu, Lagos, Nigeria</li>
        </ul>
      </section>
      <section>
        <h2>Send Us a Message</h2>
        <p>Fill out our contact form and our services team will get back to you. Whether you're asking about processing equipment, coconut products, partnerships or support, we're here to help.</p>
      </section>
    </div></article>`,

  '/help-center': `
    <article class="legal-doc"><div class="legal-card">
      <h1>How Can We Help You?</h1>
      <p>Find answers to common questions about ordering, delivery, machines and using the Coconoto Africa platform. Our support team is available 24/7 to assist you.</p>
      <section>
        <h2>Getting Started</h2>
        <ul>
          <li><strong>Account Setup</strong> — How to create and verify your account.</li>
          <li><strong>Platform Overview</strong> — A guide to navigating the Coconoto platform.</li>
          <li><strong>Trading Basics</strong> — How buying and selling works on the marketplace.</li>
        </ul>
      </section>
      <section>
        <h2>Trading &amp; Transactions</h2>
        <ul>
          <li><strong>Making Offers</strong> — How to make and receive offers.</li>
          <li><strong>Payment Methods</strong> — Accepted payment options and how payments work.</li>
          <li><strong>Escrow Service</strong> — How our escrow protects both buyers and sellers.</li>
        </ul>
      </section>
      <section>
        <h2>Documentation</h2>
        <ul>
          <li><strong>Required Documents</strong> — What you need to verify your account.</li>
          <li><strong>Verification Process</strong> — Step-by-step guide to getting verified.</li>
          <li><strong>Trade Agreements</strong> — Understanding your trade terms and conditions.</li>
        </ul>
      </section>
      <section>
        <h2>Still Need Help?</h2>
        <p>If you can't find the answer you're looking for, contact our support team at coconotoenterprise@gmail.com or call +234 813 777 5689. We're available 24/7.</p>
      </section>
    </div></article>`,

  '/': `
    <article class="legal-doc"><div class="legal-card">
      <h1>Coconoto Africa — B2B2C Platform for Africa's Coconut Value Chain</h1>
      <p>Coconoto is Africa's B2B2C platform for the coconut value chain — connecting farmers, processors and buyers with machines, services and a marketplace that turns coconut waste into wealth.</p>
      <section>
        <h2>What Coconoto Offers</h2>
        <ul>
          <li><strong>CocoTech</strong> — Coconut processing equipment: deshellers, dehuskers, milk extractors, plus production management and staff training.</li>
          <li><strong>CocoCycle Hub</strong> — Eco-friendly coconut products: cocopeat, coconut fibre, cocopot and biochar from a circular coconut economy.</li>
          <li><strong>CocoConnect</strong> — A marketplace to buy and sell coconuts, coconut products and processing equipment across Africa.</li>
        </ul>
      </section>
      <section>
        <h2>Serving Africa's Coconut Industry</h2>
        <p>From farmers in Lagos to processors in the Niger Delta, Coconoto builds the technology and market connections that make every part of the coconut valuable. We turn husks into cocopeat, shells into biochar, and waste into income.</p>
      </section>
    </div></article>`,
};

// ─── Blog body rendering (EditorJS blocks → HTML) ─────────────────────────────

/**
 * Convert EditorJS content blocks to server-rendered HTML. This mirrors the
 * client-side rendering in BlogDetail.tsx but produces static HTML for crawlers.
 * Only text-bearing block types are handled — images and embeds are skipped
 * because they add no SEO value without captions.
 */
const stripHtml = (s = '') => String(s).replace(/<[^>]*>/g, '');

const renderEditorJsBlock = (block = {}) => {
  const data = block.data || {};
  switch (block.type) {
    case 'header': {
      const level = Math.min(Math.max(data.level || 2, 1), 6);
      return `<h${level}>${escapeHtml(stripHtml(data.text))}</h${level}>`;
    }
    case 'paragraph':
      return `<p>${escapeHtml(stripHtml(data.text))}</p>`;
    case 'list': {
      const tag = data.style === 'ordered' ? 'ol' : 'ul';
      const items = (data.items || [])
        .map((item) => {
          const text = typeof item === 'string' ? item : (item.content || item.text || '');
          return `<li>${escapeHtml(stripHtml(text))}</li>`;
        })
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'quote':
      return `<blockquote><p>${escapeHtml(stripHtml(data.text))}</p>` +
        (data.caption ? `<footer>— ${escapeHtml(stripHtml(data.caption))}</footer>` : '') +
        `</blockquote>`;
    case 'code':
      return `<pre><code>${escapeHtml(data.code || '')}</code></pre>`;
    case 'image':
      return data.caption
        ? `<figure><figcaption>${escapeHtml(stripHtml(data.caption))}</figcaption></figure>`
        : '';
    case 'delimiter':
      return '<hr/>';
    default:
      return '';
  }
};

const renderBlogBody = (blog) => {
  const blocks = (blog.content || []).map(renderEditorJsBlock).filter(Boolean).join('\n');
  const author = blog.blog_authors?.fullname || blog.blog_authors?.username || '';

  return `<article class="legal-doc"><div class="legal-card">` +
    `<h1>${escapeHtml(blog.title)}</h1>` +
    (blog.des ? `<p>${escapeHtml(blog.des)}</p>` : '') +
    (author ? `<p class="legal-meta">By ${escapeHtml(author)}</p>` : '') +
    (blocks || '<p>This article is loading.</p>') +
    `</div></article>`;
};

// ─── Per-route meta for the static pages ──────────────────────────────────────

async function handlePageMeta(req, res) {
  const path = normalizePath(req.query.path);
  const page = PUBLIC_PAGES[path];

  // Unknown path — serve the untouched shell rather than inventing metadata.
  if (!page) return serveShell(req, res, null, path);

  // The canonical points at SITE_URL, NOT the request host. Non-www already 308s
  // to www, but preview/branch deployments (`*.vercel.app`) and any other alias
  // would otherwise emit a self-referencing canonical on a second hostname,
  // which is duplicate content. A canonical is meant to name the one true URL.
  const url = `${SITE_URL}${path}`;
  const metaBlock = renderMetaBlock({
    title: page.title,
    description: page.description,
    url,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    type: 'website',
  });

  // Build the transform: head injection + body injection.
  // Legal pages get their own structured body; other public pages get
  // pre-rendered SEO bodies; the homepage gets a summary body.
  const legal = LEGAL_PAGES[path];
  const pageBody = PAGE_BODIES[path];

  const transform = (html) => {
    let out = injectHead(html, metaBlock);
    if (legal) {
      out = injectLegalStyles(out);
      out = injectBody(out, renderLegalBody(legal));
    } else if (pageBody) {
      out = injectLegalStyles(out);
      out = injectBody(out, pageBody);
    }
    return out;
  };

  return serveShell(req, res, transform, path);
}

// ─── Per-post meta for the blog ───────────────────────────────────────────────

async function handleBlogMeta(req, res) {
  const blogId = req.query.id || req.query.blogId;

  if (!supabase || !blogId) return serveShell(req, res, null, `/blog/${blogId || ''}`);

  try {
    const { data: allBlogs, error: listError } = await supabase
      .from('mern_blogs')
      .select('blog_id, title, slug, des, banner, published, content')
      .eq('published', true)
      .order('published_at', { ascending: false });

    let blog = null;
    if (!listError && allBlogs) {
      blog = allBlogs.find((item) => matchBlogUrlParam(item, blogId)) || null;
    }

    if (!blog) {
      const { data: legacyBlog, error } = await supabase
        .from('mern_blogs')
        .select('blog_id, title, slug, des, banner, published, content')
        .eq('blog_id', blogId)
        .eq('published', true)
        .single();
      blog = legacyBlog || null;
      if (error && error.code !== 'PGRST116') console.error('blog-meta lookup error:', error);
    }

    if (!blog) return serveShell(req, res, null, `/blog/${blogId}`);

    // Same reasoning as handlePageMeta — canonicalise onto SITE_URL.
    const pageUrl = `${SITE_URL}/blog/${buildBlogUrlSlug(blog)}`;
    const metaBlock = renderMetaBlock({
      title: `${blog.title} | Coconoto Africa`,
      description: (blog.des || blog.title || '').slice(0, 160),
      url: pageUrl,
      image: blog.banner || `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      type: 'article',
    });

    // Server-render the blog body from EditorJS content blocks so Google sees
    // the actual article text, not an empty div.
    const transform = (html) => {
      let out = injectHead(html, metaBlock);
      out = injectLegalStyles(out);
      out = injectBody(out, renderBlogBody(blog));
      return out;
    };

    return serveShell(req, res, transform, pageUrl);
  } catch (err) {
    console.error('blog-meta error:', err);
    return serveShell(req, res, null, `/blog/${blogId}`);
  }
}

// ─── 404 handler (soft-404 fix) ───────────────────────────────────────────────
//
// The catch-all rewrite `/(.*)` → `/index.html` makes every unknown URL return
// HTTP 200, which Google treats as a soft-404. This handler serves the SPA shell
// (so human visitors see the React NotFound component) but with a real 404 status
// and X-Robots-Tag: noindex so Google stops indexing junk URLs.

async function handleNotFound(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  const origin = getOrigin(req);
  try {
    const shellRes = await fetch(`${origin}/index.html`);
    let html = await shellRes.text();
    html = injectSeoNav(html);
    return res.status(404).send(html);
  } catch (err) {
    return res.status(404).send('<!DOCTYPE html><html><head><title>Page Not Found</title></head><body><h1>404 — Page Not Found</h1></body></html>');
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;

  if (action === 'sitemap') return handleSitemap(req, res);
  if (action === 'page-meta') return handlePageMeta(req, res);
  if (action === 'blog-meta') return handleBlogMeta(req, res);
  if (action === 'not-found') return handleNotFound(req, res);

  return res.status(400).json({ error: 'Missing ?action=sitemap|page-meta|blog-meta|not-found' });
}
