import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
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
    <header className="sticky top-0 z-50" style={{ background: 'var(--brand)' }}>
      <div className="max-w-[480px] mx-auto px-3 py-2.5 flex items-center gap-2">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex flex-col leading-none mr-1">
          <span className="text-white font-extrabold text-base tracking-tight" style={{ fontStyle: 'italic' }}>Udaya</span>
          <span className="text-yellow-300 text-[10px] font-semibold -mt-0.5 tracking-wide">Tech</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex items-center bg-white rounded overflow-hidden shadow-sm">
            <div className="flex items-center pl-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-2 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-bold text-[--brand]"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="p-1.5 text-white/80 hover:text-white transition-colors">
                <HeartIcon className="h-5 w-5" />
              </Link>
              <Link to="/notifications" className="p-1.5 text-white/80 hover:text-white transition-colors">
                <BellIcon className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 bg-white text-[--brand] text-xs font-bold rounded shadow-sm hover:bg-yellow-50 transition-colors"
            >
              Login
            </Link>
          )}
          <Link to="/profile" className="p-1.5 text-white/80 hover:text-white transition-colors">
            <UserCircleIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
