import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Squares2X2Icon, ShoppingBagIcon, WrenchScrewdriverIcon,
  RectangleGroupIcon, ClipboardDocumentListIcon, ChatBubbleLeftRightIcon,
  PhotoIcon, TagIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon,
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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col min-h-screen transition-all duration-300 relative shrink-0"
      style={{
        width: collapsed ? '64px' : '240px',
        background: 'var(--admin-sidebar)',
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-white/10 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div>
            <span className="text-white font-extrabold text-base italic">Udaya</span>
            <span className="font-extrabold text-base ml-0.5" style={{ color: 'var(--admin-accent)' }}>Tech</span>
            <p className="text-white/40 text-[10px] tracking-wider">ADMIN</p>
          </div>
        )}
        {collapsed && (
          <span className="text-sm font-extrabold italic" style={{ color: 'var(--admin-accent)' }}>UT</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className={`text-white/30 text-[10px] font-bold uppercase tracking-widest px-4 mb-2 ${collapsed ? 'hidden' : ''}`}>
          Navigation
        </p>
        {links.map(({ to, icon: Icon, label, end }) => {
          const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all relative
                ${isActive
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                  style={{ background: 'var(--admin-accent)' }}
                />
              )}
              <Icon className={`shrink-0 ${isActive ? 'text-white' : ''}`} style={{ height: 18, width: 18 }} />
              {!collapsed && <span className="font-medium">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-20 h-6 w-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center z-50 transition-colors hover:bg-gray-50`}
      >
        {collapsed
          ? <ChevronRightIcon className="h-3 w-3 text-gray-600" />
          : <ChevronLeftIcon className="h-3 w-3 text-gray-600" />
        }
      </button>
    </aside>
  );
}
