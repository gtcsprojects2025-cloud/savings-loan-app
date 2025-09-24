import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  return isAdminAuthenticated ? children : <Navigate to="/Auth/login" replace />;
};

export default AdminProtectedRoute;
