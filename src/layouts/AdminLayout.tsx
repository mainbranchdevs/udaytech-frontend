import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAuth } from '../hooks/useAuth';
import { BellIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      <Link to="/admin" className="hover:text-gray-800 font-medium">Admin</Link>
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300" />
          <span className="capitalize font-medium text-gray-700">{part}</span>
        </span>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const initials = user ? (user.name || user.email).charAt(0).toUpperCase() : 'A';

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f5f7' }}>
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          <div className="flex-1">
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--admin-sidebar)' }}>
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
