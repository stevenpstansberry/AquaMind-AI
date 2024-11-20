/**
 * @file AIButton.tsx
 * @location src/components/ai-components/AIButton.tsx
 * @description This component renders a stylized button for interacting with the AI chat interface.
 * The button dynamically updates its label based on the `isChatActive` prop and includes a shimmering icon effect.
 * It is styled with a royal purple theme and smooth transitions for better visual feedback.
 * 
 * @author Steven Stansberry
 */

import { Button, ButtonProps, styled } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Define a styled button with a royal purple background for the AI button
/**
 * @constant StyledButton
 * @description A styled Material-UI button with a royal purple background, white text, and smooth transitions.
 * The button also includes a hover state with an enhanced shadow and animation for a shimmer effect.
 * @extends ButtonProps
 */
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
/**
 * @constant ShimmerIcon
 * @description A styled Material-UI AutoAwesome icon with a gold color and a shimmer animation applied during hover.
 */
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

/**
 * @interface AIButtonProps
 * @extends ButtonProps
 * @property {boolean} isChatActive - A boolean indicating whether the AI chat is currently active.
 */
interface AIButtonProps extends ButtonProps {
  isChatActive: boolean; // Prop to determine if chat is active
}

/**
 * @component AIButton
 * @description Renders a styled button with dynamic text and a shimmering icon for the AI chat interface.
 * The button updates its label based on the `isChatActive` prop to toggle between "Ask AI" and "Hide AI".
 * @param {AIButtonProps} props - Props for the AIButton component, including `isChatActive` and other ButtonProps.
 * @returns {JSX.Element} A stylized button with dynamic functionality and animations.
 */
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
