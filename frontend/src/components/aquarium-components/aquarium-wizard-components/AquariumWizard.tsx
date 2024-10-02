import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Backdrop, TextField, CircularProgress } from '@mui/material';
import AquariumTypeStep from './AquariumTypeStep';
import TankSizeStep from './TankSizeStep';
import SpeciesSelectionStep from './SpeciesSelectionStep';
import EquipmentStep from './EquipmentStep';
import SummaryStep from './SummaryStep';
import AquariumWizardProgress from './AquariumWizardProgress';

interface AquariumWizardProps {
  onClose: () => void;
}

const AquariumWizard: React.FC<AquariumWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aquariumData, setAquariumData] = useState({
    type: '',
    size: '',
    species: [],
    equipment: [],
  });

  const [showChat, setShowChat] = useState(false); // Toggle between wizard and chat interface
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]); // Store conversation messages
  const [userInput, setUserInput] = useState(''); // Track user input for chat
  const [loading, setLoading] = useState(false); // Loading state for GPT response

  const chatContainerRef = useRef<HTMLDivElement>(null); // Create a ref for the chat container

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const steps = ['Aquarium Type', 'Tank Size', 'Species', 'Equipment', 'Summary'];

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
    <Backdrop open={true} sx={{ zIndex: 1000 }}>
      <Card sx={{
        width: '800px',
        padding: '30px',
        position: 'relative',
        zIndex: 1001,
        maxHeight: '90vh', // Restrict the total card height
        overflowY: 'auto', // Ensure content is scrollable if it overflows
      }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Aquarium Setup Wizard</Typography>
          <Button onClick={onClose} sx={{ fontSize: '1.5rem' }}>×</Button>
        </Box>

        {/* Aquarium Wizard Steps */}
        <AquariumWizardProgress activeStep={currentStep} steps={steps} />
        <CardContent>
          {/* Step components */}
          {currentStep === 0 && <AquariumTypeStep  setAquariumData={setAquariumData} />}
          {currentStep === 1 && <TankSizeStep   setAquariumData={setAquariumData} />}
          {currentStep === 2 && <SpeciesSelectionStep   setAquariumData={setAquariumData} />}
          {currentStep === 3 && <EquipmentStep  setAquariumData={setAquariumData} />}
          {currentStep === 4 && <SummaryStep aquariumData={aquariumData}  />}
        </CardContent>

        {/* Button container */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          {currentStep > 0 ? (
            <Button onClick={handlePrev}>Back</Button>
          ) : (
            <Box />
          )}

          <Box display="flex" gap={2}>
            {/* Button to expand the card and show the AI chat interface below */}
            <Button variant="outlined" onClick={() => setShowChat((prev) => !prev)}>
              {showChat ? "Hide AI" : "Ask AI"}
            </Button>

            {/* Always align the Next/Finish button to the right */}
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            ) : (
              <Button variant="contained" onClick={onClose}>Finish</Button>
            )}
          </Box>
        </Box>

        {/* Chat Interface - Expanded below the wizard */}
        <Box
          sx={{
            height: showChat ? '300px' : '0px', // Adjust height based on showChat
            overflow: 'hidden', // Hide overflow when collapsed
            transition: 'height 0.5s ease', // Smooth height transition
            mt: showChat ? 2 : 0, // Only add margin-top when expanded
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
                ref={chatContainerRef} // Attach the ref to the chat container
                flex={1}
                sx={{
                  overflowY: 'auto',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  bgcolor: '#f9f9f9',
                  maxHeight: '300px', // Ensure chat area has a fixed height
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
      </Card>
    </Backdrop>
  );
};

export default AquariumWizard;
