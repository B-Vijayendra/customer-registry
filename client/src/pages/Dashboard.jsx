import React from 'react';
import { useAuth } from '../hooks/useAuth';
import CustomerDashboard from './CustomerDashboard.jsx';
import AgentDashboard from './AgentDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

// Single /dashboard route that renders the right view for the logged-in role.
export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'agent') return <AgentDashboard />;
  return <CustomerDashboard />;
}
