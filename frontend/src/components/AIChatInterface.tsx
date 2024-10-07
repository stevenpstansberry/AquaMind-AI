import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { Aquarium } from '../interfaces/Aquarium'  

/**
 * Props for the AIChatInterface component.
 * @typedef {Object} AIChatInterfaceProps
 * @property {boolean} showChat - A flag to toggle the visibility of the chat interface.
 * @property {function} onClose - A callback function to handle closing the chat interface.
 * @property {Aquarium} [aquarium] - Optional aquarium data for AI suggestions based on the tank.
 */
interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
  aquarium?: Aquarium;  // Optional aquarium prop
}

/**
 * AIChatInterface component provides a simple messaging interface between the user and a simulated AI.
 * It can optionally take aquarium data to provide tank-related suggestions.
 * 
 * @param {AIChatInterfaceProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered AIChatInterface component.
 */
const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls to the bottom of the chat container when new messages are added.
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  /**
   * Handles sending a message. The user's message is added to the chat, followed by a simulated AI response.
   * The AI response can be contextual if aquarium data is provided.
   */
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add the user's message to the conversation
    const newMessage = { sender: 'User', text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput(''); // Clear the input

    // Simulated AI response with optional aquarium context
    setLoading(true);
    setTimeout(() => {
      let aiResponseText = `Simulated response to: "${newMessage.text}"`;

      // Add some context based on the aquarium if available
      if (aquarium) {
        aiResponseText += ` (Considering your ${aquarium.name} tank with ${aquarium.species.length} species)`;
      }

      const aiResponse = { sender: 'AI', text: aiResponseText };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  /**
   * useEffect hook to scroll to the bottom of the chat whenever new messages are added.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        height: showChat ? '300px' : '0px',
        overflow: 'hidden',
        transition: 'height 0.5s ease',
        mt: showChat ? 2 : 0,
      }}
    >
      {showChat && (
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: '100%',
            paddingTop: '20px',
          }}
        >
          {/* Chat area */}
          <Box
            ref={chatContainerRef}
            flex={1}
            sx={{
              overflowY: 'auto',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              bgcolor: '#f9f9f9',
              maxHeight: '300px',
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} display="flex" justifyContent={message.sender === 'User' ? 'flex-end' : 'flex-start'} mb={1}>
                <Typography
                  sx={{
                    bgcolor: message.sender === 'User' ? '#007bff' : '#e0e0e0',
                    color: message.sender === 'User' ? '#fff' : '#000',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  {message.text}
                </Typography>
              </Box>
            ))}
            {loading && <CircularProgress size={24} />}
          </Box>

          {/* Input area */}
          <Box display="flex" mt={2}>
            <TextField
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question..."
              variant="outlined"
              fullWidth
            />
            <Button onClick={handleSendMessage} variant="contained" sx={{ ml: 2 }}>
              Send
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIChatInterface;
