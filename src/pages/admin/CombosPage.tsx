import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetCombos, adminCreateCombo, adminUpdateCombo, adminUploadComboBanner } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Combo } from '../../types';

export default function AdminCombosPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Combo | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', is_published: false });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: combos, isLoading, isError } = useQuery({ queryKey: ['admin', 'combos'], queryFn: () => adminGetCombos().then(r => r.data) });

  const createMut = useMutation({
    mutationFn: () => adminCreateCombo({ ...form, description: form.description || null, price: Number(form.price), items: [] }),
    onSuccess: async (res) => {
      if (modalFile) {
        await adminUploadComboBanner(res.data.id, modalFile);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateCombo(editing!.id, { name: form.name, description: form.description || null, price: Number(form.price), is_published: form.is_published }),
    onSuccess: async () => {
      if (editing && modalFile) {
        await adminUploadComboBanner(editing.id, modalFile);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      closeModal();
    },
  });

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
    setModalFile(null);
    setForm({ name: '', description: '', price: '', is_published: false });
  };

  const isInvalid = !form.name.trim() || !form.price || Number(form.price) <= 0;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load combos.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Combos</h1>
        <Button onClick={() => setCreating(true)}>Add Combo</Button>
      </div>
      {!combos?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No combos yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {combos.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-4">
              {c.banner_image ? (
                <img src={c.banner_image} className="w-full h-32 rounded object-cover mb-3" />
              ) : null}
              <h3 className="font-medium text-gray-900">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{c.description || '—'}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-bold text-indigo-600">₹{c.price}</span>
                <span className="text-xs text-gray-400">{c.items.length} items - {c.is_published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="mt-3 text-right">
                <button
                  onClick={() => {
                    setEditing(c);
                    setForm({ name: c.name, description: c.description || '', price: String(c.price), is_published: c.is_published });
                  }}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={creating || !!editing} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-semibold">{editing ? 'Edit Combo' : 'New Combo'}</DialogTitle>
            <div className="mt-4 space-y-3">
              <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <Input label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (optional)</label>
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
                <Button loading={updateMut.isPending} disabled={isInvalid} onClick={() => updateMut.mutate()}>Save</Button>
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
