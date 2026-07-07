import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-900 px-4 text-center text-white">
      <p className="font-display text-7xl font-bold gradient-text">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6"><FiArrowLeft /> Back to home</Link>
    </div>
  );
}
