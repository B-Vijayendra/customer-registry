import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/Modal.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { SkeletonRow } from '../../components/Loader.jsx';
import Dropdown from '../../components/Dropdown';

const emptyForm = { name: '', email: '', password: '', role: 'customer', phone: '' };

export default function ManageUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({ search });
      setUsers(data.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, role: u.role, phone: u.phone || '', password: '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await userService.updateUser(editing._id, { name: form.name, role: form.role, phone: form.phone });
        toast.success('User updated');
      } else {
        await userService.createUser(form);
        toast.success('User created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const toggleActive = async (u) => {
    try {
      await userService.updateUser(u._id, { isActive: !u.isActive });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Manage Users</h1>
        <button onClick={openCreate} className="btn-primary"><FiPlus /> New User</button>
      </div>

      <div className="glass-card relative p-3">
        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-white/5">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-secondary-800 dark:text-slate-100">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3 capitalize text-slate-500">{u.role}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleActive(u)} className={`badge ${u.isActive ? 'bg-success/10 text-success-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(u)} className="mr-2 text-slate-400 hover:text-primary-600"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(u._id)} className="text-slate-400 hover:text-danger"><FiTrash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-text">Email</label>
            <input type="email" required disabled={!!editing} className="input-field disabled:opacity-60" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editing && (
            <div>
              <label className="label-text">Password</label>
              <input type="password" required minLength={6} className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div>
            <label className="label-text">Role</label>
              <Dropdown
                value={form.role}
                onChange={(val) => setForm({ ...form, role: val })}
                placeholder="Select role"
                options={[
                  { value: 'customer', label: 'Customer' },
                  { value: 'agent', label: 'Agent' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save Changes' : 'Create User'}</button>
        </form>
      </Modal>
    </div>
  );
}
