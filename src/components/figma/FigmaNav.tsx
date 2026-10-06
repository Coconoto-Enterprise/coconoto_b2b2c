import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import ImageSlot from './ImageSlot';
import { WaitlistModal } from '../WaitlistModal';

export type FigmaNavKey = 'Home' | 'Services' | 'Marketplace' | 'Blog' | 'About Us' | 'Contact us';

interface NavItem {
  label: FigmaNavKey;
  to: string;
  /**
   * Extra path prefixes that should also light this item up. Needed because one
   * nav entry can own more than one URL — "Services" covers both the Coco-Tech
   * page (`/services`) and the CocoCycle Hub page (`/product`).
   */
  match: string[];
  /**
   * A sub-item either navigates or jumps to a section on its target page.
   * "Coco Drink & Eat" is a section of the CocoCycle Hub page (`#drink-eat`),
   * not a page of its own, so it scrolls there instead of landing at the top.
   */
  dropdown?: { label: string; to: string; scrollTo?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/', match: ['/'] },
  {
    label: 'Services',
    to: '/cocotech',
    match: ['/cocotech', '/cococycle-hub'],
    dropdown: [
      { label: 'Coco-Tech', to: '/cocotech' },
      { label: 'CocoCycle Hub', to: '/cococycle-hub' },
      { label: 'Coco-Connect', to: '/cococonnect' },
      { label: 'Coco Drink & Eat', to: '/cococycle-hub#drink-eat', scrollTo: 'drink-eat' },
    ],
  },
  { label: 'Marketplace', to: '/cococonnect', match: ['/cococonnect'] },
  { label: 'Blog', to: '/blog', match: ['/blog'] },
  { label: 'About Us', to: '/about', match: ['/about'] },
  { label: 'Contact us', to: '/contact', match: ['/contact', '/help-center'] },
];

/** True when `pathname` is `prefix` itself or sits underneath it. */
function under(pathname: string, prefix: string) {
  if (prefix === '/') return pathname === '/';
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** The navbar is `sticky` and 72px tall, so an anchor jump has to clear it. */
const HEADER_H = 72;

/** Scroll an element into view, offset for the sticky header. */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - HEADER_H,
    behavior: 'smooth',
  });
}

/**
 * The Coconoto navbar as drawn in the Figma frames — Lora links, green underline
 * on the active item, and a bright green CTA pill.
 *
 * This is now the **only** navbar on the site. It is used by the Figma-built
 * pages, by every legacy page (blog, profile, policies, errors, help centre,
 * about) and by the marketplace.
 *
 * Three things make it usable everywhere:
 *
 *  - **The active item is derived from the route** (`useLocation`), so no page
 *    has to remember to pass `active`. The `active` prop is still honoured as an
 *    override for any page whose URL doesn't map cleanly onto a nav entry.
 *  - **`sticky`, not `fixed`.** It stays in the document flow, so pages need no
 *    compensating top padding. Anything that *did* add a spacer under the old
 *    fixed navbar has to drop it, or it gets a double gap.
 *  - **`account` / `mobileAccount`** let a signed-in page (the marketplace) put
 *    its account dropdown in the right-hand cluster instead of the Join Waitlist
 *    CTA — without forking the navbar.
 */
export default function FigmaNav({
  active,
  logoSrc,
  account,
  mobileAccount,
  showCta = true,
}: {
  /** Overrides the route-derived active item. */
  active?: FigmaNavKey;
  /**
   * Real wordmark for the `nav-logo` slot. The registry already resolves this,
   * so it is only needed to point one page at a different file.
   */
  logoSrc?: string;
  /** Replaces the "Join Waitlist" CTA in the desktop cluster. */
  account?: React.ReactNode;
  /** Appended to the mobile drawer, below the links. */
  mobileAccount?: React.ReactNode;
  /** Set false to drop the CTA entirely. */
  showCta?: boolean;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const derived = NAV_ITEMS.find((item) => item.match.some((p) => under(pathname, p)))?.label;
  const activeKey = active ?? derived;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Close the mobile drawer whenever the route changes, otherwise it stays open
  // over the page the user just navigated to.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // `whitespace-nowrap` matters: without it the two-word items ("About Us",
  // "Contact us") break onto a second line as soon as the row gets tight, which
  // looks broken. The row is sized to fit at every width instead.
  const linkBase =
    'flex shrink-0 items-center gap-1 whitespace-nowrap border-b-2 pb-[3px] font-lora text-[15px] leading-none transition-colors xl:text-[16px]';
  // Shared by the dropdown's <Link>s and its action <button>, so the two render
  // identically.
  const dropdownItem =
    'block px-4 py-2.5 font-lora text-[15px] text-[#1C1C1C] transition-colors hover:bg-neutral-50 hover:text-[#17AD10]';
  const linkState = (isActive: boolean) =>
    isActive
      ? 'border-[#17AD10] text-[#17AD10]'
      : 'border-transparent text-[#1C1C1C] hover:border-[#17AD10] hover:text-[#17AD10]';

  // Radius matches the old site navbar's `Join Waitlist` button, which resolved
  // to 12px (`rounded-lg` → `var(--radius)` in tailwind.config.js). It was 6px.
  const ctaClass =
    'rounded-[12px] bg-[#1AC212] px-[18px] py-[10px] font-lora text-[16px] font-semibold leading-none text-white transition-colors hover:bg-[#17ad10]';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-[100px]">
          {/* Logo */}
          <Link to="/" aria-label="Coconoto home" className="shrink-0">
            <ImageSlot
              slot="nav-logo"
              src={logoSrc}
              label="Coconoto logo"
              hint="188 × 30"
              className="h-[30px] w-[188px] !bg-transparent [&>div]:border-0 [&>div]:bg-transparent"
              imgClassName="object-contain object-left"
            />
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex xl:gap-[38px]">
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
                    <div className="absolute left-1/2 top-[calc(100%+14px)] w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-neutral-100 bg-white py-2 shadow-xl">
                      {item.dropdown.map((sub) => {
                        const target = sub.scrollTo;
                        return target ? (
                          <button
                            key={sub.label}
                            type="button"
                            onClick={() => {
                              setServicesOpen(false);
                              // Already on the target page? The hash does not
                              // change, so HashScroller will not fire — scroll
                              // here instead, which can be smooth because
                              // nothing is loading.
                              if (pathname === sub.to.split('#')[0]) scrollToId(target);
                              else navigate(sub.to);
                            }}
                            className={`${dropdownItem} w-full cursor-pointer text-left`}
                          >
                            {sub.label}
                          </button>
                        ) : (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            onClick={() => setServicesOpen(false)}
                            className={dropdownItem}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={() => `${linkBase} ${linkState(activeKey === item.label)}`}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            {account ??
              (showCta && (
                <button type="button" onClick={() => setWaitlistOpen(true)} className={ctaClass}>
                  Join Waitlist
                </button>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="p-2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6 text-[#17AD10]" /> : <Menu className="h-6 w-6 text-[#17AD10]" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-neutral-100 bg-white px-6 pb-6 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={() =>
                    // The rule under an item that opens a sub-list moves onto the
                    // sub-list itself, so the four unit names read as children of
                    // "Services" instead of as siblings of the other top-level
                    // links.
                    `block py-3 font-lora text-[16px] ${
                      activeKey === item.label ? 'text-[#17AD10]' : 'text-[#1C1C1C]'
                    } ${item.dropdown ? '' : 'border-b border-neutral-100'}`
                  }
                >
                  {item.label}
                </NavLink>

                {/* The desktop nav hides these behind a hover dropdown, which a
                    phone cannot open — without them there is no way to reach
                    Coco-Tech, CocoCycle Hub, Coco-Connect or Coco Drink & Eat on
                    mobile at all. */}
                {item.dropdown && (
                  <ul className="border-b border-neutral-100 pb-2">
                    {item.dropdown.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 pl-5 font-lora text-[15px] text-[#6F4A32] transition-colors hover:text-[#17AD10]"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {mobileAccount}
            {/* The account variant brings its own mobile block, so the CTA only
                renders when there is no account slot to show instead. */}
            {!account && showCta && (
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setWaitlistOpen(true);
                    setMobileOpen(false);
                  }}
                  className={ctaClass}
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
}
