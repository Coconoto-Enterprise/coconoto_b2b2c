import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ShopNav from '../../components/figma/ShopNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { ShopCartProvider } from './shop/ShopCartContext';
import ShopProductCard from './shop/ShopProductCard';
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from './shop/shopData';

/* ── Frame 110 · hero ───────────────────────────────────────────────────── */

function ShopHero({
  query,
  onQuery,
}: {
  query: string;
  onQuery: (value: string) => void;
}) {
  return (
    <section className="relative isolate flex h-[380px] w-full items-center justify-center overflow-hidden bg-[#2a2a2a] sm:h-[460px] lg:h-[560px]">
      {/* Background photo — full-bleed, `variant="background"` so the placeholder
          never draws a grey box over the copy. */}
      <ImageSlot
        slot="shop-hero-bg"
        label="Market produce background"
        hint="1440 × 560"
        variant="background"
        className="absolute inset-0 h-full w-full"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto w-full max-w-[820px] px-5 text-center sm:px-8">
        <p className="mb-3 font-lora text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8CC63F]">
          Coco-connect
        </p>
        <h1 className="font-lora text-[30px] leading-tight text-white sm:text-[38px] lg:text-[46px]">
          Welcome to Coco-connect
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-relaxed text-white/80 sm:text-[14px]">
          Welcome to our Marketplace where we connect you directly to what you need.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          role="search"
          className="mx-auto mt-7 flex h-[52px] w-full max-w-[620px] items-center gap-2 rounded-[10px] bg-white pl-5 pr-2 shadow-lg sm:h-[56px]"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="What would you like to purchase?"
            aria-label="Search products"
            className="h-full min-w-0 flex-1 bg-transparent font-lora text-[14px] text-[#1C1C1C] outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[8px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#1AC212]"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

const ALL = 'All products';

function ShopBody() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Cash crops');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SHOP_PRODUCTS.filter((p) => (category === ALL ? true : p.category === category));
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, category, sort]);

  return (
    <div className="min-h-screen bg-white">
      <ShopNav />

      <ShopHero query={query} onQuery={setQuery} />

      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-9 sm:px-8 lg:px-[100px]">
        <h2 className="font-lora text-[24px] text-[#1C1C1C]">Categories</h2>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Category rail */}
          <aside className="w-full shrink-0 lg:w-[260px]">
            <nav aria-label="Product categories" className="border-t border-neutral-200">
              {[{ name: ALL, count: SHOP_PRODUCTS.length }, ...SHOP_CATEGORIES].map((c) => {
                const isActive = category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setCategory(c.name)}
                    aria-pressed={isActive}
                    className={`flex w-full flex-col items-start border-b border-neutral-200 px-3 py-[10px] text-left transition-colors ${
                      isActive ? 'bg-[#F1F1EF]' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className="font-lora text-[14px] leading-tight text-[#1C1C1C]">
                      {c.name}
                    </span>
                    <span className="text-[12px] text-neutral-400">({c.count})</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-200 pb-3">
              <h2 className="font-lora text-[20px] text-[#1C1C1C]">
                Results for {category === ALL ? 'all products' : category.toLowerCase()}
              </h2>
              <label className="flex shrink-0 items-center gap-2 text-[12px] text-neutral-500">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  aria-label="Sort products"
                  className="cursor-pointer rounded border border-neutral-200 bg-white px-2 py-1 font-lora text-[12px] text-[#1C1C1C] outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <p className="py-16 text-center font-lora text-[15px] text-neutral-500">
                Nothing matches “{query}” in {category === ALL ? 'any category' : category}. Try
                another search or category.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <ShopProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <FigmaFooter />
    </div>
  );
}

export default function FigmaShop() {
  return (
    <ShopCartProvider>
      <ShopBody />
    </ShopCartProvider>
  );
}
