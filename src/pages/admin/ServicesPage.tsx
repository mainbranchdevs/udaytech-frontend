import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetServices, adminCreateService, adminUpdateService, adminUploadServiceImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { PencilSquareIcon, PhotoIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import type { Service } from '../../types';

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', base_price: '', is_published: false });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: () => adminGetServices().then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: () => adminCreateService({ ...form, base_price: Number(form.base_price) }),
    onSuccess: async (res) => {
      if (modalFile) await adminUploadServiceImage(res.data.id, modalFile);
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: any) => adminUpdateService(editing!.id, data),
    onSuccess: async () => {
      if (editing && modalFile) await adminUploadServiceImage(editing.id, modalFile);
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeModal();
    },
  });

  const closeModal = () => { setCreating(false); setEditing(null); setModalFile(null); setForm({ name: '', description: '', base_price: '', is_published: false }); };
  const isInvalid = !form.name.trim() || !form.base_price || Number(form.base_price) <= 0;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load services.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <Button onClick={() => setCreating(true)}>+ Add Service</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {!services?.length ? (
          <div className="p-12 text-center"><WrenchScrewdriverIcon className="h-10 w-10 mx-auto text-gray-200 mb-3" /><p className="text-gray-400 text-sm">No services yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Service', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${h === 'Price' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {s.image_url ? <img src={s.image_url} className="h-10 w-10 rounded-lg object-cover border border-gray-100" alt={s.name} /> : <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"><PhotoIcon className="h-5 w-5 text-gray-300" /></div>}
                        <div><p className="font-semibold text-gray-900">{s.name}</p>{s.description && <p className="text-xs text-gray-400 line-clamp-1">{s.description}</p>}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">₹{s.base_price.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5"><Badge variant={s.is_published ? 'success' : 'warning'}>{s.is_published ? 'Published' : 'Draft'}</Badge></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description || '', base_price: String(s.base_price), is_published: s.is_published }); }} className="p-1.5 text-gray-400 hover:text-[--brand] hover:bg-blue-50 rounded-lg transition-colors">
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={creating || !!editing} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Service' : 'New Service'}</DialogTitle>
            <div className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]" />
              </div>
              <Input label="Base Price" type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setModalFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded accent-[--brand]" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
              {editing ? <Button loading={updateMut.isPending} disabled={isInvalid} onClick={() => updateMut.mutate({ name: form.name, description: form.description || null, base_price: Number(form.base_price), is_published: form.is_published })}>Save</Button>
                : <Button loading={createMut.isPending} disabled={isInvalid} onClick={() => createMut.mutate()}>Create</Button>}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
