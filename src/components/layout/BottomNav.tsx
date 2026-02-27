import { NavLink } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';

const links = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/orders', icon: ShoppingBagIcon, label: 'Orders' },
  { to: '/wishlist', icon: HeartIcon, label: 'Wishlist' },
  { to: '/profile', icon: UserIcon, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs ${isActive ? 'text-indigo-600' : 'text-gray-500'}`
            }
          >
            <Icon className="h-6 w-6" />
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
