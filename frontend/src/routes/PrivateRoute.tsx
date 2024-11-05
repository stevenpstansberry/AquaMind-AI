/**
 * @file PrivateRoute.tsx
 * @author Steven Stansberry
 * @location /src/routes/PrivateRoute.tsx
 * @description 
 * This component is a wrapper for routes that require authentication. It checks if the user is authenticated by verifying 
 * the presence of a token. If authenticated, it renders the child components (via `Outlet`), otherwise it redirects the 
 * user to the sign-in page.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';

/**
 * PrivateRoute component checks for user authentication. If a valid token is found, it allows access to the child routes.
 * Otherwise, it redirects the user to the sign-in page.
 * 
 * @returns {JSX.Element} - The rendered outlet for protected routes or a redirection to the login page.
 */

const PrivateRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    // Render null or a loading spinner while checking authentication
    return null; // Or a loading spinner
  }

  return token ? <Outlet /> : <Navigate to="/account?mode=signin" />;
};

export default PrivateRoute;

