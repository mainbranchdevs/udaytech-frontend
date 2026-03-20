import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminUploadProductImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { MagnifyingGlassIcon, PencilSquareIcon, PhotoIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../types';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', base_price: '', discount_price: '', category_id: '', is_published: false,
  });
  const [modalFile, setModalFile] = useState<File | null>(null);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => adminGetProducts().then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: () => adminCreateProduct({
      ...form,
      base_price: Number(form.base_price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      attributes: [],
    }),
    onSuccess: async (res) => {
      if (modalFile) await adminUploadProductImage(res.data.id, modalFile, true);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: any) => adminUpdateProduct(editing!.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); closeModal(); },
  });

  const uploadMut = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => adminUploadProductImage(id, file, true),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const closeModal = () => {
    setCreating(false); setEditing(null); setModalFile(null);
    setForm({ name: '', description: '', base_price: '', discount_price: '', category_id: '', is_published: false });
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', base_price: String(p.base_price), discount_price: p.discount_price ? String(p.discount_price) : '', category_id: p.category_id ? String(p.category_id) : '', is_published: p.is_published });
  };
  const isInvalid = !form.name.trim() || !form.base_price || Number(form.base_price) <= 0;

  const filtered = products?.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load products.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setCreating(true)}>+ Add Product</Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--brand] bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Product', 'Base Price', 'Discount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${['Base Price', 'Discount'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.length ? filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0].image_url} className="h-10 w-10 rounded-lg object-cover border border-gray-100" alt={p.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <PhotoIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        {p.description && <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900">₹{p.base_price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right text-green-600 font-semibold">
                    {p.discount_price ? `₹${p.discount_price.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge variant={p.is_published ? 'success' : 'warning'}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {!p.is_active && <Badge variant="danger">Inactive</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-[--brand] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <label className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer" title="Upload image">
                        <PhotoIcon className="h-4 w-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadMut.mutate({ id: p.id, file: e.target.files[0] })} />
                      </label>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={5}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={creating || !!editing} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Product' : 'New Product'}</DialogTitle>
            <div className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Base Price" type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
                <Input label="Discount Price" type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
              </div>
              <Input label="Category ID" type="number" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
              {!editing && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Product Image (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setModalFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300 accent-[--brand]" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
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
