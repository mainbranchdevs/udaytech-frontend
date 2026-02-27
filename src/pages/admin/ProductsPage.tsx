import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminUploadProductImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Product } from '../../types';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', base_price: '', discount_price: '', category_id: '', is_published: false });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: products, isLoading, isError } = useQuery({ queryKey: ['admin', 'products'], queryFn: () => adminGetProducts().then(r => r.data) });

  const createMut = useMutation({
    mutationFn: () => adminCreateProduct({ ...form, base_price: Number(form.base_price), discount_price: form.discount_price ? Number(form.discount_price) : null, category_id: form.category_id ? Number(form.category_id) : null, attributes: [] }),
    onSuccess: async (res) => {
      if (modalFile) {
        await adminUploadProductImage(res.data.id, modalFile, true);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: { name: string; description: string | null; base_price: number; discount_price: number | null; category_id: number | null; is_published: boolean }) => adminUpdateProduct(editing!.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); closeModal(); },
  });

  const uploadMut = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => adminUploadProductImage(id, file, true),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const closeModal = () => { setCreating(false); setEditing(null); setModalFile(null); setForm({ name: '', description: '', base_price: '', discount_price: '', category_id: '', is_published: false }); };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', base_price: String(p.base_price), discount_price: p.discount_price ? String(p.discount_price) : '', category_id: p.category_id ? String(p.category_id) : '', is_published: p.is_published });
  };

  const isInvalid = !form.name.trim() || !form.base_price || Number(form.base_price) <= 0;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load products.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setCreating(true)}>Add Product</Button>
      </div>

      {!products?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No products yet.</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Published</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] ? <img src={p.images[0].image_url} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-gray-100" />}
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">₹{p.base_price}</td>
                <td className="px-4 py-3 text-center">{p.is_published ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">{p.is_active ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline text-xs">Edit</button>
                  <label className="text-xs text-gray-500 hover:text-indigo-600 cursor-pointer">
                    Upload
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadMut.mutate({ id: p.id, file: e.target.files[0] })} />
                  </label>
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
            <DialogTitle className="text-lg font-semibold">{editing ? 'Edit Product' : 'New Product'}</DialogTitle>
            <div className="mt-4 space-y-3">
              <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Base Price" type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} />
                <Input label="Discount Price" type="number" value={form.discount_price} onChange={e => setForm({ ...form, discount_price: e.target.value })} />
              </div>
              <Input label="Category ID" type="number" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} />
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setModalFile(e.target.files?.[0] || null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              )}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              {editing ? (
                <Button loading={updateMut.isPending} disabled={isInvalid} onClick={() => updateMut.mutate({ name: form.name, description: form.description || null, base_price: Number(form.base_price), discount_price: form.discount_price ? Number(form.discount_price) : null, category_id: form.category_id ? Number(form.category_id) : null, is_published: form.is_published })}>Save</Button>
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
