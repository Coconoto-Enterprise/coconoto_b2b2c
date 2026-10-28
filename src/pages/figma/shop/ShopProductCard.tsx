import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import ImageSlot from '../../../components/figma/ImageSlot';
import { useShopCart } from './ShopCartContext';
import { naira, type ShopProduct } from './shopData';

/**
 * The product tile used by the Desktop 41 grid **and** the "Similar Products"
 * strip on Desktop 49. Shared so the two can never drift apart.
 *
 * The green circle is the add-to-cart control — that is what it is in the frame,
 * and it is why it carries an `aria-label` naming the product: a bare "check"
 * button is meaningless to a screen reader and ambiguous to the pointer.
 */
export default function ShopProductCard({ product }: { product: ShopProduct }) {
  const { add } = useShopCart();

  return (
    <article className="group flex flex-col rounded-[4px] border border-neutral-200 bg-white p-[10px] transition-colors hover:border-neutral-300">
      <Link to={`/shop/product/${product.slug}`} className="block">
        <ImageSlot
          slot={product.imageSlot}
          label={product.name}
          hint="254 × 200"
          className="aspect-[254/200] w-full rounded-[3px] bg-[#EDEDEA]"
        />
        <p className="mt-3 text-[12px] text-neutral-400">
          {naira(product.unitPrice)} per {product.unit}
        </p>
        <h3 className="mt-1 font-lora text-[16px] leading-snug text-[#1C1C1C] group-hover:text-[#17AD10]">
          {product.name}
        </h3>
      </Link>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-lora text-[15px] font-semibold text-[#1C1C1C]">
          {naira(product.price)}
        </span>
        <button
          type="button"
          onClick={() => add(product.id)}
          aria-label={`Add ${product.name} to cart`}
          className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#1AC212] text-white transition-transform hover:scale-105 active:scale-95"
        >
          <Check className="h-[14px] w-[14px]" strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
