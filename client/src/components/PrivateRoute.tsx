import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authService';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
