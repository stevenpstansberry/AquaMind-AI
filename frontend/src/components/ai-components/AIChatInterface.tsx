/**
 * @file AIChatInterface.tsx
 * @location src/components/ai-components/AIChatInterface.tsx
 * @description This component renders the main AI chat interface, handling the expansion, minimization, and overall chat window.
 * It uses the ChatContent component to render the chat messages, input field, and suggestions.
 * The component ensures smooth transitions and better user experience during expansion and minimization.
 * Provides functionality to clear the chat history.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useRef } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; 
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import ChatContent from './ChatContent'; 
import { Aquarium } from '../../interfaces/Aquarium';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../util/ThemeContext';



interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
  aquarium?: Aquarium;
  suggestions?: string[];  
  onAddItem?: (itemType: string, itemName: string) => void;
}

/**
 * AIChatInterface Component
 * @description Manages the overall AI chat interface, including expansion, minimization, and rendering the chat window.
 * Utilizes the ChatContent component to display the chat messages and input area.
 * Provides functionality to clear the chat history.
 * 
 * @param {AIChatInterfaceProps} props - The props for the AIChatInterface component.
 * @returns {JSX.Element} The rendered AI chat interface.
 */
const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium, suggestions, onAddItem }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for chat expansion
  const chatContentRef = useRef<{ clearChat: () => void }>(null);
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useThemeContext(); 


  /**
   * @description Handles the clear chat action.
   */
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      chatContentRef.current?.clearChat();
    }
  };

  const getIconStyles = () => ({
    color: theme.palette.text.primary,
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      backgroundColor: isDarkMode ? theme.palette.background.default : '#f0f0f0',
    },
  });

  return (
    <>
      {showChat && (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            height: '400px',
            overflow: 'hidden',
            mt: 2,
            position: 'relative',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                zIndex: 10,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                sx={getIconStyles()}
                onClick={() => setIsExpanded(true)}
                aria-label="Expand Chat"
              >
                <FullscreenIcon />
              </IconButton>

              <IconButton
                sx={getIconStyles()}
                onClick={handleClearChat}
                aria-label="Clear Chat"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <ChatContent
              ref={chatContentRef}
              aquarium={aquarium}
              suggestions={suggestions}
              onAddItem={onAddItem}
            />
          </Box>
        </Box>
      )}

      <Modal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        closeAfterTransition
        sx={{
          zIndex: 5000,
        }}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '90vw',
            height: '85vh',
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            borderRadius: '10px',
            p: 4,
            outline: 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              zIndex: 10,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              sx={getIconStyles()}
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse Chat"
            >
              <FullscreenExitIcon />
            </IconButton>

            <IconButton
              sx={getIconStyles()}
              onClick={handleClearChat}
              aria-label="Clear Chat"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <ChatContent
            ref={chatContentRef}
            aquarium={aquarium}
            suggestions={suggestions}
            onAddItem={onAddItem}
          />
        </Box>
      </Modal>
    </>
  );
};

export default AIChatInterface;
