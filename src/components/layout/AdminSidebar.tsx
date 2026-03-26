import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Squares2X2Icon, ShoppingBagIcon, WrenchScrewdriverIcon,
  RectangleGroupIcon, ClipboardDocumentListIcon, ChatBubbleLeftRightIcon,
  PhotoIcon, TagIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import logoIcon from '../../assets/main-logo-removebg.png';

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
      className="hidden md:flex flex-col min-h-screen transition-all duration-300 shrink-0"
      style={{
        width: collapsed ? '64px' : '240px',
        background: 'var(--admin-bg)',
      }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 h-16 shrink-0 ${collapsed ? 'justify-center' : ''}`}
        style={{ borderBottom: '1px solid rgba(199, 255, 240, 0.1)' }}
      >
        <img
          src={logoIcon}
          alt="Udaya Tech"
          className={collapsed ? 'logo-amber' : 'logo-light'}
          style={{ width: collapsed ? 24 : 28, height: collapsed ? 24 : 28 }}
        />
        {!collapsed && (
          <div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: 'var(--text-base)',
                  color: 'var(--admin-text)',
                }}
              >
                Udaya
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: 'var(--text-base)',
                  color: 'var(--admin-accent)',
                  marginLeft: '2px',
                }}
              >
                Tech
              </span>
            </div>
            <p style={{ color: 'var(--admin-text-dim)', fontSize: 'var(--text-2xs)', letterSpacing: '0.08em' }}>
              ADMIN
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p
          className={collapsed ? 'hidden' : ''}
          style={{
            color: 'var(--admin-text-dim)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 16px',
            marginBottom: '8px',
          }}
        >
          Navigation
        </p>
        {links.map(({ to, icon: Icon, label, end }) => {
          const isActive = end ? location.pathname === to : location.pathname.startsWith(to + '/') || location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 text-sm transition-all relative ${collapsed ? 'justify-center' : ''}`}
              style={{
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--admin-text)' : 'var(--admin-text-dim)',
                background: isActive ? 'var(--admin-bg-hover)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--admin-bg-hover)';
                  e.currentTarget.style.color = 'var(--admin-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--admin-text-dim)';
                }
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1 bottom-1 w-[3px]"
                  style={{ background: 'var(--admin-accent)', borderRadius: '0 var(--radius-full) var(--radius-full) 0' }}
                />
              )}
              <Icon className="shrink-0" style={{ height: 18, width: 18 }} />
              {!collapsed && <span style={{ fontWeight: 500 }}>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle - integrated at bottom */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 transition-colors"
        style={{
          color: 'var(--admin-text-dim)',
          borderTop: '1px solid rgba(199, 255, 240, 0.1)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRightIcon className="h-4 w-4" />
          : <ChevronLeftIcon className="h-4 w-4" />}
      </button>
    </aside>
  );
}
