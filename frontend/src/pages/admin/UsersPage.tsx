import { useMemo, useState, type CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminGetUsers } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const cardSurfaceStyle: CSSProperties = {
  background: 'var(--surface-card)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-default)',
  boxShadow: 'var(--shadow-sm)',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'admin' | 'customer'>('all');
  const [verification, setVerification] = useState<'all' | 'verified' | 'unverified'>('all');

  const queryParams = useMemo(() => ({
    search: search.trim() || undefined,
    role: role === 'all' ? undefined : role,
    is_verified: verification === 'all' ? undefined : verification === 'verified',
  }), [role, search, verification]);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', queryParams],
    queryFn: () => adminGetUsers(queryParams).then((r) => r.data),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
          }}
        >
          Users
        </h1>
        {users && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{users.length} total</span>}
      </div>

      {/* Filters */}
      <div className="p-4 mb-4 flex flex-wrap gap-3" style={{ ...cardSurfaceStyle, border: '1px solid var(--border-subtle)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[--brand-500] border"
            style={{ borderColor: 'var(--border-default)' }}
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-500] border"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={verification}
          onChange={(e) => setVerification(e.target.value as any)}
          className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-500] border"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
      ) : isError ? (
        <div
          className="rounded-xl p-4 text-sm border"
          style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)', color: 'var(--danger)' }}
        >
          Failed to load users.
        </div>
      ) : !users?.length ? (
        <div className="p-8 text-center" style={{ ...cardSurfaceStyle, border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
          No users found for selected filters.
        </div>
      ) : (
        <div className="overflow-hidden" style={{ ...cardSurfaceStyle, border: '1px solid var(--border-subtle)' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b" style={{ background: 'var(--surface-sunken)', borderColor: 'var(--border-subtle)' }}>
                  {['User', 'Email', 'Role', 'Verified', 'Joined'].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${h === 'Joined' ? 'text-right' : 'text-left'}`}
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {users.map((u) => {
                  const initials = (u.name || u.email).charAt(0).toUpperCase();
                  return (
                    <tr key={u.id} className="transition-colors hover:!bg-[var(--brand-50)]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: 'var(--brand-600)' }}
                          >
                            {initials}
                          </div>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{u.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.role === 'admin' ? 'admin' : 'user'}>{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.is_verified ? 'success' : 'warning'}>
                          {u.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
