// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0077b6', // Light Blue
      
    },
    secondary: {
      main: '#48cae4', // Seafoam Green
    },
    background: {
      default: '#f0f4f8', // Soft White
    },
    text: {
      primary: '#000000', // Black
      secondary: '#f0f4f8', //Soft White
    },
    action: {
      active: '#ffb703', // Coral / Accent Color
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
