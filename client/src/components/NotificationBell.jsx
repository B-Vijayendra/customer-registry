import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { formatDateTime } from '../utils/constants';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await notificationService.getAll();
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch {
      // Silently ignore — bell just stays empty until next poll
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((o) => !o);
    if (unreadCount > 0) {
      await notificationService.markAllRead();
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-card absolute right-0 z-40 mt-2 w-80 bg-white/95 p-2 dark:bg-secondary-800/95">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-display text-sm font-semibold text-secondary-900 dark:text-white">Notifications</span>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-400">You're all caught up</p>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div key={n._id} className="rounded-lg px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">{n.title}</p>
                  {n.body && <p className="text-xs text-slate-500 dark:text-slate-400">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
