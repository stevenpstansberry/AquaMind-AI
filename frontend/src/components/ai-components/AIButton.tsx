import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Define a styled button with a light blue background
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Light blue background (uses primary color from your config)
  color: '#fff',
  textTransform: 'none', // Keep text as-is without uppercase
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  transition: 'background 0.3s, box-shadow 0.3s',
  boxShadow: '0px 0px 8px rgba(24, 118, 210, 0.6)', // Soft shadow with the #1876D2 color

  '&:hover': {
    backgroundColor: '#1565C0', // Slightly darker blue on hover
    boxShadow: '0px 0px 12px 4px rgba(24, 118, 210, 0.8)',
    '.shimmer-icon': {
      animation: 'shimmer 1.5s infinite', // Apply shimmer animation to icon on hover
    },
  },
}));

// Define a styled AutoAwesome icon with a yellow color and shimmer animation
const ShimmerIcon = styled(AutoAwesomeIcon)(({ theme }) => ({
  color: '#FFA726', // Light yellow color for the icon
  transition: 'transform 0.3s, opacity 0.3s', // Smooth transition when shimmer starts

  // Define the shimmer keyframes animation
  '@keyframes shimmer': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.8, transform: 'scale(1.1)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}));

interface AIButtonProps extends ButtonProps {
  isChatActive: boolean; // New prop to determine if chat is active
}

const AIButton: React.FC<AIButtonProps> = ({ isChatActive, ...props }) => {
  return (
    <StyledButton
      {...props}
      startIcon={<ShimmerIcon className="shimmer-icon" />} // Add class for targeted shimmer
      variant="contained"
    >
      {isChatActive ? "Hide AI" : "Ask AI"}
    </StyledButton>
  );
};

export default AIButton;
