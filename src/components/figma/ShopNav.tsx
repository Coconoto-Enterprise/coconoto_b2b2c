import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, ShoppingCart, Trash2, X } from 'lucide-react';
import { NAV_ITEMS, under, type FigmaNavKey } from './FigmaNav';
import ImageSlot from './ImageSlot';
import { useShopCart } from '../../pages/figma/shop/ShopCartContext';
import { naira } from '../../pages/figma/shop/shopData';
import whiteLogo from '../../assets/CoconotoWhitePalmLogo.png';

/**
 * The **black** navbar used by the Coco-connect shop (`/shop`).
 *
 * Same links as `FigmaNav` — it imports `NAV_ITEMS` from there rather than
 * keeping its own copy — but on `#0B0B0B` with a cart, a green Buy pill and the
 * round account avatar at the right end, as drawn in Desktop 41 / 49.
 *
 * Kept as its own component instead of a `variant` prop on `FigmaNav`: the dark
 * treatment changes the logo asset, every text colour, the dropdown panel and
 * the right-hand cluster, so a prop would just mean branching on ~20 strings.
 */
export default function ShopNav({ active }: { active?: FigmaNavKey }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lines, count, subtotal, setQuantity, remove } = useShopCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const derived = NAV_ITEMS.find((item) => item.match.some((p) => under(pathname, p)))?.label;
  const activeKey = active ?? derived;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setCartOpen(false);
  }, [pathname]);

  const linkBase =
    'flex shrink-0 items-center gap-1 whitespace-nowrap border-b-2 pb-[3px] font-lora text-[15px] leading-none transition-colors xl:text-[16px]';
  const linkState = (isActive: boolean) =>
    isActive
      ? 'border-[#8CC63F] text-[#8CC63F]'
      : 'border-transparent text-white/85 hover:border-[#8CC63F] hover:text-white';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0B]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-[100px]">
        {/* Logo — the *white* wordmark. The light nav's `nav-logo.png` is brown
            and disappears on black. */}
        <Link to="/shop" aria-label="Coconoto shop home" className="shrink-0">
          <img src={whiteLogo} alt="Coconoto" className="h-8 w-auto object-contain sm:h-9" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex xl:gap-[34px]">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <div key={item.label} ref={servicesRef} className="relative">
                <button
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  className={`${linkBase} ${linkState(activeKey === item.label)}`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {servicesOpen && (
                  <div className="absolute left-1/2 top-[calc(100%+14px)] w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#161616] py-2 shadow-2xl">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => setServicesOpen(false)}
                        className="block px-4 py-2.5 font-lora text-[15px] text-white/80 transition-colors hover:bg-white/5 hover:text-[#8CC63F]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.label === 'Marketplace' ? '/shop' : item.to}
                className={() => `${linkBase} ${linkState(activeKey === item.label)}`}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Cart · Buy · avatar */}
        <div className="flex shrink-0 items-center gap-3">
          <div ref={cartRef} className="relative">
            <button
              type="button"
              onClick={() => setCartOpen((v) => !v)}
              aria-expanded={cartOpen}
              aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
              className="relative grid h-9 w-9 place-items-center text-white transition-opacity hover:opacity-80"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#1AC212] px-1 text-[10px] font-bold leading-none text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {cartOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[330px] overflow-hidden rounded-xl border border-neutral-200 bg-white text-[#1C1C1C] shadow-2xl">
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                  <p className="font-lora text-[15px] font-semibold">Your cart</p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    aria-label="Close cart"
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {lines.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[13px] text-neutral-500">
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    <ul className="max-h-[280px] divide-y divide-neutral-100 overflow-y-auto">
                      {lines.map(({ product, quantity }) => (
                        <li key={product.id} className="flex gap-3 px-4 py-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-100">
                            <ImageSlot
                              slot={product.imageSlot}
                              label={product.name}
                              className="h-full w-full"
                              hint="80 × 80"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-lora text-[13px] font-semibold">{product.name}</p>
                            <p className="mt-0.5 text-[12px] text-neutral-500">{naira(product.price)}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex items-center rounded border border-neutral-200">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${product.name}`}
                                  onClick={() => setQuantity(product.id, quantity - 1)}
                                  className="h-6 w-6 text-[13px] leading-none text-neutral-600 hover:bg-neutral-50"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center text-[12px]">{quantity}</span>
                                <button
                                  type="button"
                                  aria-label={`Increase ${product.name}`}
                                  onClick={() => setQuantity(product.id, quantity + 1)}
                                  className="h-6 w-6 text-[13px] leading-none text-neutral-600 hover:bg-neutral-50"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${product.name}`}
                                onClick={() => remove(product.id)}
                                className="text-neutral-400 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-neutral-100 px-4 py-3">
                      <div className="mb-3 flex items-center justify-between text-[13px]">
                        <span className="text-neutral-500">Subtotal</span>
                        <span className="font-semibold">{naira(subtotal)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCartOpen(false);
                          navigate('/shop/checkout');
                        }}
                        className="w-full rounded-[10px] bg-[#1AC212] py-2.5 font-lora text-[14px] font-semibold text-white transition-colors hover:bg-[#17ad10]"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/shop/checkout"
            className="hidden rounded-[8px] bg-[#1AC212] px-[16px] py-[8px] font-lora text-[14px] font-semibold leading-none text-white transition-colors hover:bg-[#17ad10] sm:block"
          >
            Buy
          </Link>

          {/* Round account avatar — the "image logo" at the right end. */}
          <Link
            to="/buyer-login"
            aria-label="Account"
            className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25"
          >
            <ImageSlot
              slot="shop-nav-avatar"
              label="Account avatar"
              hint="64 × 64"
              className="h-full w-full rounded-full"
            />
          </Link>

          <button
            type="button"
            className="p-1.5 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6 text-[#8CC63F]" /> : <Menu className="h-6 w-6 text-[#8CC63F]" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0B0B0B] px-6 pb-6 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <NavLink
                to={item.label === 'Marketplace' ? '/shop' : item.to}
                onClick={() => setMobileOpen(false)}
                className={() =>
                  `block py-3 font-lora text-[16px] ${
                    activeKey === item.label ? 'text-[#8CC63F]' : 'text-white'
                  } ${item.dropdown ? '' : 'border-b border-white/10'}`
                }
              >
                {item.label}
              </NavLink>
              {item.dropdown && (
                <ul className="border-b border-white/10 pb-2">
                  {item.dropdown.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        to={sub.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 pl-5 font-lora text-[15px] text-white/60 transition-colors hover:text-[#8CC63F]"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
