import React, { createContext, useContext, useMemo, useState } from 'react';
import { DELIVERY_FEE, SHOP_PRODUCTS, type ShopProduct } from './shopData';

/**
 * Cart for the Coco-connect shop (`/shop`).
 *
 * Separate from `ProductCartContext`, which the old `/product` page uses: that
 * one keys on a display price string, which is useless for maths. This one keys
 * on the product id and derives everything from `shopData`.
 *
 * Persisted to localStorage so the badge in the black nav survives a reload,
 * and the cart survives moving from the grid to the product page.
 */

export interface CartLine {
  product: ShopProduct;
  quantity: number;
}

interface ShopCartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  /** True the moment an item is added, so the nav badge can pulse. */
  lastAdded: string | null;
}

const STORAGE_KEY = 'coconoto-shop-cart';

const ShopCartContext = createContext<ShopCartValue | undefined>(undefined);

export function useShopCart() {
  const ctx = useContext(ShopCartContext);
  if (!ctx) throw new Error('useShopCart must be used inside <ShopCartProvider>');
  return ctx;
}

/** `{ id: qty }` — the smallest thing worth persisting. */
type Stored = Record<string, number>;

function readStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Stored = {};
    for (const [id, qty] of Object.entries(parsed)) {
      // Ignore ids that no longer exist — a renamed product must not leave a
      // phantom line the cart cannot price.
      if (SHOP_PRODUCTS.some((p) => p.id === id) && typeof qty === 'number' && qty > 0) {
        out[id] = Math.min(99, Math.floor(qty));
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Stored>(() => readStored());
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  /**
   * Every mutation writes to localStorage **synchronously**, not from an effect.
   *
   * The effect version looked correct and was not: "Buy now" calls `add()` and
   * `navigate()` in the same tick, so the checkout page's brand-new provider
   * mounted and read storage *before* the previous tree's effect had flushed —
   * the new page then showed a stale cart (and the badge disagreed with the
   * order summary). Computing the next map here removes the race entirely.
   */
  const update = (fn: (prev: Stored) => Stored) => {
    setQuantities((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* private mode — the cart still works for this session */
      }
      return next;
    });
  };

  const value = useMemo<ShopCartValue>(() => {
    const lines: CartLine[] = Object.entries(quantities).flatMap(([id, qty]) => {
      const product = SHOP_PRODUCTS.find((p) => p.id === id);
      return product ? [{ product, quantity: qty }] : [];
    });
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const deliveryFee = count > 0 ? DELIVERY_FEE : 0;

    return {
      lines,
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      lastAdded,
      add: (productId, quantity = 1) => {
        update((prev) => ({
          ...prev,
          [productId]: Math.min(99, (prev[productId] ?? 0) + quantity),
        }));
        setLastAdded(productId);
      },
      setQuantity: (productId, quantity) => {
        update((prev) => {
          if (quantity <= 0) {
            const next = { ...prev };
            delete next[productId];
            return next;
          }
          return { ...prev, [productId]: Math.min(99, Math.floor(quantity)) };
        });
      },
      remove: (productId) =>
        update((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        }),
      clear: () => update(() => ({})),
    };
  }, [quantities, lastAdded]);

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
}
