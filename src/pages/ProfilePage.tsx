import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon, HeartIcon, ChatBubbleLeftRightIcon,
  ChevronRightIcon, ArrowRightOnRectangleIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';

const menuSections = [
  {
    title: 'My Activity',
    items: [
      { to: '/orders', icon: ClipboardDocumentListIcon, label: 'My Orders', sub: 'Track, return or buy again' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Profile Hero */}
      <div className="px-4 py-6 flex items-center gap-4" style={{ background: 'var(--brand)' }}>
        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/40 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base">{user.name || 'My Account'}</p>
          <p className="text-blue-100 text-xs truncate">{user.email}</p>
        </div>
        <UserCircleIcon className="h-6 w-6 text-white/60" />
      </div>

      {/* Menu sections */}
      <div className="mt-2 space-y-2">
        {menuSections.map((section) => (
          <div key={section.title} className="bg-white">
            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{section.title}</p>
            {section.items.map(({ to, icon: Icon, label, sub }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0"
              >
                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[--brand]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-300" />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-300 pb-6">
        Udaya Tech &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
