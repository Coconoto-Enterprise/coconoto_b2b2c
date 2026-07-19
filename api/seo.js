import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const SITE_URL = (process.env.SITE_URL || 'https://www.coconoto.africa').replace(/\/$/, '');

// ─── Shared helpers ───────────────────────────────────────────────────────────

const escapeXml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const escapeHtml = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ─── Sitemap ──────────────────────────────────────────────────────────────────

const STATIC_ROUTES = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',      changefreq: 'monthly', priority: '0.7' },
  { path: '/services',   changefreq: 'monthly', priority: '0.7' },
  { path: '/product',    changefreq: 'monthly', priority: '0.7' },
  { path: '/marketplace',changefreq: 'daily',   priority: '0.8' },
  { path: '/blog',       changefreq: 'daily',   priority: '0.8' },
];

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
      .select('blog_id, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && blogs) {
      for (const blog of blogs) {
        const lastmod = blog.updated_at || blog.published_at;
        urls.push(urlEntry({
          loc: `${SITE_URL}/blog/${blog.blog_id}`,
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

// ─── Blog meta injection ──────────────────────────────────────────────────────

async function handleBlogMeta(req, res) {
  const blogId = req.query.id || req.query.blogId;
  const proto  = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host   = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${proto}://${host}`;

  const serveShell = async (headReplacer) => {
    try {
      const shellRes = await fetch(`${origin}/index.html`);
      let html = await shellRes.text();
      if (headReplacer) html = headReplacer(html);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return res.status(200).send(html);
    } catch (err) {
      console.error('blog-meta shell fetch error:', err);
      res.setHeader('Location', `/blog/${blogId || ''}`);
      return res.status(302).end();
    }
  };

  if (!supabase || !blogId) return serveShell(null);

  try {
    const { data: blog, error } = await supabase
      .from('mern_blogs')
      .select('blog_id, title, des, banner, published')
      .eq('blog_id', blogId)
      .eq('published', true)
      .single();

    if (error || !blog) return serveShell(null);

    const pageUrl     = `${origin}/blog/${blog.blog_id}`;
    const title       = escapeHtml(`${blog.title} | Coconoto Africa`);
    const rawTitle    = escapeHtml(blog.title);
    const description = escapeHtml((blog.des || blog.title || '').slice(0, 160));
    const image       = escapeHtml(blog.banner || `${origin}/Icon_green.png`);

    const metaBlock = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Coconoto Africa" />
    <meta property="og:title" content="${rawTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${rawTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;

    return serveShell((html) =>
      html
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta\s+name="description"[^>]*>/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
        .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
        .replace('</head>', `${metaBlock}\n  </head>`)
    );
  } catch (err) {
    console.error('blog-meta error:', err);
    return serveShell(null);
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;

  if (action === 'sitemap') return handleSitemap(req, res);
  if (action === 'blog-meta') return handleBlogMeta(req, res);

  return res.status(400).json({ error: 'Missing ?action=sitemap|blog-meta' });
}
