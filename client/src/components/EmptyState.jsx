import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon, title = 'Nothing here yet', description, action }) {
  const Icon = icon || FiInbox;
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-slate-200 py-16 text-center dark:border-white/10">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-primary-600 dark:from-primary-500/10 dark:to-accent-500/10">
        <Icon size={26} />
      </div>
      <h3 className="font-display text-lg font-semibold text-secondary-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
