import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon, HeartIcon, ChatBubbleLeftRightIcon,
  ChevronRightIcon, ArrowRightOnRectangleIcon, ShoppingCartIcon,
} from '@heroicons/react/24/outline';

const menuSections = [
  {
    title: 'My Activity',
    items: [
      { to: '/orders', icon: ClipboardDocumentListIcon, label: 'My Orders', sub: 'Track, return or buy again' },
      { to: '/cart', icon: ShoppingCartIcon, label: 'My Cart', sub: 'Items you want to buy' },
      { to: '/wishlist', icon: HeartIcon, label: 'My Wishlist', sub: 'Saved products' },
    ],
  },
  {
    title: 'Help',
    items: [
      { to: '/support', icon: ChatBubbleLeftRightIcon, label: 'Support', sub: 'Chat with us' },
    ],
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div>
      {/* Profile Hero */}
      <div
        className="px-5 py-8 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-500))' }}
      >
        <div
          className="h-16 w-16 flex items-center justify-center text-white text-2xl font-bold shrink-0"
          style={{
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'white' }}>
            {user.name || 'My Account'}
          </p>
          <p className="truncate mt-0.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--brand-200)' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-2 flex flex-col gap-2">
        {menuSections.map((section) => (
          <div key={section.title} style={{ background: 'var(--surface-card)' }}>
            <p
              className="px-4 pt-3 pb-1"
              style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              {section.title}
            </p>
            {section.items.map(({ to, icon: Icon, label, sub }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="h-10 w-10 flex items-center justify-center shrink-0"
                  style={{ background: 'var(--brand-50)', borderRadius: 'var(--radius-full)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'var(--brand-600)' }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{sub}</p>
                </div>
                <ChevronRightIcon className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 transition-colors"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--danger-light)',
            color: 'var(--danger)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
          }}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="mt-6 text-center pb-6" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
        UdayaTech &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
