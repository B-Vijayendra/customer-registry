import React from 'react';

const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };

export default function Loader({ size = 'md', className = '' }) {
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-primary-200 border-t-primary-600 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton mb-3 h-3 w-1/3" />
      <div className="skeleton h-7 w-1/2" />
    </div>
  );
}
