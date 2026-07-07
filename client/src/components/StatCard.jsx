import React from 'react';
import { motion } from 'framer-motion';

const accents = {
  violet: { grad: 'from-violet-500 to-violet-700', glow: 'dark:shadow-glow-violet' },
  cyan: { grad: 'from-accent-400 to-accent-600', glow: 'dark:shadow-glow-cyan' },
  success: { grad: 'from-success-500 to-success-600', glow: 'dark:shadow-glow-cyan' },
  warning: { grad: 'from-amber-400 to-amber-500', glow: 'dark:shadow-glow-violet' },
};

export default function StatCard({ label, value, icon, trend, accent = 'violet' }) {
  const { grad, glow } = accents[accent] || accents.violet;

  return (
    <motion.div
      className="cinema-card p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-secondary-900 dark:text-gray-50">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-accent-600 dark:text-accent-400">{trend}</p>}
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-lg ${glow}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
