import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiTag } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/Modal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { SkeletonRow } from '../../components/Loader.jsx';

export default function ManageCategories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getCategories();
      setCategories(data.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await userService.updateCategory(editing._id, form);
        toast.success('Category updated');
      } else {
        await userService.createCategory(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await userService.deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Categories</h1>
        <button onClick={openCreate} className="btn-primary"><FiPlus /> New Category</button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : categories.length === 0 ? (
          <EmptyState icon={FiTag} title="No categories yet" action={<button onClick={openCreate} className="btn-primary">Add Category</button>} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-secondary-800 dark:text-slate-100">{c.name}</p>
                  {c.description && <p className="text-sm text-slate-500 dark:text-slate-400">{c.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-slate-400 hover:text-primary-600"><FiEdit2 size={15} /></button>
                  <button onClick={() => handleDelete(c._id)} className="text-slate-400 hover:text-danger"><FiTrash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save Changes' : 'Create Category'}</button>
        </form>
      </Modal>
    </div>
  );
}
