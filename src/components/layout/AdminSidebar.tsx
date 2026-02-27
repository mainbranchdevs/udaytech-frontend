import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon, ShoppingBagIcon, WrenchScrewdriverIcon,
  RectangleGroupIcon, ClipboardDocumentListIcon, ChatBubbleLeftRightIcon,
  PhotoIcon, TagIcon, UsersIcon,
} from '@heroicons/react/24/outline';

const links = [
  { to: '/admin', icon: Squares2X2Icon, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: ShoppingBagIcon, label: 'Products' },
  { to: '/admin/services', icon: WrenchScrewdriverIcon, label: 'Services' },
  { to: '/admin/combos', icon: RectangleGroupIcon, label: 'Combos' },
  { to: '/admin/categories', icon: TagIcon, label: 'Categories' },
  { to: '/admin/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
  { to: '/admin/support', icon: ChatBubbleLeftRightIcon, label: 'Support' },
  { to: '/admin/banners', icon: PhotoIcon, label: 'Banners' },
  { to: '/admin/users', icon: UsersIcon, label: 'Users' },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-60 flex-col bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-indigo-600">Udaya Tech</h1>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
