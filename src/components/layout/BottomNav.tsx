import { NavLink } from 'react-router-dom';
import {
  HomeIcon, ShoppingBagIcon, HeartIcon, UserIcon, Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  ShoppingBagIcon as BagSolid,
  HeartIcon as HeartSolid,
  UserIcon as UserSolid,
  Squares2X2Icon as GridSolid,
} from '@heroicons/react/24/solid';

const links = [
  { to: '/', icon: HomeIcon, activeIcon: HomeSolid, label: 'Home', end: true },
  { to: '/products', icon: Squares2X2Icon, activeIcon: GridSolid, label: 'Categories' },
  { to: '/orders', icon: ShoppingBagIcon, activeIcon: BagSolid, label: 'Orders' },
  { to: '/wishlist', icon: HeartIcon, activeIcon: HeartSolid, label: 'Wishlist' },
  { to: '/profile', icon: UserIcon, activeIcon: UserSolid, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50">
      <div className="max-w-[480px] mx-auto glass border-t border-white/30 shadow-lg">
        <div className="flex justify-around">
          {links.map(({ to, icon: Icon, activeIcon: ActiveIcon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-2 gap-0.5 relative min-w-[52px] transition-colors ${
                  isActive ? 'text-[--brand]' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <>
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b bg-[--brand]" />
                      <ActiveIcon className="h-6 w-6" />
                    </>
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        {/* Safe area padding for iOS */}
        <div className="h-safe-bottom bg-transparent" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </nav>
  );
}
