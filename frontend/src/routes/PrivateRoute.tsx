import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';

const PrivateRoute = () => {
  const { token } = useAuth(); 

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;