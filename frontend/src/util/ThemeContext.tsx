// src/contexts/ThemeContext.tsx
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
      primary: '#333333', // Dark grey for primary text (easier than pure black)
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

// Create a context to manage the theme
interface ThemeContextType {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component to wrap the app
export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

// Custom hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};
