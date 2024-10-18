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
 * Provides functionality to clear the chat history.
 * 
 * @param {AIChatInterfaceProps} props - The props for the AIChatInterface component.
 * @returns {JSX.Element} The rendered AI chat interface.
 */
const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium, suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for chat expansion
  const chatContentRef = useRef<{ clearChat: () => void }>(null);

  /**
   * @description Handles the clear chat action.
   */
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      chatContentRef.current?.clearChat();
    }
  };

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
            {/* Icons */}
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
              {/* Expand Icon */}
              <IconButton
                sx={{
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
                aria-label="Expand Chat"
              >
                <FullscreenIcon />
              </IconButton>

              {/* Clear Chat Icon */}
              <IconButton
                sx={{
                  color: '#666',
                  padding: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                onClick={handleClearChat}
                aria-label="Clear Chat"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* Chat Content */}
            <ChatContent
              ref={chatContentRef}
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
          {/* Icons */}
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
            {/* Collapse Icon */}
            <IconButton
              sx={{
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
              aria-label="Collapse Chat"
            >
              <FullscreenExitIcon />
            </IconButton>

            {/* Clear Chat Icon */}
            <IconButton
              sx={{
                color: '#666',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
              onClick={handleClearChat}
              aria-label="Clear Chat"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          {/* Chat Content */}
          <ChatContent
            ref={chatContentRef}
            aquarium={aquarium}
            suggestions={suggestions}
          />
        </Box>
      </Modal>
    </>
  );
};

export default AIChatInterface;
