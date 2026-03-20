import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import type { Category } from '../../types';
import { PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingParentId, setEditingParentId] = useState('');

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => adminGetCategories().then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: () => adminCreateCategory({ name, parent_id: parentId ? Number(parentId) : undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setName(''); setParentId(''); },
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateCategory(editing!.id, { name: editingName, parent_id: editingParentId ? Number(editingParentId) : null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setEditing(null); setEditingName(''); setEditingParentId(''); },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load categories.</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Categories</h1>

      {/* Quick add form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Add New Category</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" />
          </div>
          <div className="w-32">
            <Input label="Parent ID" type="number" value={parentId} onChange={(e) => setParentId(e.target.value)} placeholder="Optional" />
          </div>
          <Button onClick={() => createMut.mutate()} loading={createMut.isPending} disabled={!name.trim()}>Add Category</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {!categories?.length ? (
          <div className="p-12 text-center"><TagIcon className="h-10 w-10 mx-auto text-gray-200 mb-3" /><p className="text-gray-400 text-sm">No categories yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Name', 'Parent', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    {editing?.id === c.id ? (
                      <td colSpan={4} className="px-5 py-3">
                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="flex-1 min-w-[140px]">
                            <Input label="Name" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                          </div>
                          <div className="w-28">
                            <Input label="Parent ID" type="number" value={editingParentId} onChange={(e) => setEditingParentId(e.target.value)} />
                          </div>
                          <div className="flex gap-2 mt-5">
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                            <Button size="sm" loading={updateMut.isPending} disabled={!editingName.trim()} onClick={() => updateMut.mutate()}>Save</Button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">#{c.id}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900">{c.name}</td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">{c.parent_id ? `#${c.parent_id}` : '—'}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => { setEditing(c); setEditingName(c.name); setEditingParentId(c.parent_id ? String(c.parent_id) : ''); }} className="p-1.5 text-gray-400 hover:text-[--brand] hover:bg-blue-50 rounded-lg transition-colors">
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
