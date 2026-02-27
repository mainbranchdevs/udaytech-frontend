import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function TopBar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-lg font-bold text-indigo-600 shrink-0">Udaya Tech</Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/notifications" className="p-2 text-gray-500 hover:text-indigo-600">
              <BellIcon className="h-6 w-6" />
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
