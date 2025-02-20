import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { getToken } from '../utils/authService';

interface PrivateRouteProps extends RouteProps {
  // any additional props if needed
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  if (!Component) return null;
  const token = getToken();
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
