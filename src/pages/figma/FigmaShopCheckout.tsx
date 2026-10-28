import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import ShopNav from '../../components/figma/ShopNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { ShopCartProvider, useShopCart } from './shop/ShopCartContext';
import { naira, type ShopProduct } from './shop/shopData';
import { saveOrder, type OrderSnapshot } from './shop/orderStorage';

/** Express shipping surcharge, added on top of the flat delivery fee. */
const EXPRESS_FEE = 3000;

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-[#1C1C1C]">
        {label}
        {required && <span className="text-[#1AC212]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-[38px] w-full rounded-[5px] border border-neutral-200 px-3 text-[13px] text-[#1C1C1C] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#1AC212]"
      />
    </label>
  );
}

function Radio({
  name,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 py-1.5">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[#1AC212]"
      />
      <span className="text-[13px] text-[#1C1C1C]">
        {label}
        {hint && <span className="text-neutral-500"> — {hint}</span>}
      </span>
    </label>
  );
}

function CheckoutBody() {
  const { lines, subtotal, deliveryFee, count, clear } = useShopCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone2: '',
  });
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [payment, setPayment] = useState<'card' | 'cash'>('card');

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const shippingFee = shipping === 'express' ? EXPRESS_FEE : 0;
  const total = subtotal + deliveryFee + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count === 0) return;

    const snapshot: OrderSnapshot = {
      reference: `CC-${Date.now().toString(36).toUpperCase().slice(-8)}`,
      email: form.email,
      address: [form.address1, form.address2, form.city, form.state, form.postalCode]
        .filter(Boolean)
        .join(', '),
      items: lines.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageSlot: product.imageSlot,
      })),
      subtotal,
      deliveryFee,
      shippingFee,
      total,
      payment: payment === 'card' ? 'Bank / Credit / Debit card' : 'Cash Transfer',
      shipping: shipping === 'express' ? 'Express Shipping' : 'Standard Shipping',
    };

    saveOrder(snapshot);
    clear();
    navigate('/shop/order-confirmed');
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopNav active="Marketplace" />

      <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── Delivery details ── */}
          <section className="rounded-[6px] border border-neutral-200 bg-white p-5 sm:p-6">
            <h1 className="font-lora text-[20px] text-[#1C1C1C]">Delivery Details</h1>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={form.firstName} onChange={set('firstName')} required autoComplete="given-name" />
              <Field label="Last name" value={form.lastName} onChange={set('lastName')} required autoComplete="family-name" />
            </div>

            <div className="mt-4">
              <Field label="Email address" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

            <div className="mt-4">
              <Field label="Phone number" type="tel" value={form.phone} onChange={set('phone')} required autoComplete="tel" />
            </div>

            <h2 className="mt-7 font-lora text-[16px] text-[#1C1C1C]">Shipping Address</h2>

            <div className="mt-3 space-y-4">
              <Field label="Address line 1" value={form.address1} onChange={set('address1')} required autoComplete="address-line1" />
              <Field label="Address line 2" value={form.address2} onChange={set('address2')} autoComplete="address-line2" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="City" value={form.city} onChange={set('city')} required autoComplete="address-level2" />
              <Field label="State" value={form.state} onChange={set('state')} required autoComplete="address-level1" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Postal code" value={form.postalCode} onChange={set('postalCode')} autoComplete="postal-code" />
              <Field label="Phone number" type="tel" value={form.phone2} onChange={set('phone2')} />
            </div>

            <h2 className="mt-7 font-lora text-[16px] text-[#1C1C1C]">Shipping Method</h2>
            <div className="mt-2">
              <Radio
                name="shipping"
                label="Standard Shipping"
                hint="Free"
                checked={shipping === 'standard'}
                onChange={() => setShipping('standard')}
              />
              <Radio
                name="shipping"
                label="Express Shipping"
                hint={naira(EXPRESS_FEE)}
                checked={shipping === 'express'}
                onChange={() => setShipping('express')}
              />
            </div>

            <h2 className="mt-7 font-lora text-[16px] text-[#1C1C1C]">Payment Method</h2>
            <div className="mt-2">
              <Radio
                name="payment"
                label="Bank / Credit / Debit card"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
              />
              <Radio
                name="payment"
                label="Cash Transfer"
                checked={payment === 'cash'}
                onChange={() => setPayment('cash')}
              />
            </div>

            <button
              type="submit"
              disabled={count === 0}
              className="mt-7 w-full rounded-[6px] bg-[#1AC212] py-[11px] font-lora text-[14px] font-semibold text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Pay
            </button>

            <p className="mt-3 text-center text-[11px] text-neutral-500">
              By clicking “Pay Now”, you agree to our{' '}
              <Link to="/terms-of-service" className="underline hover:text-[#17AD10]">
                Terms &amp; Conditions
              </Link>
            </p>

            <Link
              to="/shop"
              className="mt-4 flex items-center justify-center gap-1 text-[12px] text-[#17AD10] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Go back to previous page
            </Link>
          </section>

          {/* ── Order summary ── */}
          <aside className="lg:sticky lg:top-[88px]">
            <section className="rounded-[6px] border border-neutral-200 bg-white p-5">
              <h2 className="font-lora text-[18px] text-[#1C1C1C]">Order Summary</h2>

              {count === 0 ? (
                <p className="mt-4 text-[13px] text-neutral-500">
                  Your cart is empty.{' '}
                  <Link to="/shop" className="text-[#17AD10] hover:underline">
                    Browse products
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-neutral-100">
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
                      <ImageSlot
                        slot={product.imageSlot}
                        label={product.name}
                        hint="80 × 80"
                        className="h-12 w-12 shrink-0 rounded-[3px] bg-[#EDEDEA]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-lora text-[13px] text-[#1C1C1C]">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">Qty {quantity}</p>
                      </div>
                      <span className="shrink-0 text-[13px] text-[#1C1C1C]">
                        {naira(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4">
                <SummaryRow label="Subtotal" value={naira(subtotal)} />
                <SummaryRow label="Discount" value={naira(0)} />
                <SummaryRow label="Delivery fee" value={naira(deliveryFee)} />
                {shippingFee > 0 && <SummaryRow label="Express shipping" value={naira(shippingFee)} />}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="font-lora text-[15px] font-semibold text-[#1C1C1C]">Total</span>
                <span className="font-lora text-[16px] font-bold text-[#1C1C1C]">{naira(total)}</span>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[#17AD10]">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Secure checkout
              </p>
            </section>
          </aside>
        </div>
      </form>

      <FigmaFooter />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-neutral-500">{label}</span>
      <span className="text-[#1C1C1C]">{value}</span>
    </div>
  );
}

export default function FigmaShopCheckout() {
  return (
    <ShopCartProvider>
      <CheckoutBody />
    </ShopCartProvider>
  );
}

/** Re-exported for the confirmation page's typing. */
export type { ShopProduct };
