import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Serves the normal SPA shell but with real per-post <title> and social meta
// baked into the HTML, so crawlers that don't run JavaScript (WhatsApp,
// Twitter/X, Facebook, LinkedIn, and Google's fast path) see the right preview.
// Real users still get the full React app that hydrates on top.
export default async function handler(req, res) {
  const blogId = req.query.id || req.query.blogId;
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${proto}://${host}`;

  // Always fall back to the untouched shell if anything goes wrong.
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

  if (!supabase || !blogId) {
    return serveShell(null);
  }

  try {
    // Read-only fetch of the published post. No database writes.
    const { data: blog, error } = await supabase
      .from('mern_blogs')
      .select('blog_id, title, des, banner, published, tags')
      .eq('blog_id', blogId)
      .eq('published', true)
      .single();

    if (error || !blog) {
      return serveShell(null);
    }

    const pageUrl = `${origin}/blog/${blog.blog_id}`;
    const title = escapeHtml(`${blog.title} | Coconoto Africa`);
    const description = escapeHtml((blog.des || blog.title || '').slice(0, 160));
    const image = escapeHtml(blog.banner || `${origin}/Icon_green.png`);
    const rawTitle = escapeHtml(blog.title);

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

    return serveShell((html) => {
      // Drop the shell's static title + og/twitter/description/canonical tags,
      // then insert the post-specific ones just before </head>.
      let out = html
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta\s+name="description"[^>]*>/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
        .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');
      return out.replace('</head>', `${metaBlock}\n  </head>`);
    });
  } catch (err) {
    console.error('blog-meta error:', err);
    return serveShell(null);
  }
}
