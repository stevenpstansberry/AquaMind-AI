/**
 * @file AIChatInterface.tsx
 * @location src/components/AIChatInterface.tsx
 * @description This component renders the main AI chat interface, handling the expansion, minimization, and overall chat window.
 * It uses the ChatContent component to render the chat messages, input field, and suggestions.
 * The component ensures smooth transitions and better user experience during expansion and minimization.
 * 
 * @author 
 */

import React, { useState } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; // Expand icon
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'; // Collapse icon
import ChatContent from './ChatContent'; // Import the ChatContent component
import { Aquarium } from '../interfaces/Aquarium';

interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
  aquarium?: Aquarium;
  suggestions?: string[];  // Optional array for chat suggestions
}

/**
 * AIChatInterface Component
 * @description Manages the overall AI chat interface, including expansion, minimization, and rendering the chat window.
 * Utilizes the ChatContent component to display the chat messages and input area.
 * 
 * @param {AIChatInterfaceProps} props - The props for the AIChatInterface component.
 * @returns {JSX.Element} The rendered AI chat interface.
 */
const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium, suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for chat expansion

  return (
    <>
      {/* Main Chat Interface */}
      {showChat && (
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
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
            {/* Expand Icon */}
            <IconButton
              sx={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                zIndex: 10,
                color: '#666',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
              onClick={() => setIsExpanded(true)}
            >
              <FullscreenIcon />
            </IconButton>

            {/* Chat Content */}
            <ChatContent
              aquarium={aquarium}
              suggestions={suggestions}
            />
          </Box>
        </Box>
      )}

      {/* Expanded Chat Modal */}
      <Modal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        closeAfterTransition
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
            bgcolor: '#f8f9fa',
            boxShadow: 24,
            borderRadius: '10px',
            p: 4,
            outline: 'none',
          }}
        >
          {/* Collapse Icon */}
          <IconButton
            sx={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              zIndex: 10,
              color: '#666',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => setIsExpanded(false)}
          >
            <FullscreenExitIcon />
          </IconButton>

          {/* Chat Content */}
          <ChatContent
            aquarium={aquarium}
            suggestions={suggestions}
          />
        </Box>
      </Modal>
    </>
  );
};

export default AIChatInterface;
