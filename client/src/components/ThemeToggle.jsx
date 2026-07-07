import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Self-contained switch. It is intentionally a fixed-size, `relative`-positioned
 * pill with the knob animated via Framer Motion's `layout` — nothing here uses
 * `fixed`/`absolute` relative to the viewport, so it cannot drift outside the
 * navbar or off-screen on narrow viewports. Persistence lives in ThemeContext
 * (localStorage), this component only renders state.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-[3.25rem] flex-shrink-0 items-center rounded-full
        border border-slate-300 bg-slate-100 px-1 transition-colors duration-300
        dark:border-white/10 dark:bg-white/5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${className}`}
    >
      <motion.span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-accent-500 text-white shadow-glow-violet"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ marginLeft: isDark ? 'calc(100% - 1.5rem)' : '0' }}
      >
        {isDark ? <FiMoon size={13} /> : <FiSun size={13} />}
      </motion.span>
    </button>
  );
}
