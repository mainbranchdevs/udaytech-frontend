import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetServices, adminCreateService, adminUpdateService, adminUploadServiceImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Service } from '../../types';

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', base_price: '', is_published: false });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: services, isLoading, isError } = useQuery({ queryKey: ['admin', 'services'], queryFn: () => adminGetServices().then(r => r.data) });

  const createMut = useMutation({
    mutationFn: () => adminCreateService({ ...form, base_price: Number(form.base_price) }),
    onSuccess: async (res) => {
      if (modalFile) {
        await adminUploadServiceImage(res.data.id, modalFile);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: { name: string; description: string | null; base_price: number; is_published: boolean }) => adminUpdateService(editing!.id, data),
    onSuccess: async () => {
      if (editing && modalFile) {
        await adminUploadServiceImage(editing.id, modalFile);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeModal();
    },
  });

  const closeModal = () => { setCreating(false); setEditing(null); setModalFile(null); setForm({ name: '', description: '', base_price: '', is_published: false }); };

  const isInvalid = !form.name.trim() || !form.base_price || Number(form.base_price) <= 0;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load services.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <Button onClick={() => setCreating(true)}>Add Service</Button>
      </div>
      {!services?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No services yet.</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services?.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.image_url ? <img src={s.image_url} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-gray-100" />}
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">₹{s.base_price}</td>
                <td className="px-4 py-3 text-center">{s.is_published ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description || '', base_price: String(s.base_price), is_published: s.is_published }); }} className="text-indigo-600 hover:underline text-xs">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <Dialog open={creating || !!editing} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-semibold">{editing ? 'Edit Service' : 'New Service'}</DialogTitle>
            <div className="mt-4 space-y-3">
              <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <Input label="Base Price" type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image File (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setModalFile(e.target.files?.[0] || null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              {editing ? (
                <Button loading={updateMut.isPending} disabled={isInvalid} onClick={() => updateMut.mutate({ name: form.name, description: form.description || null, base_price: Number(form.base_price), is_published: form.is_published })}>Save</Button>
              ) : (
                <Button loading={createMut.isPending} disabled={isInvalid} onClick={() => createMut.mutate()}>Create</Button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
