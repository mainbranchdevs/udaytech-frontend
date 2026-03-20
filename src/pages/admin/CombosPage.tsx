import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetCombos, adminCreateCombo, adminUpdateCombo, adminUploadComboBanner } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { PencilSquareIcon, RectangleGroupIcon, PhotoIcon } from '@heroicons/react/24/outline';
import type { Combo } from '../../types';

export default function AdminCombosPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Combo | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', is_published: false });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: combos, isLoading, isError } = useQuery({
    queryKey: ['admin', 'combos'],
    queryFn: () => adminGetCombos().then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: () => adminCreateCombo({ ...form, description: form.description || null, price: Number(form.price), items: [] }),
    onSuccess: async (res) => {
      if (modalFile) await adminUploadComboBanner(res.data.id, modalFile);
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateCombo(editing!.id, { name: form.name, description: form.description || null, price: Number(form.price), is_published: form.is_published }),
    onSuccess: async () => {
      if (editing && modalFile) await adminUploadComboBanner(editing.id, modalFile);
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      closeModal();
    },
  });

  const closeModal = () => { setCreating(false); setEditing(null); setModalFile(null); setForm({ name: '', description: '', price: '', is_published: false }); };
  const isInvalid = !form.name.trim() || !form.price || Number(form.price) <= 0;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load combos.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Combos</h1>
        <Button onClick={() => setCreating(true)}>+ Add Combo</Button>
      </div>

      {!combos?.length ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <RectangleGroupIcon className="h-12 w-12 mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No combos yet. Create your first combo!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {combos.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {c.banner_image ? (
                <div className="h-32 overflow-hidden bg-gray-100">
                  <img src={c.banner_image} className="w-full h-full object-cover" alt={c.name} />
                </div>
              ) : (
                <div className="h-32 bg-gray-50 flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-200" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                  <Badge variant={c.is_published ? 'success' : 'warning'}>{c.is_published ? 'Published' : 'Draft'}</Badge>
                </div>
                {c.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">₹{c.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-400">{c.items.length} item{c.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '', price: String(c.price), is_published: c.is_published }); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-[--brand] rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={creating || !!editing} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Combo' : 'New Combo'}</DialogTitle>
            <div className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]" />
              </div>
              <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Banner Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setModalFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded accent-[--brand]" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
              {editing
                ? <Button loading={updateMut.isPending} disabled={isInvalid} onClick={() => updateMut.mutate()}>Save</Button>
                : <Button loading={createMut.isPending} disabled={isInvalid} onClick={() => createMut.mutate()}>Create</Button>
              }
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
