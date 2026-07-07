import React, { useEffect, useState } from 'react';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../services/notificationService';
import { formatDateTime } from '../utils/constants';
import { SkeletonRow } from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await notificationService.getAll();
    setNotifications(data.data.notifications);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleMarkAll = async () => {
    await notificationService.markAllRead();
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Notifications</h1>
        <button onClick={handleMarkAll} className="btn-secondary text-sm">
          <FiCheckCircle /> Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="glass-card divide-y divide-slate-100 dark:divide-white/5">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={FiBell} title="No notifications" description="You'll see status updates and messages here." />
      ) : (
        <div className="glass-card divide-y divide-slate-100 dark:divide-white/5">
          {notifications.map((n) => (
            <div key={n._id} className={`flex items-start gap-3 p-4 ${!n.read ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}>
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                <FiBell size={15} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-800 dark:text-slate-100">{n.title}</p>
                {n.body && <p className="text-sm text-slate-500 dark:text-slate-400">{n.body}</p>}
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
