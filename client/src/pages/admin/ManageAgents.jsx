import React, { useEffect, useState } from 'react';
import { FiUserCheck, FiBriefcase } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { SkeletonCard } from '../../components/Loader.jsx';

export default function ManageAgents() {
  const toast = useToast();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getAgents();
      setAgents(data.data.agents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleAvailability = async (agent) => {
    try {
      await userService.updateAgent(agent.userId._id, { isAvailable: !agent.isAvailable });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Manage Agents</h1>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : agents.length === 0 ? (
        <EmptyState icon={FiUserCheck} title="No agents yet" description="Agents who register will appear here." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a._id} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-semibold text-white">
                  {a.userId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-secondary-800 dark:text-slate-100">{a.userId?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.userId?.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FiBriefcase size={14} /> {a.department}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => toggleAvailability(a)}
                  className={`badge transition-colors ${a.isAvailable ? 'bg-success/10 text-success-600' : 'bg-slate-100 text-slate-500'}`}
                >
                  {a.isAvailable ? 'Available' : 'Unavailable'}
                </button>
                <span className="text-sm font-medium text-secondary-800 dark:text-slate-100">{a.openComplaintsCount} open</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
