import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the auth context
interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (userData: { email: string; token: string }) => void;
  logout: () => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap around your app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Login function to store user data and token
  const login = ({ email, token }: { email: string; token: string }) => {
    setUser(email);
    setToken(token);
    localStorage.setItem('token', token); // Store token in local storage
    localStorage.setItem('user', email);
  };

  // Logout function to clear user data and token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); // Remove token from storage
    localStorage.removeItem('user');
  };

  // Check if user data is stored in localStorage
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
