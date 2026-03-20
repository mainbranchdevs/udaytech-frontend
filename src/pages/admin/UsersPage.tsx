import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminGetUsers } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

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
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        {users && <span className="text-sm text-gray-500">{users.length} total</span>}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--brand]"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={verification}
          onChange={(e) => setVerification(e.target.value as any)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load users.</div>
      ) : !users?.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No users found for selected filters.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['User', 'Email', 'Role', 'Verified', 'Joined'].map((h) => (
                    <th key={h} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${h === 'Joined' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const initials = (u.name || u.email).charAt(0).toUpperCase();
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'var(--brand)' }}>
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-900">{u.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 text-xs">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.role === 'admin' ? 'admin' : 'user'}>{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.is_verified ? 'success' : 'warning'}>
                          {u.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-gray-500">
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
