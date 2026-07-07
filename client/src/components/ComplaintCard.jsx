import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiUser, FiUserCheck } from 'react-icons/fi';
import { STATUS_STYLES, PRIORITY_STYLES, formatStatusLabel, formatDate } from '../utils/constants';

const priorityGlow = {
  low: '',
  medium: '',
  high: 'dark:shadow-glow-cyan',
  urgent: 'dark:shadow-glow-violet',
};

export default function ComplaintCard({ complaint, showCustomer = false, showAgent = false }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`cinema-card flex flex-col p-5 ${priorityGlow[complaint.priority] || ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-slate-400 dark:text-gray-500">{complaint.complaintId}</p>
          <h3 className="mt-1 truncate font-display text-base font-semibold text-secondary-900 dark:text-gray-100">{complaint.title}</h3>
        </div>
        <Link
          to={`/complaints/${complaint._id}`}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500
            transition-colors hover:bg-violet-100 hover:text-violet-600
            dark:bg-white/5 dark:text-gray-300 dark:hover:bg-violet-500/20 dark:hover:text-violet-300"
          aria-label="Open complaint"
        >
          <FiArrowUpRight size={16} />
        </Link>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-gray-400">{complaint.description}</p>

      <div className="cinema-divider my-4" />

      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${STATUS_STYLES[complaint.status]}`}>{formatStatusLabel(complaint.status)}</span>
        <span className={`badge ${PRIORITY_STYLES[complaint.priority]}`}>{formatStatusLabel(complaint.priority)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
        <div className="flex flex-col gap-1">
          {showCustomer && complaint.customerId?.name && (
            <span className="flex items-center gap-1.5"><FiUser size={12} /> {complaint.customerId.name}</span>
          )}
          {showAgent && (
            <span className="flex items-center gap-1.5">
              <FiUserCheck size={12} /> {complaint.agentId?.name || 'Unassigned'}
            </span>
          )}
        </div>
        <span>{formatDate(complaint.createdAt)}</span>
      </div>
    </motion.div>
  );
}
