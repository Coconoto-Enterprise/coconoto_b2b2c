import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Package, Store, User } from 'lucide-react';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';

/**
 * The marketplace account menu, lifted out of the old `BuyerNavbar` so it can be
 * dropped into the shared `FigmaNav`'s `account` slot.
 *
 * Exports three pieces because the navbar needs them in three different places:
 * `AccountMenu` sits in the desktop cluster, `AccountLinks` goes in the mobile
 * drawer, and `LoginLink` stands in when nobody is signed in.
 *
 * The old navbar was a separate bar; merging it into the site navbar is what
 * keeps the site down to one header. The account entries themselves are
 * unchanged, so a signed-in buyer can still reach their orders, profile, seller
 * dashboard and sign-out.
 */

function useAccount() {
  const navigate = useNavigate();
  const { logout, session } = useMarketplaceAuth();

  const name =
    session?.name ||
    localStorage.getItem('buyerName') ||
    localStorage.getItem('vendorBusinessName') ||
    'Account';

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'C';

  const isSeller = !!session?.isSeller;

  const handleLogout = async () => {
    await logout();
    navigate('/buyer-login');
  };

  return { name, initials, isSeller, email: session?.email, handleLogout };
}

/** Avatar + dropdown, for the navbar's desktop cluster. */
export function AccountMenu() {
  const { name, initials, isSeller, email, handleLogout } = useAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:border-[#1AC212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1AC212]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1AC212] text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[140px] truncate font-lora text-[15px] text-[#1C1C1C] xl:inline">
          {name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1AC212] text-sm font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-lora text-sm font-semibold text-[#1C1C1C]">{name}</p>
              <p className="truncate font-lora text-xs text-neutral-500">{email || 'Buyer account'}</p>
            </div>
          </div>

          <div className="py-1">
            <MenuLink
              icon={Package}
              label="My Orders"
              description="Track your purchases"
              onClick={() => setOpen(false)}
              to="/buyer-dashboard"
            />
            <MenuLink
              icon={User}
              label="Profile"
              description="Personal details"
              onClick={() => setOpen(false)}
              to="/buyer-dashboard"
            />
            {isSeller && (
              <>
                <div className="mx-3 my-1 border-t border-neutral-100" />
                <p className="px-4 pb-1 pt-1 font-lora text-[10px] font-semibold uppercase tracking-wider text-[#17AD10]">
                  Selling on Coconoto
                </p>
                <MenuLink
                  icon={LayoutDashboard}
                  label="Seller Dashboard"
                  description="Manage your products"
                  onClick={() => setOpen(false)}
                  to="/seller-dashboard"
                />
              </>
            )}
            <div className="mx-3 my-1 border-t border-neutral-100" />
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
              <span className="font-lora text-sm font-medium text-rose-600">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The same entries, as a plain list for the mobile drawer. */
export function AccountLinks() {
  const { name, initials, email, isSeller, handleLogout } = useAccount();

  return (
    <div className="mt-4 border-t border-neutral-100 pt-4">
      <div className="flex items-center gap-3 pb-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1AC212] text-sm font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-lora text-sm font-semibold text-[#1C1C1C]">{name}</p>
          <p className="truncate font-lora text-xs text-neutral-500">{email || 'Buyer account'}</p>
        </div>
      </div>

      <Link
        to="/buyer-dashboard"
        className="flex items-center gap-3 py-2.5 font-lora text-[15px] text-[#1C1C1C]"
      >
        <Package className="h-4 w-4 text-neutral-500" />
        My Orders
      </Link>
      <Link
        to="/buyer-dashboard"
        className="flex items-center gap-3 py-2.5 font-lora text-[15px] text-[#1C1C1C]"
      >
        <User className="h-4 w-4 text-neutral-500" />
        Profile
      </Link>
      {isSeller && (
        <Link
          to="/seller-dashboard"
          className="flex items-center gap-3 py-2.5 font-lora text-[15px] text-[#1C1C1C]"
        >
          <LayoutDashboard className="h-4 w-4 text-neutral-500" />
          Seller Dashboard
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 py-2.5 font-lora text-[15px] font-medium text-rose-600"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}

/** Stand-in for the CTA when nobody is signed in. */
export function LoginLink() {
  return (
    <Link
      to="/buyer-login"
      className="inline-flex items-center gap-2 rounded-[12px] bg-[#1AC212] px-[18px] py-[10px] font-lora text-[16px] font-semibold leading-none text-white transition-colors hover:bg-[#17ad10]"
    >
      <Store className="h-4 w-4" />
      Login
    </Link>
  );
}

function MenuLink({
  icon: Icon,
  label,
  description,
  onClick,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick: () => void;
  to: string;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-neutral-50"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
      <span className="min-w-0">
        <span className="block font-lora text-sm font-medium text-[#1C1C1C]">{label}</span>
        {description && (
          <span className="block font-lora text-xs text-neutral-500">{description}</span>
        )}
      </span>
    </Link>
  );
}
