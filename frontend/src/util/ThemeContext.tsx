/**
 * @file ThemeContext.tsx
 * @author Steven Stansberry
 * @location /src/util/ThemeContext.tsx
 * @description 
 * This file provides the context for managing the application's theme, allowing users to toggle between light and dark modes.
 * It defines custom light and dark themes and provides a context for toggling the theme throughout the app.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Soft blue, commonly used for primary buttons
    },
    secondary: {
      main: '#ff9800', // Warm orange for accents
    },
    background: {
      default: '#ffffff', // White background for clarity
      paper: '#f8f9fa', // Slightly off-white for cards and containers
    },
    text: {
      primary: '#333333', // Dark grey for primary text (easier on the eyes than pure black)
      secondary: '#666666', // Medium grey for secondary text
    },
    action: {
      active: '#ff5722', // Friendly coral color for active states
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#023e8a', // Deep Blue
    },
    secondary: {
      main: '#00b4d8', // Teal
    },
    background: {
      default: '#121212', // Dark Grey
    },
    text: {
      primary: '#f1faee', // Soft White
      secondary: '#000000', // Black
    },
    action: {
      active: '#ff6f61', // Coral or Neon Accent
    },
  },
});

/**
 * Interface defining the shape of the theme context.
 * @typedef {Object} ThemeContextType
 * @property {function} toggleTheme - Function to toggle between light and dark mode.
 * @property {boolean} isDarkMode - Boolean indicating whether dark mode is currently enabled.
 */
interface ThemeContextType {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeContextProvider component wraps the app and provides the theme context.
 * It allows toggling between light and dark modes and applies the selected theme to the app.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components that will have access to the theme context.
 * @returns {JSX.Element} The ThemeContextProvider with the applied theme.
 */
export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Toggles the theme between light and dark mode.
   * 
   * @function toggleTheme
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize styles for light/dark mode */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme context.
 * Throws an error if used outside of the ThemeContextProvider.
 * 
 * @returns {ThemeContextType} The theme context values.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};
