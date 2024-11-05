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
import { User } from '../interfaces/Auth';

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
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  loading: boolean;

}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoggedIn: false, 
  login: () => {},
  logout: () => {},
  loading: true,
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine if the user is logged in
  const isLoggedIn = !!user && !!token;

  /**
   * Login function to store user data and authentication token.
   * 
   * @param {Object} userData - The user data containing user object and token.
   * @param {User} userData.user - The user object.
   * @param {string} userData.token - The authentication token.
   */
  const login = ({ user, token }: { user: User; token: string }) => {
    setUser( user );
    setToken(token);
    localStorage.setItem('token', token); // Store token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
  };

  /**
   * Logout function to clear user data and token from both state and local storage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); // Clear all local storage
    window.location.reload(); // Reload the page to clear any remaining state
  };

  /**
   * useEffect hook to check if user data (email and token) is saved in localStorage
   * when the app loads. If found, it restores the session.
   */
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    let savedUser = null;

    try {
        const userString = localStorage.getItem('user');
        if (userString) {
            savedUser = JSON.parse(userString) as User;
        }
    } catch (error) {
        console.error('Error parsing user data from local storage:', error);
        // If parsing fails, remove the invalid entry from local storage
        localStorage.removeItem('user');
    }

    if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
    }
    setLoading(false);
}, []);


  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
