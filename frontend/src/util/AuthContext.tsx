/**
 * @file AuthContext.tsx
 * @author Steven Stansberry
 * @location /src/util/AuthContext.tsx
 * @description 
 * This file provides the authentication context for managing user login state across the application.
 * It handles storing user information and authentication tokens in local storage, and provides methods 
 * for login, logout, and checking the logged-in status.
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * AuthContextType defines the structure of the authentication context.
 * @typedef {Object} AuthContextType
 * @property {string | null} user - The logged-in user's email, or null if not logged in.
 * @property {string | null} token - The authentication token, or null if not logged in.
 * @property {boolean} isLoggedIn - Boolean indicating if the user is logged in.
 * @property {function} login - Function to log the user in, stores user data and token.
 * @property {function} logout - Function to log the user out, clears user data and token.
 */
interface AuthContextType {
  user: string | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (userData: { email: string; token: string }) => void;
  logout: () => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoggedIn: false, 
  login: () => {},
  logout: () => {},
});

/**
 * Custom hook to access the authentication context.
 * 
 * @returns {AuthContextType} The authentication context values.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component wraps the application and provides authentication context to its children.
 * It manages user login state, token storage, and session persistence using local storage.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components that require authentication context.
 * @returns {JSX.Element} The AuthProvider wrapping its children.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Determine if the user is logged in
  const isLoggedIn = !!user && !!token;

  /**
   * Login function to store user email and authentication token.
   * 
   * @param {Object} userData - The user data containing email and token.
   * @param {string} userData.email - The user's email.
   * @param {string} userData.token - The authentication token.
   */
  const login = ({ email, token }: { email: string; token: string }) => {
    setUser(email);
    setToken(token);
    localStorage.setItem('token', token); // Store token in local storage
    localStorage.setItem('user', email);
  };

  /**
   * Logout function to clear user data and token from both state and local storage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('user');
    window.location.reload(); // Reload the page to clear any remaining state
  };

  /**
   * useEffect hook to check if user data (email and token) is saved in localStorage
   * when the app loads. If found, it restores the session.
   */
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
