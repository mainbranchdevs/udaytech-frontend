import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import type { Category } from '../../types';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingParentId, setEditingParentId] = useState('');

  const { data: categories, isLoading, isError } = useQuery({ queryKey: ['admin', 'categories'], queryFn: () => adminGetCategories().then(r => r.data) });

  const createMut = useMutation({
    mutationFn: () => adminCreateCategory({ name, parent_id: parentId ? Number(parentId) : undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setName(''); setParentId(''); },
  });

  const updateMut = useMutation({
    mutationFn: () => adminUpdateCategory(editing!.id, { name: editingName, parent_id: editingParentId ? Number(editingParentId) : null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      setEditing(null);
      setEditingName('');
      setEditingParentId('');
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load categories.</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Categories</h1>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-3 items-end">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} className="flex-1" />
          <Input label="Parent ID" type="number" value={parentId} onChange={e => setParentId(e.target.value)} className="w-24" />
          <Button onClick={() => createMut.mutate()} loading={createMut.isPending} disabled={!name.trim()}>Add</Button>
        </div>
      </div>
      {!categories?.length ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No categories yet.</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Parent</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories?.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.parent_id ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditing(c);
                      setEditingName(c.name);
                      setEditingParentId(c.parent_id ? String(c.parent_id) : '');
                    }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {editing && (
        <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold mb-3">Edit Category #{editing.id}</h2>
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <Input label="Name" value={editingName} onChange={e => setEditingName(e.target.value)} />
            <Input label="Parent ID" type="number" value={editingParentId} onChange={e => setEditingParentId(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} disabled={!editingName.trim()} onClick={() => updateMut.mutate()}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
