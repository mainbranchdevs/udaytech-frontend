import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAuth } from '../hooks/useAuth';
import { BellIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ToastProvider } from '../components/ui/Toast';

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  return (
    <nav className="flex items-center gap-1" style={{ fontSize: 'var(--text-sm)' }}>
      <Link to="/admin" className="font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
        Admin
      </Link>
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRightIcon className="h-3.5 w-3.5" style={{ color: 'var(--text-tertiary)' }} />
          <span className="capitalize font-medium" style={{ color: 'var(--text-primary)' }}>{part}</span>
        </span>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const initials = user ? (user.name || user.email).charAt(0).toUpperCase() : 'A';

  return (
    <ToastProvider>
    <div className="min-h-screen flex" style={{ background: 'var(--surface-page)' }}>
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-16 flex items-center px-6 gap-4 shrink-0"
          style={{
            background: 'var(--surface-card)',
            borderBottom: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div className="flex-1">
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-2 transition-colors"
              style={{ color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)' }}
            >
              <BellIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid var(--border-default)' }}>
              <div
                className="h-8 w-8 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'var(--admin-bg)', borderRadius: 'var(--radius-full)' }}
              >
                {initials}
              </div>
              <div className="hidden sm:block">
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name || 'Admin'}
                </p>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-2 font-medium transition-colors"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
