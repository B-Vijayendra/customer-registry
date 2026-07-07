import React from 'react';
import { FiMoon, FiSun, FiMail, FiLock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Settings</h1>

      <div className="glass-card p-6">
        <h2 className="font-display text-base font-semibold text-secondary-900 dark:text-white">Appearance</h2>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <FiMoon /> : <FiSun />}
            <div>
              <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">Dark mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
            </div>
          </div>
<button
  onClick={toggleTheme}
  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
    theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'
  }`}
>
  <span
    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
    }`}
  />
</button>

        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-base font-semibold text-secondary-900 dark:text-white">Notifications</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-white/10">
          <FiMail />
          <div>
            <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">Email notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Status and message alerts are always sent in-app</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-base font-semibold text-secondary-900 dark:text-white">Security</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-white/10">
          <FiLock />
          <div>
            <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">Password</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your password from the Profile page</p>
          </div>
        </div>
      </div>
    </div>
  );
}
