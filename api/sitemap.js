import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const SITE_URL = (process.env.SITE_URL || 'https://www.coconoto.africa').replace(/\/$/, '');

// Static, indexable routes. Dashboard/editor/login are intentionally excluded.
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/services', changefreq: 'monthly', priority: '0.7' },
  { path: '/product', changefreq: 'monthly', priority: '0.7' },
  { path: '/marketplace', changefreq: 'daily', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.8' },
];

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const urlEntry = ({ loc, lastmod, changefreq, priority }) => {
  const parts = [`    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
};

export default async function handler(req, res) {
  try {
    const urls = STATIC_ROUTES.map((route) =>
      urlEntry({ loc: `${SITE_URL}${route.path}`, changefreq: route.changefreq, priority: route.priority })
    );

    // Read-only: pull every published post so newly published ones appear
    // automatically on the next crawl. No writes to the database.
    if (supabase) {
      const { data: blogs, error } = await supabase
        .from('mern_blogs')
        .select('blog_id, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Sitemap blog fetch error:', error.message);
      } else if (blogs) {
        for (const blog of blogs) {
          const lastmod = blog.updated_at || blog.published_at;
          urls.push(
            urlEntry({
              loc: `${SITE_URL}/blog/${blog.blog_id}`,
              lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
              changefreq: 'weekly',
              priority: '0.9',
            })
          );
        }
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // Short cache so freshly published posts show up quickly, while avoiding
    // a database read on every single crawler hit.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    );
  }
}
