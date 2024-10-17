/**
 * @file ChatContent.tsx
 * @location src/components/ChatContent.tsx
 * @description This component renders the chat content, including messages, input field, and suggestions.
 * It handles the message sending, typewriter effect, and displays chat messages between the user and the AI.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SquareIcon from '@mui/icons-material/Square';
import { Aquarium } from '../interfaces/Aquarium';
import { keyframes } from '@mui/system';

interface ChatContentProps {
  aquarium?: Aquarium;
  suggestions?: string[];
}

const typingAnimation = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const TypingIndicator: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {[0, 0.2, 0.4].map((delay, index) => (
      <Box
        key={index}
        sx={{
          width: '8px',
          height: '8px',
          backgroundColor: '#ccc',
          borderRadius: '50%',
          animation: `${typingAnimation} 1.4s infinite`,
          animationDelay: `${delay}s`,
          mr: index < 2 ? '4px' : '0',
        }}
      />
    ))}
  </Box>
);

/**
 * ChatContent Component
 * @description Handles the chat content, including displaying messages, handling user input, and showing suggestions.
 * Manages the message list, typewriter effect for AI responses, and user interactions within the chat.
 * 
 * @param {ChatContentProps} props - The props for the ChatContent component.
 * @returns {JSX.Element} The rendered chat content.
 */
const ChatContent: React.FC<ChatContentProps> = ({ aquarium, suggestions: initialSuggestions }) => {
  const [messages, setMessages] = useState<{ sender: string, text: string, timestamp: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedText, setRevealedText] = useState(''); // For the text being revealed in the typewriter effect
  const [typewriterCompleted, setTypewriterCompleted] = useState(true); // To track the completion of the typewriter effect
  const [fullResponseText, setFullResponseText] = useState(''); // Store the full AI response text
  const [suggestions, setSuggestions] = useState<string[] | null>(initialSuggestions || null);  // State for suggestions
  const [isMessageAdding, setIsMessageAdding] = useState(false);  // New state to block stop button during message adding  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to track and clear typing interval

  /**
   * @description Scrolls the chat container to the bottom when called.
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  /**
   * @description Gets the current timestamp in HH:MM format.
   * @returns {string} The current time formatted as a string.
   */
  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * @description Handles sending a user message to the chat and generating an AI response.
   * @param {string} [inputMessage] - Optional input message. Defaults to user input state.
   */
  const handleSendMessage = async (inputMessage?: string) => {
    const messageToSend = inputMessage || userInput;
    if (!messageToSend.trim()) return;
    
    const newMessage = { sender: 'User', text: messageToSend, timestamp: getCurrentTimestamp() };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');  // Clear the input field

    // Hide suggestions when a message is sent
    setSuggestions(null);
    
    // Set isMessageAdding to true to block the stop button temporarily
    setIsMessageAdding(true);

    setLoading(true);
    setTypewriterCompleted(false);

    setTimeout(() => {
      let aiResponseText = `Simulated response to: "${newMessage.text}"`;

      if (aquarium) {
        aiResponseText += ` Considering your ${aquarium.name}`;
      }

      setFullResponseText(aiResponseText);  // Store the full AI response
      typeTextEffect(aiResponseText);       // Start the typewriter effect
      setLoading(false);
    }, 1000);
  };

  /**
   * @description Simulates a typewriter effect for the AI response, progressively revealing text.
   * @param {string} text - The AI response text to be revealed.
   */
  const typeTextEffect = (text: string) => {
    setRevealedText('');  // Clear previously revealed text
    let index = 0;

    // Ensure message is added before typing starts
    setMessages((prev) => [...prev, { sender: 'AI', text: '', timestamp: getCurrentTimestamp() }]);

    // Reset isMessageAdding to false once the typewriter effect begins
    setIsMessageAdding(false);

    typingIntervalRef.current = setInterval(() => {
      if (index <= text.length) {
        // Update the revealed text progressively
        setRevealedText(text.slice(0, index)); // Reveal text up to the current index
        index++;
        scrollToBottom(); // Ensure the chat scrolls to the newest message
      } else {
        clearInterval(typingIntervalRef.current!); // Stop the interval when done
        setTypewriterCompleted(true); // Mark typewriter as complete
      }
    }, 25); // Speed of the typing effect (25ms per character)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only update the AI message progressively as text reveals
    if (revealedText) {
      setMessages((prev) => {
        const updatedMessages = prev.map((msg, index) =>
          index === prev.length - 1 && msg.sender === 'AI'
            ? { ...msg, text: revealedText } // Only update the last AI message
            : msg
        );
        return updatedMessages;
      });
    }
  }, [revealedText]);

  /**
   * @description Handles completing the typewriter effect and instantly revealing the full AI response.
   */
  const handleAutoCompleteText = () => {
    // If a message is being added (before the typewriter effect starts), do nothing
    if (isMessageAdding) return;

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

  /**
   * @description Handles the Enter key press to send a message or complete the typewriter effect.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The key press event.
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && typewriterCompleted) {
      handleSendMessage();
    } else if (event.key === 'Enter' && !typewriterCompleted) {
      handleAutoCompleteText();
    }
  };

  /**
   * @description Handles the selection of a suggestion and sends it as a message.
   * @param {string} suggestion - The selected suggestion text.
   */
  const handleSuggestionClick = (suggestion: string) => {
    setSuggestions(null);  // Hide suggestions after a click
    handleSendMessage(suggestion);  // Send the suggestion as a message
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: '100%',
        position: 'relative',
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
          height: 'calc(100% - 100px)', // Adjust height accordingly
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
                  borderRadius: '15px',
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

      {/* Input area */}
      <Box
        display="flex"
        alignItems="center"
        mt={2}
        sx={{ borderRadius: '24px', padding: '4px 8px' }}
      >
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

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row',  
            flexWrap: 'wrap',      
            gap: 2,               
            justifyContent: 'flex-start',  
            alignItems: 'flex-end',
            padding: '8px',        
            height: 'auto',        
          }}
        >
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
                margin: '4px',      // Add margin around each button for additional space
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
    </Box>
  );
};

export default ChatContent;
