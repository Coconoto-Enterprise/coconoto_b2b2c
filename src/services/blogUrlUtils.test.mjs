import test from 'node:test';
import assert from 'node:assert/strict';

import { slugifyBlogTitle, buildBlogUrlSlug, buildUniqueBlogSlug, matchesBlogUrlParam } from './blogUrlUtils.js';

test('slugifyBlogTitle turns titles into readable SEO slugs', () => {
  assert.equal(slugifyBlogTitle('Why coconut farming is growing fast in Africa'), 'why-coconut-farming-is-growing-fast-in-africa');
  assert.equal(slugifyBlogTitle('   Best  Coconut  Products   '), 'best-coconut-products');
});

test('buildBlogUrlSlug keeps the URL clean without a random ID suffix', () => {
  assert.equal(buildBlogUrlSlug({ title: 'Why coconut farming is growing fast in Africa', blog_id: '7gedz3o3vxm' }), 'why-coconut-farming-is-growing-fast-in-africa');
  assert.equal(buildBlogUrlSlug({ title: 'Coconut Tips', blog_id: 'abc123' }), 'coconut-tips');
  assert.equal(buildBlogUrlSlug({ title: 'Old Title', slug: 'repaired-title' }), 'repaired-title');
});

test('buildUniqueBlogSlug avoids collisions without appending random IDs', () => {
  assert.equal(buildUniqueBlogSlug('Coconut Tips', ['coconut-tips']), 'coconut-tips-2');
  assert.equal(buildUniqueBlogSlug('Coconut Tips', ['coconut-tips', 'coconut-tips-2']), 'coconut-tips-3');
});

test('matchesBlogUrlParam accepts a slug or legacy blog id', () => {
  const match = matchesBlogUrlParam(
    { title: 'Why coconut farming is growing fast in Africa', blog_id: '7gedz3o3vxm' },
    'why-coconut-farming-is-growing-fast-in-africa'
  );
  assert.equal(match, true);
  assert.equal(matchesBlogUrlParam({ title: 'Why coconut farming is growing fast in Africa', blog_id: '7gedz3o3vxm' }, '7gedz3o3vxm'), true);
});
