import React from 'react';

export default function ChartCard({ title, action, children, className = '' }) {
  return (
    <div className={`cinema-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-secondary-900 dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
