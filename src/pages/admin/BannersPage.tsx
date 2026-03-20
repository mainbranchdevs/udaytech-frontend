import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminUploadBannerImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', image_url: '', redirect_type: '', redirect_id: '', priority: '0', start_date: '', end_date: '', is_active: true });
  const [file, setFile] = useState<File | null>(null);

  const { data: banners, isLoading, isError } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: () => adminGetBanners().then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: async (payload: any) => {
      let imageUrl = payload.image_url.trim();
      if (file) { const uploadRes = await adminUploadBannerImage(file); imageUrl = uploadRes.data.image_url; }
      return adminCreateBanner({ ...payload, image_url: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      setCreating(false); setFile(null);
      setForm({ title: '', image_url: '', redirect_type: '', redirect_id: '', priority: '0', start_date: '', end_date: '', is_active: true });
    },
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateBanner(editingId!, {
      title: form.title.trim(), image_url: form.image_url.trim(),
      redirect_type: form.redirect_type.trim() || null, redirect_id: form.redirect_id.trim() || null,
      priority: Number(form.priority), start_date: form.start_date || null, end_date: form.end_date || null, is_active: form.is_active,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }); setEditingId(null); },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminUpdateBanner(id, { is_active: active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });

  const openEdit = (b: any) => {
    setEditingId(b.id);
    setForm({ title: b.title, image_url: b.image_url, redirect_type: b.redirect_type ?? '', redirect_id: b.redirect_id ?? '', priority: String(b.priority), start_date: b.start_date ?? '', end_date: b.end_date ?? '', is_active: b.is_active });
    setFile(null);
  };
  const openCreate = () => { setEditingId(null); setFile(null); setForm({ title: '', image_url: '', redirect_type: '', redirect_id: '', priority: '0', start_date: '', end_date: '', is_active: true }); setCreating(true); };
  const isInvalid = !form.title.trim() || (!form.image_url.trim() && !file);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load banners.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Banners</h1>
        <Button onClick={openCreate}>+ Add Banner</Button>
      </div>

      {!banners?.length ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <PhotoIcon className="h-12 w-12 mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No banners yet. Add your first banner!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {b.image_url ? (
                <div className="aspect-[16/7] overflow-hidden bg-gray-100">
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/7] bg-gray-100 flex items-center justify-center">
                  <PhotoIcon className="h-10 w-10 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Priority: {b.priority}</p>
                  </div>
                  <button
                    onClick={() => toggleMut.mutate({ id: b.id, active: !b.is_active })}
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {b.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(b)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-[--brand] rounded-lg hover:bg-blue-100 transition-colors">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={creating} onClose={() => setCreating(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">New Banner</DialogTitle>
            <div className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Image URL (or upload file)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Or Upload File</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Redirect Type" value={form.redirect_type} onChange={(e) => setForm({ ...form, redirect_type: e.target.value })} />
                <Input label="Redirect ID" value={form.redirect_id} onChange={(e) => setForm({ ...form, redirect_id: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
                <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              <Button loading={createMut.isPending} disabled={isInvalid} onClick={() => createMut.mutate({ title: form.title.trim(), image_url: form.image_url.trim(), redirect_type: form.redirect_type.trim() || null, redirect_id: form.redirect_id.trim() || null, priority: Number(form.priority), start_date: form.start_date || null, end_date: form.end_date || null })}>Create</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingId} onClose={() => setEditingId(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">Edit Banner</DialogTitle>
            <div className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Redirect Type" value={form.redirect_type} onChange={(e) => setForm({ ...form, redirect_type: e.target.value })} />
                <Input label="Redirect ID" value={form.redirect_id} onChange={(e) => setForm({ ...form, redirect_id: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
                <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded accent-[--brand]" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} disabled={!form.title.trim() || !form.image_url.trim()} onClick={() => updateMut.mutate()}>Save</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
