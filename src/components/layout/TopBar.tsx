import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import logoIcon from '../../assets/main-logo-removebg.png';

function SunriseLogo() {
  return (
    <Link to="/" className="shrink-0 flex items-center gap-1.5 mr-1">
      <img src={logoIcon} alt="Udaya Tech" className="logo-brand" style={{ width: 30, height: 30 }} />
      <span className="flex items-baseline">
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--brand-700)' }}>
          Udaya
        </span>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--accent-500)' }}>
          Tech
        </span>
      </span>
    </Link>
  );
}

export default function TopBar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 h-14 flex items-center"
        style={{
          background: 'var(--surface-card)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div className="w-full px-4 flex items-center gap-3 md:px-6">
          <SunriseLogo />

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div
              className="flex items-center flex-1 overflow-hidden transition-all"
              style={{
                border: '1.5px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-card)',
              }}
            >
              <div className="flex items-center pl-3">
                <MagnifyingGlassIcon className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-2 py-2 bg-transparent outline-none"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
              />
            </div>
          </form>

          <div className="flex-1 md:hidden" />

          {/* Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Mobile search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 transition-colors"
              style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <Link
                to="/notifications"
                className="relative flex items-center justify-center w-10 h-10 transition-colors"
                style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
              >
                <BellIcon className="h-5 w-5" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent-500)' }}
                />
              </Link>
            ) : (
              <Link to="/login">
                <button
                  className="px-4 py-2 text-white"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 'var(--text-xs)',
                    background: 'var(--brand-600)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  Login
                </button>
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center justify-center w-10 h-10 transition-colors"
              style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
            >
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" style={{ background: 'var(--surface-overlay)' }}>
          <div className="p-4" style={{ background: 'var(--surface-card)' }}>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div
                className="flex items-center flex-1 overflow-hidden"
                style={{
                  border: '1.5px solid var(--border-focus)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-card)',
                  boxShadow: '0 0 0 2px var(--brand-100)',
                }}
              >
                <div className="flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-4 w-4" style={{ color: 'var(--brand-600)' }} />
                </div>
                <input
                  type="text"
                  placeholder="Search products, services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-2 h-11 bg-transparent outline-none"
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-center w-10 h-10"
                style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
                aria-label="Close search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
