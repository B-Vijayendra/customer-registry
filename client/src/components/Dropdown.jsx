import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

/**
 * Controlled custom select. Renders its own panel (not a native <select>), so it
 * isn't subject to the platform quirks that were leaving the old category select
 * stuck/unresponsive inside a blurred glass container. Fully driven by props —
 * the parent owns `value`, this component never holds its own copy of it.
 *
 * options: [{ value, label }]
 */
export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  icon,
  error,
  disabled = false,
  name,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (opt) => {
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div className="relative z-[9999] overflow-visible" ref={ref}>
      <button
        type="button"
        name={name}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left text-sm
          transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50
          dark:bg-white/5
          ${error ? 'border-danger/60' : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'}
          ${open ? 'border-violet-400/50 ring-2 ring-violet-500/20' : ''}`}
      >
        <span className={`flex items-center gap-2 truncate ${selected ? 'text-secondary-900 dark:text-gray-200' : 'text-slate-400 dark:text-gray-500'}`}>
          {icon}
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 dark:text-gray-400 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="dropdown-panel"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-500">No options available</li>
            ) : (
              options.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => handleSelect(opt)}
                  className="dropdown-option"
                >
                  {opt.label}
                  {opt.value === value && <FiCheck size={14} className="text-violet-400" />}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
