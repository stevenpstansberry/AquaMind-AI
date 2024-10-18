/**
 * @file ChatContent.tsx
 * @location src/components/ai-components/ChatContent.tsx
 * @description This component renders the chat content, including messages, input field, and suggestions.
 * It handles the message sending, typewriter effect, and displays chat messages between the user and the AI.
 * Provides a method to clear the chat messages.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SquareIcon from '@mui/icons-material/Square';
import { Aquarium } from '../../interfaces/Aquarium';
import { keyframes } from '@mui/system';
import { sendMessageToOpenAI } from '../../services/APIServices';
import ReactMarkdown from 'react-markdown';


interface ChatContentProps {
  aquarium?: Aquarium;
  suggestions?: string[];
  onAddItem?: (itemType: string, itemName: string) => void;
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


const MAX_CHARACTERS = 500; // Maximum characters allowed in the input field

type SuggestedItem = {
  type: string;
  name: string;
};

const parseItemSuggestion = (text: string): SuggestedItem | null => {
  const regex = /\[ADD_ITEM type="(.*?)"\](.*?)\[\/ADD_ITEM\]/;
  const match = text.match(regex);
  if (match && match[1] && match[2]) {
    return { type: match[1].trim().toLowerCase(), name: match[2].trim() };
  }
  return null;
};

/**
 * ChatContent Component
 * @description Handles the chat content, including displaying messages, handling user input, and showing suggestions.
 * Manages the message list, typewriter effect for AI responses, and user interactions within the chat.
 * Provides a method to clear the chat messages.
 * 
 * @param {ChatContentProps} props - The props for the ChatContent component.
 * @returns {JSX.Element} The rendered chat content.
 */
const ChatContent = forwardRef<{ clearChat: () => void }, ChatContentProps>(
  ({ aquarium, suggestions: initialSuggestions, onAddItem }, ref) => {
    const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [revealedText, setRevealedText] = useState(''); // For the text being revealed in the typewriter effect
    const [typewriterCompleted, setTypewriterCompleted] = useState(true); // To track the completion of the typewriter effect
    const [fullResponseText, setFullResponseText] = useState(''); // Store the full AI response text
    const [suggestions, setSuggestions] = useState<string[] | null>(initialSuggestions || null);  // State for suggestions
    const [isMessageAdding, setIsMessageAdding] = useState(false);  // New state to block stop button during message adding  
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to track and clear typing interval
    const [suggestedItem, setSuggestedItem] = useState<SuggestedItem | null>(null);


    // Function to generate aquarium description
    const getAquariumDescription = (aquarium: Aquarium): string => {
      let description = `You are an assistant helping with an aquarium management application. The aquarium details are as follows:\n`;
    
      if (aquarium.name) {
        description += `Name: ${aquarium.name}\n`;
      }
      if (aquarium.size) {
        description += `Size: ${aquarium.size}\n`;
      }
      if (aquarium.species && aquarium.species.length > 0) {
        description += `Fish: ${aquarium.species.map(f => f.name).join(', ')}\n`;
      }
      if (aquarium.plants && aquarium.plants.length > 0) {
        description += `Plants: ${aquarium.plants.map(p => p.name).join(', ')}\n`;
      }
      if (aquarium.equipment && aquarium.equipment.length > 0) {
        description += `Equipment: ${aquarium.equipment.map(e => e.name).join(', ')}\n`;
      }
    
      // Add generic instructions for the assistant
      description += `
    When suggesting an item to add, please provide the item type and name in the following format:
    
    [ADD_ITEM type="item_type"]Item Name[/ADD_ITEM]
    
    Replace "item_type" with "fish", "plant", "equipment", or other appropriate type.
    After the user confirms, do not ask again, and wait for the application to handle the addition.
    `;
    
      return description;
    };


    const handleAIResponse = (aiResponseText: string) => {
      setFullResponseText(aiResponseText);
      typeTextEffect(aiResponseText);
    
      const itemSuggestion = parseItemSuggestion(aiResponseText);
    
      if (itemSuggestion) {
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: `Would you like to add ${itemSuggestion.name} (${itemSuggestion.type}) to your tank?`, timestamp: getCurrentTimestamp() },
        ]);
    
        setSuggestedItem(itemSuggestion);
      }
    };
    
    

    /**
     * @description Clears the chat messages.
     */
    const clearChat = () => {
      setMessages([]);
      setUserInput('');
      setRevealedText('');
      setTypewriterCompleted(true);
      setFullResponseText('');
      setLoading(false);
      setIsMessageAdding(false);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };

    // Expose the clearChat function to the parent component
    useImperativeHandle(ref, () => ({
      clearChat,
    }));

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

    const addItemToAquarium = (item: SuggestedItem) => {
      if (onAddItem) {
        onAddItem(item.type, item.name);
      }
    };


    const isAffirmative = (text: string): boolean => {
      const affirmativeResponses = ["yes", "yeah", "yep", "sure", "please do", "absolutely", "of course"];
      return affirmativeResponses.includes(text.toLowerCase().trim());
    };

    /**
     * @description Handles sending a user message to the chat and generating an AI response.
     * @param {string} [inputMessage] - Optional input message. Defaults to user input state.
     */
    const handleSendMessage = async (inputMessage?: string) => {
      const messageToSend = inputMessage || userInput;
      if (!messageToSend.trim()) return;
    
      console.log("User message:", messageToSend);
    
      const newMessage = { sender: 'User', text: messageToSend, timestamp: getCurrentTimestamp() };
      const updatedMessages = [...messages, newMessage];
    
      setMessages(updatedMessages);
      setUserInput(''); // Clear the input field
    
      // Hide suggestions when a message is sent
      setSuggestions(null);
    
      // Set isMessageAdding to true to block the stop button temporarily
      setIsMessageAdding(true);
    
      setLoading(true);
      setTypewriterCompleted(false);
    
      try {
        // Check if the user is confirming the addition of an item
        if (suggestedItem && isAffirmative(messageToSend)) {
          addItemToAquarium(suggestedItem);
          setSuggestedItem(null);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'AI',
              text: `${suggestedItem.name} (${suggestedItem.type}) has been added to your tank.`,
              timestamp: getCurrentTimestamp(),
            },
          ]);
          setTypewriterCompleted(true);
          setLoading(false);
          return;
        }
        // Prepare chat history in OpenAI format
        let chatHistory: { role: string; content: string }[] = [];
    
        if (aquarium) {
          // Include the aquarium content as a system message
          const aquariumContent = getAquariumDescription(aquarium);
          chatHistory.push({ role: 'system', content: aquariumContent });
        }
    
        // Add the chat history messages
        chatHistory = [
          ...chatHistory,
          ...updatedMessages.map(msg => ({
            role: msg.sender === 'User' ? 'user' : 'assistant',
            content: msg.text
          }))
        ];
    
        // Make the API call using the sendMessageToOpenAI function
        console.log("Sending message to OpenAI...");
        const aiResponse = await sendMessageToOpenAI(chatHistory);
        console.log("AI Response:", aiResponse);
    
        // Extract the AI response text
        const aiResponseText = (aiResponse as { content: string }).content;
    
        // Store the full AI response
        setFullResponseText(aiResponseText);
    
        // Start the typewriter effect with the AI response
        typeTextEffect(aiResponseText);
    
      } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: 'Sorry, there was an error with the response.', timestamp: getCurrentTimestamp() },
        ]);
        setLoading(false);
        setTypewriterCompleted(true);
      } finally {
        setLoading(false);
      }
    };



    /**
     * @description Simulates a typewriter effect for the AI response, progressively revealing text.
     * @param {string} text - The AI response text to be revealed.
     */
    const typeTextEffect = (text: string) => {
      setRevealedText(''); // Clear previously revealed text
      let index = 0;
    
      // Ensure message is added before typing starts
      setMessages((prev) => [...prev, { sender: 'AI', text: '', timestamp: getCurrentTimestamp() }]);
    
      // Reset isMessageAdding to false once the typewriter effect begins
      setIsMessageAdding(false);
    
      typingIntervalRef.current = setInterval(() => {
        if (index <= text.length) {
          index++;
          const currentText = text.slice(0, index); // Get the current text up to the current index
    
          // Update the revealed text progressively
          setRevealedText(currentText);
    
          // Update the last message with the current text
          setMessages((prev) => {
            const updatedMessages = prev.map((msg, idx) =>
              idx === prev.length - 1 && msg.sender === 'AI' ? { ...msg, text: currentText } : msg
            );
            return updatedMessages;
          });
    
          scrollToBottom(); // Ensure the chat scrolls to the newest message
        } else {
          clearInterval(typingIntervalRef.current!); // Stop the interval when done
          typingIntervalRef.current = null;
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
                <Box
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
                  {message.sender === 'AI' ? (
                    <ReactMarkdown skipHtml={true}>
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <Typography>
                      {message.text}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))}

          {/* Typing Indicator */}
          {loading && !typewriterCompleted && (
            <Box display="flex" justifyContent="flex-start" mb={1}>
              <TypingIndicator />
            </Box>
          )}
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
            onChange={(e) => setUserInput(e.target.value.slice(0, MAX_CHARACTERS))}
            onKeyUp={handleKeyPress}
            placeholder={`Message AI... (Max ${MAX_CHARACTERS} characters)`}
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
            disabled={loading} // Disable input during AI response
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
            disabled={loading} // Disable button during AI response
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
  }
);

export default ChatContent;
