import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Define a styled button with a royal purple background for the AI button
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: '#6A0DAD', // Royal purple background color for the AI button
  color: '#fff', // White text color for contrast
  textTransform: 'none', // Keep text as-is without uppercase
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  transition: 'background 0.3s, box-shadow 0.3s',
  boxShadow: '0px 0px 8px rgba(106, 13, 173, 0.6)', // Soft shadow with the royal purple color

  '&:hover': {
    backgroundColor: '#5B0A99', // Slightly darker purple on hover
    boxShadow: '0px 0px 12px 4px rgba(106, 13, 173, 0.8)',
    '.shimmer-icon': {
      animation: 'shimmer 1.5s infinite', // Apply shimmer animation to icon on hover
    },
  },
}));

// Define a styled AutoAwesome icon with a light yellow color and shimmer animation
const ShimmerIcon = styled(AutoAwesomeIcon)(({ theme }) => ({
  color: '#FFD700', // Gold color for the icon to match the purple theme
  transition: 'transform 0.3s, opacity 0.3s', // Smooth transition when shimmer starts

  // Define the shimmer keyframes animation
  '@keyframes shimmer': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.8, transform: 'scale(1.1)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}));

interface AIButtonProps extends ButtonProps {
  isChatActive: boolean; // Prop to determine if chat is active
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
