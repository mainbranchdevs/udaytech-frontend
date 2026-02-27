import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-gray-500 md:hidden">
            <Link to="/admin" className="text-indigo-600 font-bold">Admin</Link>
          </h2>
          <div className="ml-auto">
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
