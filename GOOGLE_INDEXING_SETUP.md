# Google Indexing & Sitemap Setup

How the sitemap works, what to do in Google Search Console, and what happens when a new
blog post is published.

---

## 1. What is already automated

The sitemap is **not a static file**. There is no `sitemap.xml` in `dist/` and none in
`public/`. It is generated per request by a serverless function:

```
/sitemap.xml  --vercel.json-->  /api/seo?action=sitemap
```

`api/seo.js` queries Supabase at request time:

```js
supabase.from('mern_blogs')
  .select('blog_id, title, slug, updated_at, published_at')
  .eq('published', true)
  .order('published_at', { ascending: false });
```

Each row becomes a `<url>` entry. **Only posts with `published = true` are included.**

The same function also rewrites the `<head>` of the SPA shell per route, via two rewrites:

| Rewrite | Action | What it injects |
| --- | --- | --- |
| `/blog/:id` | `blog-meta` | Per-post `<title>`, description, canonical, OG/Twitter |
| `/about`, `/cocotech`, … | `page-meta` | Per-page `<title>`, description, canonical, OG/Twitter |

Both read from a single `PUBLIC_PAGES` table in `api/seo.js`, so a page can never be in
the sitemap but missing its meta tags, or vice versa.

---

## 2. How a new blog post reaches the sitemap

**It is automatic. No rebuild, no redeploy, no manual edit.**

The chain:

1. You create a post in the editor. `createBlog()` inserts it with
   `published: false, is_draft: true` and generates a unique slug — so a **draft does not
   appear in the sitemap**.
2. You click **Publish** (`publishBlog()`, or Save with published = true). That sets
   `published: true` and `published_at: <now>`.
3. The **very next request** to `/sitemap.xml` includes it. The live response carries
   `Cache-Control: public, max-age=0, must-revalidate`, so Vercel does not cache it — there
   is no propagation delay.
4. The post's own URL works immediately too, with correct title/description/canonical,
   because `/blog/:id` is rewritten to the `blog-meta` handler.

`<lastmod>` is `updated_at || published_at`, so editing an existing post bumps its
lastmod and tells Google the page changed.

### Editing the meta of a page or post

- **Blog post title/description** — edit `title` and `des` in the post itself. The sitemap
  and the `<head>` both read from the database.
- **Static page title/description/priority** — edit the `PUBLIC_PAGES` table at the top of
  `api/seo.js`. That single table feeds both the sitemap and the injected `<head>`.

---

## 3. What still has to be done manually

The sitemap updating does **not** make Google index anything. Google re-fetches sitemaps on
its own schedule (hours to days). Two things drive actual indexing:

### One-time: Google Search Console

1. Go to <https://search.google.com/search-console> and sign in.
2. **Add property** → choose **Domain** (not URL prefix) → enter `coconoto.africa`.
   - Domain properties cover `www` and non-www together. Verification is a DNS TXT record —
     add it at your DNS provider. (URL-prefix verification with an HTML file is the
     alternative if you cannot edit DNS.)
3. Once verified, open **Sitemaps** in the left sidebar.
4. Enter `sitemap.xml` and click **Submit**.
   - Status should go to *Success* and report the number of discovered URLs.
5. Open **Pages** (under Indexing) after a few days to see what is indexed and, more
   usefully, *why* anything is excluded.

### After publishing a post: request indexing

1. Copy the new post's URL.
2. In Search Console, paste it into the **URL Inspection** bar at the top.
3. Click **Test live URL**, confirm it is not blocked, then **Request Indexing**.

That is the only way to get a new post into Google quickly. Google retired the sitemap
ping endpoint in 2023, so there is no automatic "notify Google" step available.
(Bing and Yandex support IndexNow for instant submission; Google does not.)

---

## 4. Changes in this repo that need deploying

These are committed to the source but **not yet live**. Until they are deployed, the
production sitemap still lists only 6 static routes and every non-blog page still declares
the homepage as its canonical.

| File | Change |
| --- | --- |
| `api/seo.js` | Added `PUBLIC_PAGES` (single source of truth) and a `?action=page-meta` handler; refactored the shared `<head>` injection; canonical now uses `SITE_URL` rather than the request host |
| `vercel.json` | Added `page-meta` rewrites for the 10 public routes, before the catch-all |
| `api/_seo.test.mjs` | Test suite for both handlers (120 assertions) |

### The problem these fix

Before: every non-blog route served `index.html` unchanged, including its
`<link rel="canonical" href="https://www.coconoto.africa/" />`. That told Google
`/about`, `/cocotech`, `/cococycle-hub`, `/blog` and `/contact` were **duplicates of the
homepage**, so it would index `/` and drop the rest. All routes also shared one `<title>`.

After: each route declares its own canonical, title and description.

Also added to the sitemap: `/contact`, `/help-center`, `/privacy-policy`,
`/terms-of-service`, `/cookie-policy` — all real public routes that were missing.

### The three business-unit pages were renamed

`/services`, `/product` and `/marketplace` are now `/cocotech`, `/cococycle-hub` and
`/cococonnect` — the name of the business unit is what people actually search for, and
it is a far better URL than the generic noun the page happens to be. The old URLs still
resolve: the SPA forwards them (`LegacyRedirect` in `src/App.tsx`), preserving any tail
path and `#hash`, so bookmarks, Google results and already-delivered emails do not 404.

What had to move with them:

| File | Change |
| --- | --- |
| `src/App.tsx` | New routes; `/services/*`, `/product/*`, `/marketplace/*` kept as forwarders |
| `vercel.json` | The three `page-meta` rewrites now name the new paths |
| `api/seo.js` | `PUBLIC_PAGES` keys renamed — **the old slugs are deliberately absent**, so the sitemap advertises one canonical URL per page instead of making Google crawl a redirect |
| everything else | Nav, footers, cards, modals, email templates and blog links all point at the new paths |

Because the redirect happens **client-side**, the first response for `/services` is still
the plain SPA shell with no `page-meta` rewrite behind it. That is intentional — a crawler
that follows it lands on `/cocotech` and reads the canonical there — but if the old slugs
need to redirect at the edge (a 301 before any HTML is served) that has to be added in
`vercel.json`, not here.

### Verifying after deploy

```bash
# sitemap should list 11 static routes + one entry per published post
curl -s https://www.coconoto.africa/sitemap.xml | grep -c "<loc>"

# each page must declare ITS OWN canonical, not the homepage
for p in cocotech about cococycle-hub blog contact; do
  echo "/$p:"; curl -s "https://www.coconoto.africa/$p" | grep -o '<link rel="canonical"[^>]*>'
done
```

---

## 5. Checklist

- [ ] Deploy the changes above.
- [ ] Verify the live sitemap lists 11 static routes + all published posts.
- [ ] Confirm each page returns its own canonical (not the homepage).
- [ ] Add and verify the `coconoto.africa` domain property in Google Search Console.
- [ ] Submit `sitemap.xml` under Sitemaps.
- [ ] Use URL Inspection → Request Indexing on the most important pages first
      (`/`, `/cocotech`, `/cococycle-hub`, `/cococonnect`, `/blog`).
- [ ] Confirm the old slugs (`/services`, `/product`, `/marketplace`) still forward and are
      **not** listed in the sitemap.
- [ ] After each new post: Publish → copy URL → Request Indexing.
- [ ] Recheck the Pages report weekly until the important URLs show as *Indexed*.
