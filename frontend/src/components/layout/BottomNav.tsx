import { NavLink } from 'react-router-dom';
import {
  HomeIcon, Squares2X2Icon, ShoppingBagIcon, ShoppingCartIcon, UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  Squares2X2Icon as GridSolid,
  ShoppingBagIcon as BagSolid,
  ShoppingCartIcon as CartSolid,
  UserIcon as UserSolid,
} from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';

const links = [
  { to: '/', icon: HomeIcon, activeIcon: HomeSolid, label: 'Home', end: true },
  { to: '/products', icon: Squares2X2Icon, activeIcon: GridSolid, label: 'Browse' },
  { to: '/orders', icon: ShoppingBagIcon, activeIcon: BagSolid, label: 'Orders' },
  { to: '/cart', icon: ShoppingCartIcon, activeIcon: CartSolid, label: 'Cart' },
  { to: '/profile', icon: UserIcon, activeIcon: UserSolid, label: 'You' },
];

export default function BottomNav() {
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div
        className="w-full flex justify-around h-16"
        style={{
          background: 'var(--surface-card)',
          borderTop: '1px solid var(--border-subtle)',
          boxShadow: '0 -4px 12px rgba(10, 126, 114, 0.08)',
        }}
      >
        {links.map(({ to, icon: Icon, activeIcon: ActiveIcon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center relative min-w-[48px] px-2 transition-colors ${
                isActive ? '' : ''
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <>
                    <ActiveIcon className="h-[22px] w-[22px]" style={{ color: 'var(--brand-600)' }} />
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px]"
                      style={{ background: 'var(--brand-500)', borderRadius: 'var(--radius-full)' }}
                    />
                  </>
                ) : (
                  <Icon className="h-[22px] w-[22px]" style={{ color: 'var(--text-tertiary)' }} />
                )}

                {label === 'Cart' && itemCount > 0 && (
                  <span
                    className="absolute top-1.5 right-0 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold text-white px-1"
                    style={{ background: 'var(--accent-500)', borderRadius: 'var(--radius-full)' }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}

                <span
                  className="text-[10px] font-semibold mt-0.5"
                  style={{ color: isActive ? 'var(--brand-600)' : 'var(--text-tertiary)' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom)', background: 'var(--surface-card)' }} />
    </nav>
  );
}
