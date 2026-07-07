import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Profile from '../pages/Profile.jsx';
import Complaints from '../pages/Complaints.jsx';
import ComplaintDetails from '../pages/ComplaintDetails.jsx';
import Notifications from '../pages/Notifications.jsx';
import Chat from '../pages/Chat.jsx';
import Settings from '../pages/Settings.jsx';
import NotFound from '../pages/NotFound.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ManageAgents from '../pages/admin/ManageAgents.jsx';
import ManageCategories from '../pages/admin/ManageCategories.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated — any role */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat/:complaintId" element={<Chat />} />
      </Route>

      {/* Admin only */}
      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/agents" element={<ManageAgents />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
