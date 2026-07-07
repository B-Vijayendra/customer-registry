import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService';
import Loader from '../components/Loader.jsx';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authService.updateProfile(form);
      updateUser(data.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Profile</h1>

      <div className="glass-card flex items-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-secondary-900 dark:text-white">{user?.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          <span className="badge mt-1 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 capitalize">{user?.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
        <div>
          <label className="label-text">Full name</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label-text">Phone</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className="label-text">Address</label>
          <textarea rows={3} className="input-field resize-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader size="sm" /> : <><FiSave /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
