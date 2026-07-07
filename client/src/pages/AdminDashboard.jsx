import React from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { FiUsers, FiUserCheck, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { userService } from '../services/userService';
import { useFetch } from '../hooks/useFetch';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { SkeletonCard } from '../components/Loader.jsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const { data, loading } = useFetch(() => userService.getAnalytics(), []);

  if (loading || !data) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const { totals, byCategory, last7Days } = data;

  const categoryChart = {
    labels: byCategory.map((c) => c.name),
    datasets: [{
      label: 'Complaints',
      data: byCategory.map((c) => c.count),
      backgroundColor: '#7C3AED',
      borderRadius: 8,
      maxBarThickness: 36,
    }],
  };

  const trendChart = {
    labels: last7Days.map((d) => d._id),
    datasets: [{
      label: 'New complaints',
      data: last7Days.map((d) => d.count),
      borderColor: '#06B6D4',
      backgroundColor: 'rgba(6,182,212,0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#06B6D4',
    }],
  };

  const gridColor = 'rgba(148,163,184,0.15)';
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
      y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: '#94A3B8' } },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cinema-card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-300">Admin overview</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">Analytics Dashboard</h1>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-gray-400">Platform-wide view of complaints, customers, and agents.</p>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value={totals.totalCustomers} icon={<FiUsers />} accent="violet" />
        <StatCard label="Total Agents" value={totals.totalAgents} icon={<FiUserCheck />} accent="cyan" />
        <StatCard label="Total Complaints" value={totals.totalComplaints} icon={<FiFileText />} accent="success" />
        <StatCard label="Open + In Progress" value={totals.openComplaints + totals.inProgress} icon={<FiAlertCircle />} accent="warning" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Complaints by Category">
          <Bar data={categoryChart} options={chartOptions} />
        </ChartCard>
        <ChartCard title="New Complaints — Last 7 Days">
          <Line data={trendChart} options={chartOptions} />
        </ChartCard>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        {[
          { label: 'Open', value: totals.openComplaints, color: 'bg-violet-500' },
          { label: 'In Progress', value: totals.inProgress, color: 'bg-amber-500' },
          { label: 'Resolved', value: totals.resolved, color: 'bg-success-500' },
          { label: 'Closed', value: totals.closed, color: 'bg-slate-400' },
        ].map((s) => (
          <div key={s.label} className="cinema-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-gray-400">{s.label}</span>
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
            </div>
            <p className="mt-2 font-display text-xl font-bold text-secondary-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
