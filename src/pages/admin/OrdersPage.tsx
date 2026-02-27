import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const { data: orders, isLoading, isError } = useQuery({ queryKey: ['admin', 'orders'], queryFn: () => adminGetOrders().then(r => r.data) });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateOrderStatus(selected!, { status: newStatus, notes: notes || undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }); setSelected(null); },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load orders.</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Orders</h1>
      {!orders?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No orders yet.</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Items</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders?.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3 text-right font-medium">₹{o.total_price.toLocaleString()}</td>
                <td className="px-4 py-3">{o.items.length} items</td>
                <td className="px-4 py-3 text-right text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setSelected(o.id); setNewStatus(o.status); setNotes(''); }} className="text-indigo-600 hover:underline text-xs">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <DialogTitle className="text-lg font-semibold">Update Order Status</DialogTitle>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} disabled={!newStatus} onClick={() => updateMut.mutate()}>Update</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
