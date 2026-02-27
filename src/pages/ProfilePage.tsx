import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRightOnRectangleIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const links = [
    { to: '/orders', icon: ClipboardDocumentListIcon, label: 'My Orders' },
    { to: '/wishlist', icon: HeartIcon, label: 'Wishlist' },
    { to: '/support', icon: ChatBubbleLeftRightIcon, label: 'Support' },
  ];

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold mx-auto">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-gray-900">{user.name || 'Guest'}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="mt-6 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <Icon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="danger" className="w-full" onClick={logout}>
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
