import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SquareIcon from '@mui/icons-material/Square';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; // Expand icon
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'; // Collapse icon
import { Aquarium } from '../interfaces/Aquarium';


interface AIChatInterfaceProps {
  showChat: boolean;
  onClose: () => void;
  aquarium?: Aquarium;
  suggestions?: string[];  // Optional prop for chat suggestions
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ showChat, onClose, aquarium, suggestions: initialSuggestions }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string, timestamp: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedText, setRevealedText] = useState(''); // For the text being revealed in the typewriter effect
  const [typewriterCompleted, setTypewriterCompleted] = useState(true); // To track the completion of the typewriter effect
  const [fullResponseText, setFullResponseText] = useState(''); // Store the full AI response text
  const [suggestions, setSuggestions] = useState<string[] | null>(initialSuggestions || null);  // State for suggestions
  const [isExpanded, setIsExpanded] = useState(false); // State for chat expansion
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to track and clear typing interval


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (inputMessage?: string) => {
    const messageToSend = inputMessage || userInput;
    if (!messageToSend.trim()) return;

    const newMessage = { sender: 'User', text: messageToSend, timestamp: getCurrentTimestamp() };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');  // Clear the input field

    setLoading(true);
    setTypewriterCompleted(false);

    setTimeout(() => {
      let aiResponseText = `Simulated response to: "${newMessage.text}"`;

      if (aquarium) {
        aiResponseText += ` Considering your ${aquarium.name}`;
      }

      setFullResponseText(aiResponseText); // Store the full AI response
      typeTextEffect(aiResponseText); // Start the typewriter effect
      setLoading(false);
    }, 1000);
  };

  // Typewriter effect function
  const typeTextEffect = (text: string) => {
    setRevealedText('');
    let index = 0;

    // Add the AI message to the messages only when typing begins
    setMessages((prev) => [...prev, { sender: 'AI', text: '', timestamp: getCurrentTimestamp() }]);

    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setRevealedText((prev) => prev + text[index]);
        index++;
        scrollToBottom(); // Ensure the chat scrolls to the newest message
      } else {
        clearInterval(typingIntervalRef.current!); // Stop the interval when typing is done
        setTypewriterCompleted(true); // Mark the typewriter effect as completed
      }
    }, 50); // Speed of the typing effect (50ms per character)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only update the AI message progressively as text reveals
    if (!loading && revealedText) {
      setMessages((prev) => {
        const updatedMessages = prev.map((msg, index) =>
          index === prev.length - 1 && msg.sender === 'AI'
            ? { ...msg, text: revealedText }
            : msg
        );
        return updatedMessages;
      });
    }
  }, [revealedText]);

  const handleAutoCompleteText = () => {
    // Stop the typewriter effect immediately
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current); // Clear the typewriter interval
      typingIntervalRef.current = null;
    }

    // Set the revealed text to the full response and mark typewriter as completed
    setRevealedText(fullResponseText);
    
    // Immediately update the AI message with the full response
    setMessages((prev) => {
      const updatedMessages = prev.map((msg, index) =>
        index === prev.length - 1 && msg.sender === 'AI' ? { ...msg, text: fullResponseText } : msg
      );
      return updatedMessages;
    });

    setTypewriterCompleted(true);
    scrollToBottom(); // Ensure chat is scrolled to bottom after completion
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && typewriterCompleted) {
      handleSendMessage();
    } else if (event.key === 'Enter' && !typewriterCompleted) {
      handleAutoCompleteText();
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setSuggestions(null);  // Hide suggestions after a click
    handleSendMessage(suggestion);  // Send the suggestion as a message
  };

  return (
    <Box
      sx={{
        height: showChat ? (isExpanded ? '85vh' : '300px') : '0px',  // Dynamic height based on expansion
        width: isExpanded ? '90vw' : '100%',  // Full width in expanded mode
        overflow: 'hidden',
        transition: 'height 0.5s ease, width 0.5s ease',
        mt: showChat ? 2 : 0,
        position: isExpanded ? 'fixed' : 'relative',  // Fixed in expanded mode
        top: isExpanded ? '5%' : 'unset',
        left: isExpanded ? '5%' : 'unset',
        zIndex: isExpanded ? 1000 : 'unset',  // Bring to front in expanded mode
        boxShadow: isExpanded ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
        backgroundColor: '#fff',
        borderRadius: isExpanded ? '10px' : 'none',
      }}
    >
      {showChat && (
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: '100%',
            paddingTop: '20px',
            position: 'relative',
          }}
        >
          {/* Expand/Collapse Icon */}
          <IconButton
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
              color: '#666',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>

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
              maxHeight: isExpanded ? '70vh' : '300px', // Expanded height control
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
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {message.text || (message.sender === 'AI' && loading ? revealedText : message.text)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Suggestions placed above the input box */}
          {suggestions && suggestions.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="contained"
                  sx={{
                    borderRadius: '24px',
                    backgroundColor: '#f0f0f0',
                    color: '#000',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    padding: '6px 12px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          )}

          {/* Input area */}
          <Box display="flex" alignItems="center" mt={2} sx={{ borderRadius: '24px', bgcolor: '#f0f0f0', padding: '4px 8px' }}>
            <TextField
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Message AI..."
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#000',
                  padding: '10px',
                },
              }}
              sx={{
                bgcolor: '#fff',
                borderRadius: '24px',
                paddingLeft: '12px',
              }}
            />

            <IconButton
              onClick={() => {
                if (typewriterCompleted) {
                  handleSendMessage();
                } else {
                  handleAutoCompleteText();
                }
              }}
              sx={{
                ml: 1,
                color: typewriterCompleted ? '#007bff' : 'gray',
                backgroundColor: typewriterCompleted ? '#e0e0e0' : '#f0f0f0',
                borderRadius: '50%',
                padding: '8px',
                '&:hover': {
                  backgroundColor: typewriterCompleted ? '#d0d0d0' : '#e0e0e0',
                },
              }}
            >
              {typewriterCompleted ? <ArrowUpwardIcon /> : <SquareIcon />}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIChatInterface;
