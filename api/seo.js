import { createClient } from '@supabase/supabase-js';

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
 * Fetch the built SPA shell and serve it, optionally with rewritten tags.
 * `headReplacer` is omitted for the plain fallback.
 */
async function serveShell(req, res, headReplacer, fallbackPath = '/') {
  const origin = getOrigin(req);
  try {
    const shellRes = await fetch(`${origin}/index.html`);
    let html = await shellRes.text();
    if (headReplacer) html = headReplacer(html);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('seo shell fetch error:', err);
    res.setHeader('Location', fallbackPath);
    return res.status(302).end();
  }
}

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

  return serveShell(req, res, (html) => injectHead(html, metaBlock), path);
}

// ─── Per-post meta for the blog ───────────────────────────────────────────────

async function handleBlogMeta(req, res) {
  const blogId = req.query.id || req.query.blogId;

  if (!supabase || !blogId) return serveShell(req, res, null, `/blog/${blogId || ''}`);

  try {
    const { data: allBlogs, error: listError } = await supabase
      .from('mern_blogs')
      .select('blog_id, title, slug, des, banner, published')
      .eq('published', true)
      .order('published_at', { ascending: false });

    let blog = null;
    if (!listError && allBlogs) {
      blog = allBlogs.find((item) => matchBlogUrlParam(item, blogId)) || null;
    }

    if (!blog) {
      const { data: legacyBlog, error } = await supabase
        .from('mern_blogs')
        .select('blog_id, title, slug, des, banner, published')
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

    return serveShell(req, res, (html) => injectHead(html, metaBlock), pageUrl);
  } catch (err) {
    console.error('blog-meta error:', err);
    return serveShell(req, res, null, `/blog/${blogId}`);
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

  return res.status(400).json({ error: 'Missing ?action=sitemap|page-meta|blog-meta' });
}
