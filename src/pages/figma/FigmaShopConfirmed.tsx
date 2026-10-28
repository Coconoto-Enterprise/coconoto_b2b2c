import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import ShopNav from '../../components/figma/ShopNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { ShopCartProvider } from './shop/ShopCartContext';
import { naira } from './shop/shopData';
import { readOrder } from './shop/orderStorage';

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className={strong ? 'font-lora font-semibold text-[#1C1C1C]' : 'text-neutral-500'}>
        {label}
      </span>
      <span className={strong ? 'font-lora font-bold text-[#1C1C1C]' : 'text-[#1C1C1C]'}>
        {value}
      </span>
    </div>
  );
}

function ConfirmedBody() {
  const order = readOrder();

  return (
    <div className="min-h-screen bg-white">
      <ShopNav active="Marketplace" />

      <main className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#1AC212] text-white">
            <Check className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-lora text-[26px] text-[#1C1C1C]">Order Confirmed</h1>
          <p className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-neutral-600">
            You will get an email of your order, delivery and another information.
          </p>
          {order?.reference && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-neutral-400">
              Ref {order.reference}
            </p>
          )}
        </div>

        {order ? (
          <>
            <section className="mt-8 rounded-[6px] border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="font-lora text-[18px] text-[#1C1C1C]">Order Summary</h2>

              <ul className="mt-4 divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <ImageSlot
                      slot={item.imageSlot}
                      label={item.name}
                      hint="80 × 80"
                      className="h-14 w-14 shrink-0 rounded-[3px] bg-[#EDEDEA]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-lora text-[13px] text-[#1C1C1C]">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">Qty {item.quantity}</p>
                    </div>
                    <span className="shrink-0 text-[13px] text-[#1C1C1C]">
                      {naira(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4">
                <SummaryRow label="Subtotal" value={naira(order.subtotal)} />
                <SummaryRow label="Discount" value={naira(0)} />
                <SummaryRow label="Delivery Fee" value={naira(order.deliveryFee)} />
                <SummaryRow label={order.shipping} value={naira(order.shippingFee)} />
              </div>

              <div className="mt-3 border-t border-neutral-100 pt-3">
                <SummaryRow label="Total" value={naira(order.total)} strong />
              </div>
            </section>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-[6px] border border-neutral-200 px-4 py-3">
                <Check className="mt-[2px] h-3.5 w-3.5 shrink-0 text-[#1AC212]" aria-hidden="true" />
                <p className="text-[12px] leading-snug text-neutral-600">
                  Confirmation sent to:{' '}
                  <span className="block break-all text-[#1C1C1C]">
                    {order.email || 'your email address'}
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-[6px] border border-neutral-200 px-4 py-3">
                <Check className="mt-[2px] h-3.5 w-3.5 shrink-0 text-[#1AC212]" aria-hidden="true" />
                <p className="text-[12px] leading-snug text-neutral-600">
                  Shipped to:{' '}
                  <span className="block text-[#1C1C1C]">
                    {order.address || 'your delivery address'}
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <section className="mt-8 rounded-[6px] border border-dashed border-neutral-300 px-6 py-10 text-center">
            <p className="font-lora text-[15px] text-[#1C1C1C]">No recent order found</p>
            <p className="mx-auto mt-1 max-w-[380px] text-[13px] text-neutral-500">
              This page shows the order you just placed. Add something to your cart and check out
              to see it filled in.
            </p>
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            to="/shop"
            className="rounded-[6px] bg-[#1AC212] px-8 py-[11px] font-lora text-[14px] font-semibold text-white transition-colors hover:bg-[#17ad10]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <FigmaFooter />
    </div>
  );
}

export default function FigmaShopConfirmed() {
  return (
    <ShopCartProvider>
      <ConfirmedBody />
    </ShopCartProvider>
  );
}
