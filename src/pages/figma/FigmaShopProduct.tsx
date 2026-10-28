import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Star } from 'lucide-react';
import ShopNav from '../../components/figma/ShopNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { ShopCartProvider, useShopCart } from './shop/ShopCartContext';
import ShopProductCard from './shop/ShopProductCard';
import {
  SHOP_REVIEWS,
  findProduct,
  naira,
  similarProducts,
} from './shop/shopData';

/** Five stars, filled up to `rating` (rounded). */
function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-[13px] w-[13px] ${
            i <= Math.round(rating) ? 'fill-[#F5B301] text-[#F5B301]' : 'text-neutral-300'
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex h-[38px] w-full items-center justify-between rounded-[6px] border border-neutral-200 px-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
        className="grid h-7 w-7 place-items-center text-[15px] leading-none text-neutral-600 hover:text-[#1AC212]"
      >
        −
      </button>
      <span className="font-lora text-[14px] text-[#1C1C1C]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        aria-label="Increase quantity"
        className="grid h-7 w-7 place-items-center text-[15px] leading-none text-neutral-600 hover:text-[#1AC212]"
      >
        +
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[6px] text-[13px]">
      <span className="text-neutral-500">{label}</span>
      <span className="text-[#1C1C1C]">{value}</span>
    </div>
  );
}

function ProductBody() {
  const { slug = '' } = useParams();
  const product = findProduct(slug);
  const navigate = useNavigate();
  const { add, deliveryFee } = useShopCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const total = product.price * qty + deliveryFee;

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    add(product.id, qty);
    navigate('/shop/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopNav active="Marketplace" />

      <div className="mx-auto max-w-[1200px] px-5 py-7 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[12px]">
          <Link to="/shop" className="text-[#17AD10] hover:underline">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Link to="/shop" className="text-[#17AD10] hover:underline">
            Categories
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" aria-hidden="true" />
          <span className="text-neutral-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* ── Left column ── */}
          <div className="space-y-6">
            <section className="rounded-[6px] border border-neutral-200 bg-white p-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
                {/* Gallery */}
                <div>
                  <ImageSlot
                    slot={product.imageSlot}
                    label={product.name}
                    hint="300 × 240"
                    className="aspect-[300/240] w-full rounded-[4px] bg-[#EDEDEA]"
                  />
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <ImageSlot
                        key={i}
                        slot={`${product.imageSlot}-thumb-${i + 1}`}
                        label={`${product.name} view ${i + 1}`}
                        hint="88 × 72"
                        className="aspect-[88/72] w-full rounded-[3px] border border-neutral-200 bg-[#EDEDEA]"
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="rounded-[6px] border border-[#1AC212] py-[10px] font-lora text-[13px] font-semibold text-[#17AD10] transition-colors hover:bg-[#F2FBEE]"
                    >
                      {added ? 'Added ✓' : 'Add to cart'}
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="rounded-[6px] bg-[#1AC212] py-[10px] font-lora text-[13px] font-semibold text-white transition-colors hover:bg-[#17ad10]"
                    >
                      Buy now
                    </button>
                  </div>
                </div>

                {/* Copy */}
                <div>
                  <h1 className="font-lora text-[26px] leading-tight text-[#1C1C1C]">
                    {product.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars rating={product.rating} />
                    <span className="text-[12px] text-neutral-500">
                      {product.reviewCount} reviews
                    </span>
                  </div>
                  <p className="mt-3 font-lora text-[20px] font-semibold text-[#1C1C1C]">
                    {naira(product.price)}
                  </p>

                  <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">
                    {product.description}
                  </p>

                  <ul className="mt-4 space-y-1.5">
                    {product.features.map((f, i) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-[13px] ${
                          i === 0 ? 'font-semibold text-[#1C1C1C]' : 'text-neutral-600'
                        }`}
                      >
                        {i > 0 && (
                          <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#1AC212]" aria-hidden="true" />
                        )}
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-[13px] font-semibold text-[#1C1C1C]">
                    2 Days Return and Exchange Policy
                  </p>
                  <p className="mt-2 text-[13px] text-neutral-600">
                    Estimated delivery time: 3-4 working days
                  </p>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="rounded-[6px] border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-lora text-[18px] text-[#1C1C1C]">Customer Reviews</h2>
                <button type="button" className="text-[12px] text-[#17AD10] hover:underline">
                  See All
                </button>
              </div>

              <ul className="mt-4 divide-y divide-neutral-100">
                {SHOP_REVIEWS.map((r, i) => (
                  <li key={i} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <ImageSlot
                      slot={r.avatarSlot}
                      label="Reviewer photo"
                      hint="64 × 64"
                      className="h-8 w-8 shrink-0 rounded-full bg-[#EDEDEA]"
                    />
                    <div className="min-w-0">
                      <p className="font-lora text-[13px] font-semibold text-[#1C1C1C]">{r.name}</p>
                      <Stars rating={r.rating} className="mt-1" />
                      <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{r.text}</p>
                      <button type="button" className="mt-2 text-[12px] text-neutral-400 hover:text-[#17AD10]">
                        Helpful
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Similar products */}
            <section>
              <h2 className="mb-4 font-lora text-[18px] text-[#1C1C1C]">Similar Products</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {similarProducts(product).map((p) => (
                  <ShopProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </div>

          {/* ── Order details ── */}
          <aside className="lg:sticky lg:top-[88px]">
            <section className="rounded-[6px] border border-neutral-200 bg-white p-5">
              <h2 className="font-lora text-[18px] text-[#1C1C1C]">Order Details</h2>

              <div className="mt-4">
                <p className="mb-2 text-[13px] text-neutral-500">Quantity</p>
                <QuantityStepper value={qty} onChange={setQty} />
              </div>

              <div className="my-4 border-t border-neutral-100" />

              <Row label="Product Price" value={naira(product.price * qty)} />
              <Row label="Discount" value={naira(0)} />
              <Row label="Delivery fee" value={naira(deliveryFee)} />

              <div className="my-3 border-t border-neutral-100" />

              <div className="flex items-center justify-between">
                <span className="font-lora text-[15px] font-semibold text-[#1C1C1C]">Total</span>
                <span className="font-lora text-[16px] font-bold text-[#1C1C1C]">{naira(total)}</span>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="flex items-center gap-2 text-[13px] text-[#17AD10]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {product.inStock ? 'In Stock' : 'Out of stock'}
                </p>
                <p className="flex items-center gap-2 text-[13px] text-[#1C1C1C]">
                  <Check className="h-3.5 w-3.5 text-[#17AD10]" aria-hidden="true" />
                  {product.warranty}
                </p>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="mt-5 w-full rounded-[6px] bg-[#1AC212] py-[11px] font-lora text-[14px] font-semibold text-white transition-colors hover:bg-[#17ad10]"
              >
                Checkout
              </button>
              <Link
                to="/shop/checkout"
                className="mt-3 block text-center text-[13px] text-[#1C1C1C] underline-offset-2 hover:text-[#17AD10] hover:underline"
              >
                View Cart
              </Link>
            </section>
          </aside>
        </div>
      </div>

      <FigmaFooter />
    </div>
  );
}

export default function FigmaShopProduct() {
  return (
    <ShopCartProvider>
      <ProductBody />
    </ShopCartProvider>
  );
}
