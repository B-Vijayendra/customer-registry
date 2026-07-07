import React from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiGrid, FiFileText, FiMessageSquare, FiBell, FiUser, FiSettings,
  FiUsers, FiUserCheck, FiTag, FiX,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const navByRole = {
  customer: [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/complaints', label: 'My Complaints', icon: FiFileText },
    { to: '/notifications', label: 'Notifications', icon: FiBell },
    { to: '/profile', label: 'Profile', icon: FiUser },
    { to: '/settings', label: 'Settings', icon: FiSettings },
  ],
  agent: [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/complaints', label: 'Assigned Complaints', icon: FiFileText },
    { to: '/notifications', label: 'Notifications', icon: FiBell },
    { to: '/profile', label: 'Profile', icon: FiUser },
    { to: '/settings', label: 'Settings', icon: FiSettings },
  ],
  admin: [
    { to: '/dashboard', label: 'Analytics', icon: FiGrid },
    { to: '/complaints', label: 'All Complaints', icon: FiFileText },
    { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { to: '/admin/agents', label: 'Manage Agents', icon: FiUserCheck },
    { to: '/admin/categories', label: 'Categories', icon: FiTag },
    { to: '/notifications', label: 'Notifications', icon: FiBell },
    { to: '/settings', label: 'Settings', icon: FiSettings },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = navByRole[user?.role] || navByRole.customer;

  return (
    <>
      {/* Mobile backdrop — click to close, never blocks desktop layout */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop: always in flow (fixed via lg:static). Mobile: slides in/out via Framer Motion,
          and crucially uses `fixed` relative to the viewport on purpose (a drawer), while never
          exceeding its own w-64 — it cannot push other content off-screen. */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/70 bg-white/90 backdrop-blur-glass
          dark:border-white/10 dark:bg-surface-900/95
          lg:static lg:z-auto lg:flex lg:translate-x-0 lg:flex-col lg:!transform-none"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-accent-500 font-display font-bold text-white shadow-glow-violet">CR</div>
            <span className="font-display text-lg font-bold text-secondary-900 dark:text-white">Registry</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:text-gray-500 dark:hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-accent-500 text-white shadow-glow-violet'
                    : 'text-secondary-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-xl2 border border-violet-200 bg-gradient-to-br from-violet-50 to-accent-50 p-4
          dark:border-white/5 dark:bg-gradient-to-br dark:from-violet-500/10 dark:to-accent-500/10">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold capitalize text-secondary-800 dark:text-white">{user?.role}</p>
        </div>
      </motion.aside>
    </>
  );
}
