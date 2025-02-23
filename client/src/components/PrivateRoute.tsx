import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authService';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
