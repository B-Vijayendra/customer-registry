import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiInbox } from 'react-icons/fi';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../hooks/useAuth';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Dropdown from '../components/Dropdown.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ComplaintForm from '../components/ComplaintForm.jsx';
import { SkeletonCard } from '../components/Loader.jsx';

export default function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', page: 1 });

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await complaintService.getAll({ ...params, limit: 9 });
      setComplaints(data.data.complaints);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">
            {user.role === 'customer' ? 'My Complaints' : user.role === 'agent' ? 'Assigned Complaints' : 'All Complaints'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{pagination.total} total tickets</p>
        </div>
        {user.role === 'customer' && (
          <button onClick={() => setModalOpen(true)} className="btn-cinematic"><FiPlus /> Raise Complaint</button>
        )}
      </div>

      <div className="cinema-card relative z-10 overflow-visible grid gap-3 p-4 sm:grid-cols-[1fr,auto,auto] sm:items-start">
        <div className="relative z-20 overflow-visible">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={16} />
          <input
            placeholder="Search by title or ticket ID"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="relative z-[999] w-full overflow-visible sm:w-44">
          <Dropdown
            placeholder="All statuses"
            icon={<FiFilter size={14} />}
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => updateFilter('status', v)}
          />
        </div>
        <div className="relative z-[999] w-full overflow-visible sm:w-44">
          <Dropdown
            placeholder="All priorities"
            icon={<FiFilter size={14} />}
            options={PRIORITY_OPTIONS}
            value={filters.priority}
            onChange={(v) => updateFilter('priority', v)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : complaints.length === 0 ? (
        <EmptyState icon={FiInbox} title="No complaints found" description="Nothing matches your filters right now." />
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {complaints.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                showCustomer={user.role !== 'customer'}
                showAgent={user.role === 'customer' || user.role === 'admin'}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                pagination.page === i + 1
                  ? 'bg-gradient-to-r from-violet-600 to-accent-500 text-white shadow-glow-violet'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Raise a New Complaint" maxWidth="max-w-lg">
        <ComplaintForm onSuccess={() => { setModalOpen(false); load(); }} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
