import React, { useState } from 'react';
import { FiFileText, FiClock, FiCheckCircle, FiPlus, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { complaintService } from '../services/complaintService';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Modal from '../components/Modal.jsx';
import ComplaintForm from '../components/ComplaintForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonCard } from '../components/Loader.jsx';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, loading, refetch } = useFetch(() => complaintService.getAll({ limit: 6 }), []);

  const complaints = data?.complaints || [];
  const open = complaints.filter((c) => c.status === 'open').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="cinema-card relative overflow-hidden p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/25" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-600 dark:text-violet-300">Welcome back</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">{user?.name?.split(' ')[0]} 👋</h1>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-gray-400">
              Here's a snapshot of your support tickets and where each one stands right now.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-cinematic flex-shrink-0">
            <FiPlus /> Raise Complaint
          </button>
        </div>
      </motion.div>

      {/* Complaint summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Open" value={open} icon={<FiFileText />} accent="violet" />
        <StatCard label="In Progress" value={inProgress} icon={<FiClock />} accent="warning" />
        <StatCard label="Resolved" value={resolved} icon={<FiCheckCircle />} accent="success" />
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-secondary-900 dark:text-white">
          <FiActivity size={18} className="text-violet-500 dark:text-violet-400" /> Recent Activity
        </h2>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints yet"
            description="When you raise a complaint, it'll show up here."
            action={<button onClick={() => setModalOpen(true)} className="btn-cinematic">Raise your first complaint</button>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} showAgent />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Raise a New Complaint" maxWidth="max-w-lg">
        <ComplaintForm onSuccess={() => { setModalOpen(false); refetch(); }} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
