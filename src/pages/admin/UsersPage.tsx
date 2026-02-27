import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminGetUsers } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';

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
      <h1 className="text-xl font-bold text-gray-900 mb-6">Users</h1>
      <p className="text-sm text-gray-500 mb-4">Phase 1 provides view-only user management.</p>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 grid md:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'all' | 'admin' | 'customer')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={verification}
          onChange={(e) => setVerification(e.target.value as 'all' | 'verified' | 'unverified')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Verification States</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Failed to load users. Please refresh and try again.
        </div>
      ) : !users?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No users found for the selected filters.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Verified</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {u.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
