import { useState, type CSSProperties } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge, { statusVariant } from '../../components/ui/Badge';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const filterTabs = ['all', ...statuses];

const cardSurfaceStyle: CSSProperties = {
  background: 'var(--surface-card)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-default)',
  boxShadow: 'var(--shadow-sm)',
};

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
  if (isError) {
    return (
      <div
        className="rounded-xl p-4 text-sm"
        style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
      >
        Failed to load orders.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="m-0"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}
        >
          Orders
        </h1>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{filtered?.length ?? 0} orders</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              tab === t ? '' : 'border hover:border-[color:var(--brand-500)]'
            }`}
            style={{
              borderRadius: 'var(--radius-sm)',
              ...(tab === t
                ? { background: 'var(--brand-500)', color: 'var(--text-inverse)', border: '1px solid var(--brand-500)' }
                : { background: 'var(--surface-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }),
            }}
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
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search by order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[--brand-500]"
          style={{ border: '1px solid var(--border-default)', background: 'var(--surface-card)' }}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden" style={cardSurfaceStyle}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-subtle)' }}>
                {['Order ID', 'Status', 'Items', 'Amount', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${h === 'Amount' || h === 'Date' ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border-subtle)]">
              {filtered?.length ? filtered.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-[color:var(--brand-50)]">
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-3.5 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>₹{o.total_price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setSelected(o.id); setNewStatus(o.status); setNotes(''); }}
                      className="px-3 py-1 text-xs font-semibold rounded-md transition-colors hover:bg-[color:var(--brand-100)]"
                      style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-8 text-center" colSpan={6} style={{ color: 'var(--text-tertiary)' }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div
          className="fixed inset-0"
          style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="max-w-sm w-full p-6"
            style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
          >
            <DialogTitle className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Update Order Status</DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-500]"
                  style={{ border: '1px solid var(--border-default)' }}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-500]"
                  style={{ border: '1px solid var(--border-default)' }}
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
