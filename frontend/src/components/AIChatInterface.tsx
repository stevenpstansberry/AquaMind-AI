// src/components/AIChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';

interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Simulate sending a message to AI and receiving a response
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add the user's message to the conversation
    const newMessage = { sender: 'User', text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput(''); // Clear the input

    // Simulated AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = { sender: 'AI', text: `Simulated response to: "${newMessage.text}"` };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  // Use effect to scroll to the bottom whenever messages change
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
