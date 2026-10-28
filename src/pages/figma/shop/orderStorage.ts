/**
 * Snapshot of the order that was just placed, so `/shop/order-confirmed` can
 * render real line items instead of a mock.
 *
 * localStorage, not sessionStorage: the owner opens the confirmation URL
 * directly when reviewing the design, and sessionStorage would be empty in a
 * fresh tab — the page would look broken for no reason.
 */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSlot: string;
}

export interface OrderSnapshot {
  reference: string;
  email: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  shippingFee: number;
  total: number;
  payment: string;
  shipping: string;
}

const KEY = 'coconoto-shop-last-order';

export function saveOrder(order: OrderSnapshot) {
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* private mode — the confirmation page falls back to its empty state */
  }
}

export function readOrder(): OrderSnapshot | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrderSnapshot;
    return parsed && Array.isArray(parsed.items) ? parsed : null;
  } catch {
    return null;
  }
}
