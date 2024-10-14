import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Aquarium } from '../interfaces/Aquarium'  

interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
  aquarium?: Aquarium;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string, timestamp: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { sender: 'User', text: userInput, timestamp: getCurrentTimestamp() };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');

    setLoading(true);
    setTimeout(() => {
      let aiResponseText = `Simulated response to: "${newMessage.text}"`;

      if (aquarium) {
        aiResponseText += ` Considering your ${aquarium.name} tank with the following details: ${JSON.stringify(aquarium)}`;
      }

      const aiResponse = { sender: 'AI', text: aiResponseText, timestamp: getCurrentTimestamp() };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

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
              <Box key={index} mb={1}>
                {/* Timestamp */}
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#888',
                    textAlign: message.sender === 'User' ? 'right' : 'left',
                    mb: '5px',
                  }}
                >
                  {message.timestamp}
                </Typography>

                {/* Message */}
                <Box display="flex" justifyContent={message.sender === 'User' ? 'flex-end' : 'flex-start'}>
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
              </Box>
            ))}

            {/* Loading indicator (cascading dots) */}
            {loading && (
              <Box display="flex" justifyContent="flex-start" mb={1}>
                <Typography
                  sx={{
                    bgcolor: '#e0e0e0',
                    color: '#000',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#000',
                      animation: 'dot 1.4s infinite both',
                      '@keyframes dot': {
                        '0%': { transform: 'scale(0)' },
                        '40%': { transform: 'scale(1)' },
                        '100%': { transform: 'scale(0)' },
                      },
                      '&:nth-of-type(1)': {
                        animationDelay: '0s',
                      },
                      '&:nth-of-type(2)': {
                        animationDelay: '0.2s',
                      },
                      '&:nth-of-type(3)': {
                        animationDelay: '0.4s',
                      },
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#000',
                      marginLeft: '4px',
                      animation: 'dot 1.4s infinite both',
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#000',
                      marginLeft: '4px',
                      animation: 'dot 1.4s infinite both',
                    }}
                  />
                </Typography>
              </Box>
            )}
          </Box>

          {/* Input area */}
          <Box display="flex" mt={2}>
            <TextField
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyUp={handleKeyPress}
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
