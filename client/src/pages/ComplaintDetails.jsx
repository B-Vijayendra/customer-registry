import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle, FiStar, FiPaperclip } from 'react-icons/fi';
import { complaintService } from '../services/complaintService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext.jsx';
import { STATUS_OPTIONS, STATUS_STYLES, PRIORITY_STYLES, formatStatusLabel, formatDateTime } from '../utils/constants';
import Loader from '../components/Loader.jsx';
import Dropdown from '../components/Dropdown.jsx';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [complaint, setComplaint] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const load = async () => {
    try {
      const { data } = await complaintService.getById(id);
      setComplaint(data.data.complaint);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user.role === 'admin') {
      userService.getAgents().then(({ data }) => setAgents(data.data.agents)).catch(() => {});
    }
  }, [user.role]);

  const handleStatusChange = async (status) => {
    try {
      const { data } = await complaintService.update(id, { status });
      setComplaint(data.data.complaint);
      toast.success(`Status updated to ${formatStatusLabel(status)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      const { data } = await complaintService.update(id, { agentId });
      setComplaint(data.data.complaint);
      toast.success('Agent assigned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const { data } = await complaintService.update(id, { feedback });
      setComplaint(data.data.complaint);
      toast.success('Thanks for your feedback!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>;
  if (!complaint) return null;

  const chatPartnerId = user.role === 'customer' ? complaint.agentId?._id : complaint.customerId?._id;

  return (
    // <div className="space-y-6">
    <div className="relative z-10 space-y-6 overflow-visible">
      <Link to="/complaints" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary-600">
        <FiArrowLeft size={14} /> Back to complaints
      </Link>

      {/* <div className="glass-card p-6"> */}
      <div className="glass-card relative z-20 overflow-visible p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-slate-400">{complaint.complaintId}</p>
            <h1 className="mt-1 font-display text-xl font-bold text-secondary-900 dark:text-white">{complaint.title}</h1>
            <div className="mt-2 flex gap-2">
              <span className={`badge ${STATUS_STYLES[complaint.status]}`}>{formatStatusLabel(complaint.status)}</span>
              <span className={`badge ${PRIORITY_STYLES[complaint.priority]}`}>{formatStatusLabel(complaint.priority)} priority</span>
            </div>
          </div>

          {(user.role === 'agent' || user.role === 'admin') && (
          // <select
          //   value={complaint.status}
          //   onChange={(e)=>handleStatusChange(e.target.value)}
          //   className="input-field relative z-[999] w-auto"
          // >
          //     {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          //   </select>
          <Dropdown
            options={STATUS_OPTIONS}
            value={complaint.status}
            onChange={handleStatusChange}
            className="w-52"
          />
          )}
        </div>

        <p className="mt-4 text-sm text-secondary-700 dark:text-slate-300">{complaint.description}</p>

        {complaint.attachment && (
          <a href={complaint.attachment} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
            <FiPaperclip size={14} /> View attachment
          </a>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm dark:border-white/5 sm:grid-cols-4">
          <div><p className="text-slate-400">Category</p><p className="font-medium text-secondary-800 dark:text-slate-100">{complaint.category?.name}</p></div>
          <div><p className="text-slate-400">Customer</p><p className="font-medium text-secondary-800 dark:text-slate-100">{complaint.customerId?.name}</p></div>
          <div><p className="text-slate-400">Agent</p><p className="font-medium text-secondary-800 dark:text-slate-100">{complaint.agentId?.name || 'Unassigned'}</p></div>
          <div><p className="text-slate-400">Raised</p><p className="font-medium text-secondary-800 dark:text-slate-100">{formatDateTime(complaint.createdAt)}</p></div>
        </div>

        {user.role === 'admin' && (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/5">
            <label className="label-text">Assign Agent</label>
<Dropdown
  value={complaint.agentId?._id || ''}
  onChange={handleAssignAgent}
  options={[
    {
      value:'',
      label:'Unassigned'
    },

    ...agents.map((a)=>({
      value:a.userId?._id,
      label:a.userId?.name
    }))
  ]}
  className="w-64"
/>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-secondary-900 dark:text-white">Timeline</h3>
        <div className="space-y-4">
          {complaint.timeline.map((t, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
              <div>
                <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">
                  {formatStatusLabel(t.status)} {t.changedBy?.name && <span className="text-slate-400">by {t.changedBy.name}</span>}
                </p>
                {t.note && <p className="text-sm text-slate-500 dark:text-slate-400">{t.note}</p>}
                <p className="text-xs text-slate-400">{formatDateTime(t.changedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat link */}
      {complaint.agentId && (user.role === 'customer' || user.role === 'agent') && (
        <Link to={`/chat/${complaint._id}`} state={{ receiverId: chatPartnerId }} className="btn-secondary inline-flex">
          <FiMessageCircle /> Open Chat
        </Link>
      )}

      {/* Feedback */}
      {user.role === 'customer' && ['resolved', 'closed'].includes(complaint.status) && (
        <div className="glass-card p-6">
          <h3 className="mb-3 font-display text-base font-semibold text-secondary-900 dark:text-white">
            {complaint.feedback?.submittedAt ? 'Your Feedback' : 'Leave Feedback'}
          </h3>
          {complaint.feedback?.submittedAt ? (
            <div>
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < complaint.feedback.rating ? 'currentColor' : 'none'} />)}
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{complaint.feedback.comment}</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button type="button" key={r} onClick={() => setFeedback((f) => ({ ...f, rating: r }))}>
                    <FiStar className={r <= feedback.rating ? 'text-amber-400' : 'text-slate-300'} fill={r <= feedback.rating ? 'currentColor' : 'none'} size={22} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="How was your experience?"
                value={feedback.comment}
                onChange={(e) => setFeedback((f) => ({ ...f, comment: e.target.value }))}
                className="input-field resize-none"
              />
              <button type="submit" disabled={submittingFeedback} className="btn-primary">
                {submittingFeedback ? <Loader size="sm" /> : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
