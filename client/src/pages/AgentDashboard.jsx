import React from 'react';
import { motion } from 'framer-motion';
import { FiClipboard, FiClock, FiCheckCircle, FiInbox } from 'react-icons/fi';
import { complaintService } from '../services/complaintService';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonCard } from '../components/Loader.jsx';

export default function AgentDashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(() => complaintService.getAll({ limit: 9 }), []);
  const complaints = data?.complaints || [];

  const open = complaints.filter((c) => c.status === 'open').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cinema-card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-accent-600 dark:text-accent-400">Agent workspace</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">{user?.name?.split(' ')[0]}'s Queue</h1>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-gray-400">Complaints currently assigned to you, sorted by most recent.</p>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Open" value={open} icon={<FiClipboard />} accent="violet" />
        <StatCard label="In Progress" value={inProgress} icon={<FiClock />} accent="warning" />
        <StatCard label="Resolved" value={resolved} icon={<FiCheckCircle />} accent="success" />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold text-secondary-900 dark:text-white">Your Queue</h2>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : complaints.length === 0 ? (
          <EmptyState icon={FiInbox} title="Nothing assigned yet" description="Complaints assigned to you by an admin will appear here." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => <ComplaintCard key={c._id} complaint={c} showCustomer />)}
          </div>
        )}
      </div>
    </div>
  );
}
