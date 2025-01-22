// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser?.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
