import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary-900 px-4 py-10">
      {/* Ambient cinematic glow — clipped by overflow-hidden above, so it can never
          cause horizontal scroll regardless of viewport width */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulseGlow rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-pulseGlow rounded-full bg-accent-500/25 blur-3xl" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-accent-500 font-display text-lg font-bold text-white shadow-glow-violet">CR</div>
          <span className="font-display text-xl font-bold text-white">Registry</span>
        </Link>
        <div className="cinema-card bg-white/95 p-8 dark:bg-surface-800/80">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
