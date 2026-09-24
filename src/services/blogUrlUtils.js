export function slugifyBlogTitle(title = '') {
  return String(title)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function buildBlogUrlSlug(blog = {}) {
  const storedSlug = String(blog.slug || '').trim();
  const baseTitle = slugifyBlogTitle(blog.title || 'blog-post');
  if (storedSlug) return storedSlug;
  return baseTitle || 'blog-post';
}

export function buildUniqueBlogSlug(title = '', existingSlugs = [], currentSlug = '') {
  const base = slugifyBlogTitle(title) || 'blog-post';
  const seen = new Set((existingSlugs || []).map((value) => String(value || '').trim()).filter(Boolean));

  if (currentSlug && currentSlug.trim()) {
    seen.delete(String(currentSlug).trim());
  }

  if (!seen.has(base)) {
    return base;
  }

  let candidate = `${base}-2`;
  let counter = 2;

  while (seen.has(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }

  return candidate;
}

export function matchesBlogUrlParam(blog = {}, param = '') {
  const value = String(param || '').trim();
  if (!value) return false;

  const blogId = String(blog.blog_id || blog.id || '').trim();
  const slug = buildBlogUrlSlug(blog);
  return value === slug || value === blogId;
}
