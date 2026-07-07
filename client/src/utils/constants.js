export const ROLES = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  ADMIN: 'admin',
};

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const STATUS_STYLES = {
  open: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  closed: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
};

export const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
  medium: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  urgent: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
};

export const formatStatusLabel = (status) =>
  status ? status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

export const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '';
