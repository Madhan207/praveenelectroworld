import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Spinner ── */
const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

/* ── Admin-only route ── */
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login?unauthorized=true" state={{ from: location }} replace />;
  if (!user.is_staff) return <Navigate to="/login?unauthorized=true" state={{ from: location }} replace />;
  return children;
};

/* ── Authenticated user route ── */
export const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
