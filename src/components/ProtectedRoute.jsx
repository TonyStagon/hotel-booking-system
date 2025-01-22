import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ userElement, adminElement }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminElement && currentUser.role === 'admin') {
    return adminElement;
  }

  return userElement;
};

export default ProtectedRoute;
