import { useState, type CSSProperties } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminUploadBannerImage } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const cardSurfaceStyle: CSSProperties = {
  background: 'var(--surface-card)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-default)',
  boxShadow: 'var(--shadow-sm)',
};

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
  if (isError) {
    return (
      <div
        className="rounded-xl p-4 text-sm border"
        style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)', color: 'var(--danger)' }}
      >
        Failed to load banners.
      </div>
    );
  }

  const dialogPanelStyle: CSSProperties = {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
  };

  const overlayStyle: CSSProperties = {
    background: 'var(--surface-overlay)',
    backdropFilter: 'blur(4px)',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
          }}
        >
          Banners
        </h1>
        <Button onClick={openCreate}>+ Add Banner</Button>
      </div>

      {!banners?.length ? (
        <div className="p-12 text-center" style={{ ...cardSurfaceStyle, border: '1px solid var(--border-subtle)' }}>
          <PhotoIcon className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No banners yet. Add your first banner!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="overflow-hidden" style={cardSurfaceStyle}>
              {b.image_url ? (
                <div className="aspect-[16/7] overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/7] flex items-center justify-center" style={{ background: 'var(--surface-sunken)' }}>
                  <PhotoIcon className="h-10 w-10" style={{ color: 'var(--text-tertiary)' }} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{b.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Priority: {b.priority}</p>
                  </div>
                  <button
                    onClick={() => toggleMut.mutate({ id: b.id, active: !b.is_active })}
                    className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                    style={
                      b.is_active
                        ? { background: 'var(--success-light)', color: 'var(--success)', borderColor: 'transparent' }
                        : { background: 'var(--surface-sunken)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }
                    }
                  >
                    {b.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:bg-[var(--brand-100)]"
                    style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}
                  >
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
        <div className="fixed inset-0" style={overlayStyle} aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" style={dialogPanelStyle}>
            <DialogTitle className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Banner</DialogTitle>
            <div className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Image URL (or upload file)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Or Upload File</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-lg px-3 py-2 text-sm border" style={{ borderColor: 'var(--border-default)' }} />
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
        <div className="fixed inset-0" style={overlayStyle} aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" style={dialogPanelStyle}>
            <DialogTitle className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Banner</DialogTitle>
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
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded accent-[--brand-500]" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active</span>
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
