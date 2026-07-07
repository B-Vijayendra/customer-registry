import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import EmptyState from './EmptyState.jsx';
import { SkeletonRow } from './Loader.jsx';
import { STATUS_STYLES, PRIORITY_STYLES, formatStatusLabel, formatDate } from '../utils/constants';

export default function ComplaintTable({ complaints, loading, showCustomer = false, showAgent = false }) {
  if (loading) {
    return (
      <div className="glass-card divide-y divide-slate-100 dark:divide-white/5">
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return <EmptyState title="No complaints found" description="There's nothing matching your filters right now." />;
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-white/5">
              <th className="px-5 py-3 font-medium">Ticket</th>
              <th className="px-5 py-3 font-medium">Title</th>
              {showCustomer && <th className="px-5 py-3 font-medium">Customer</th>}
              {showAgent && <th className="px-5 py-3 font-medium">Agent</th>}
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {complaints.map((c) => (
              <tr key={c._id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{c.complaintId}</td>
                <td className="max-w-[220px] truncate px-5 py-3 font-medium text-secondary-800 dark:text-slate-100">{c.title}</td>
                {showCustomer && <td className="px-5 py-3 text-slate-500">{c.customerId?.name || '—'}</td>}
                {showAgent && <td className="px-5 py-3 text-slate-500">{c.agentId?.name || 'Unassigned'}</td>}
                <td className="px-5 py-3">
                  <span className={`badge ${PRIORITY_STYLES[c.priority]}`}>{formatStatusLabel(c.priority)}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`badge ${STATUS_STYLES[c.status]}`}>{formatStatusLabel(c.status)}</span>
                </td>
                <td className="px-5 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <Link to={`/complaints/${c._id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
                    View <FiArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
