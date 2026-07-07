import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // overflow-hidden here is the safety net: nothing inside this bar — including the
    // toggle switch — can ever push the layout wider than the viewport on mobile.
<header className="sticky top-0 z-[100] flex h-16 w-full items-center justify-between gap-3 overflow-visible      border-b border-slate-200/70 bg-white/80 px-3 backdrop-blur-glass sm:px-6
      dark:border-white/10 dark:bg-surface-900/80">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex-shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200 lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
        <span className="hidden truncate font-display text-sm font-medium text-slate-400 dark:text-gray-500 sm:inline">
          Welcome back, <span className="text-secondary-800 dark:text-gray-200">{user?.name?.split(' ')[0]}</span>
        </span>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <NotificationBell />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl p-1.5 pr-1.5 hover:bg-slate-100 dark:hover:bg-white/10 sm:pr-2"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-accent-500 text-sm font-semibold text-white shadow-glow-violet">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <FiChevronDown size={14} className="hidden text-slate-400 dark:text-gray-500 sm:inline" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="cinema-card absolute right-0 z-40 mt-2 w-48 p-1.5"
              >
                <p className="truncate px-3 py-2 text-xs text-slate-400 dark:text-gray-500">{user?.email}</p>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-white/10">
                  <FiUser size={15} /> Profile
                </Link>
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-white/10">
                  <FiSettings size={15} /> Settings
                </Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-500/10">
                  <FiLogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
