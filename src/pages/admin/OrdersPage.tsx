import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge, { statusVariant } from '../../components/ui/Badge';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const filterTabs = ['all', ...statuses];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminGetOrders().then((r) => r.data),
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateOrderStatus(selected!, { status: newStatus, notes: notes || undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }); setSelected(null); },
  });

  const filtered = orders?.filter((o) => {
    const matchTab = tab === 'all' || o.status === tab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load orders.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <span className="text-sm text-gray-500">{filtered?.length ?? 0} orders</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition-colors ${
              tab === t ? 'bg-[--brand] text-white border-[--brand]' : 'bg-white text-gray-600 border-gray-200 hover:border-[--brand]'
            }`}
          >
            {t}
            <span className="ml-1.5 opacity-60">
              {t === 'all' ? orders?.length : orders?.filter((o) => o.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--brand] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order ID', 'Status', 'Items', 'Amount', 'Date', ''].map((h) => (
                  <th key={h} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${h === 'Amount' || h === 'Date' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.length ? filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                  <td className="px-5 py-3.5 text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900">₹{o.total_price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setSelected(o.id); setNewStatus(o.status); setNotes(''); }}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-50 text-[--brand] hover:bg-blue-100 transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={6}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">Update Order Status</DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} disabled={!newStatus} onClick={() => updateMut.mutate()}>Save</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
