import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminUploadBannerImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    image_url: '',
    redirect_type: '',
    redirect_id: '',
    priority: '0',
    start_date: '',
    end_date: '',
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);

  const { data: banners, isLoading, isError } = useQuery({ queryKey: ['admin', 'banners'], queryFn: () => adminGetBanners().then(r => r.data) });

  const createMut = useMutation({
    mutationFn: async (payload: {
      title: string;
      image_url: string;
      redirect_type: string | null;
      redirect_id: string | null;
      priority: number;
      start_date: string | null;
      end_date: string | null;
    }) => {
      let imageUrl = payload.image_url.trim();
      if (file) {
        const uploadRes = await adminUploadBannerImage(file);
        imageUrl = uploadRes.data.image_url;
      }
      return adminCreateBanner({ ...payload, image_url: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      setCreating(false);
      setFile(null);
      setForm({
        title: '',
        image_url: '',
        redirect_type: '',
        redirect_id: '',
        priority: '0',
        start_date: '',
        end_date: '',
        is_active: true,
      });
    },
  });

  const updateMut = useMutation({
    mutationFn: () => {
      if (!editingId) throw new Error('No banner selected');
      return adminUpdateBanner(editingId, {
        title: form.title.trim(),
        image_url: form.image_url.trim(),
        redirect_type: form.redirect_type.trim() || null,
        redirect_id: form.redirect_id.trim() || null,
        priority: Number(form.priority),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_active: form.is_active,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminUpdateBanner(id, { is_active: active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  });

  const isInvalid = !form.title.trim() || (!form.image_url.trim() && !file);
  const isUpdateInvalid = !form.title.trim() || !form.image_url.trim();

  const openEdit = (banner: {
    id: string;
    title: string;
    image_url: string;
    redirect_type: string | null;
    redirect_id: string | null;
    priority: number;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
  }) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      image_url: banner.image_url,
      redirect_type: banner.redirect_type ?? '',
      redirect_id: banner.redirect_id ?? '',
      priority: String(banner.priority),
      start_date: banner.start_date ?? '',
      end_date: banner.end_date ?? '',
      is_active: banner.is_active,
    });
    setFile(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setFile(null);
    setForm({
      title: '',
      image_url: '',
      redirect_type: '',
      redirect_id: '',
      priority: '0',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setCreating(true);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load banners.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Banners</h1>
        <Button onClick={openCreate}>Add Banner</Button>
      </div>
      {!banners?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No banners yet.</div>
      ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src={b.image_url} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{b.title}</p>
                <p className="text-xs text-gray-500">Priority: {b.priority}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => openEdit(b)}>Edit</Button>
                <button
                  onClick={() => toggleMut.mutate({ id: b.id, active: !b.is_active })}
                  className={`text-xs px-2 py-1 rounded ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {b.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <Dialog open={creating} onClose={() => setCreating(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-semibold">New Banner</DialogTitle>
            <div className="mt-4 space-y-3">
              <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Input label="Image URL (optional if file selected)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              <Input label="Redirect Type" value={form.redirect_type} onChange={e => setForm({ ...form, redirect_type: e.target.value })} />
              <Input label="Redirect ID" value={form.redirect_id} onChange={e => setForm({ ...form, redirect_id: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner File</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <Input label="Priority" type="number" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} />
              <Input label="Start Date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              <Input label="End Date" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button>
              <Button loading={createMut.isPending} disabled={isInvalid} onClick={() => createMut.mutate({
                title: form.title.trim(),
                image_url: form.image_url.trim(),
                redirect_type: form.redirect_type.trim() || null,
                redirect_id: form.redirect_id.trim() || null,
                priority: Number(form.priority),
                start_date: form.start_date || null,
                end_date: form.end_date || null,
              })}>Create</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={!!editingId} onClose={() => setEditingId(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <DialogTitle className="text-lg font-semibold">Edit Banner</DialogTitle>
            <div className="mt-4 space-y-3">
              <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Input label="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              <Input label="Redirect Type" value={form.redirect_type} onChange={e => setForm({ ...form, redirect_type: e.target.value })} />
              <Input label="Redirect ID" value={form.redirect_id} onChange={e => setForm({ ...form, redirect_id: e.target.value })} />
              <Input label="Priority" type="number" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} />
              <Input label="Start Date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              <Input label="End Date" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} disabled={isUpdateInvalid} onClick={() => updateMut.mutate()}>
                Save
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
