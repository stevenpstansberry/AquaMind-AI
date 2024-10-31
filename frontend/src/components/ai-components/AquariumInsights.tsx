import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AIChatInterface from './AIChatInterface'; 
import { Aquarium } from '../../interfaces/Aquarium'; 
interface AquariumInsightsProps {
  insightText?: string;
  aquarium: Aquarium; 
}

const AquariumInsights: React.FC<AquariumInsightsProps> = ({
  insightText = "Your tank's water temperature is optimal for Tetra species. Make sure to monitor pH levels regularly.",
  aquarium,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ marginTop: 'auto' }}>
      <Card
        sx={{
          width: '100%',
          transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardContent sx={{ cursor: 'pointer' }} onClick={handleExpandClick}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Aquarium Insights (AI-Powered)</Typography>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          {!expanded && (
            <Typography variant="body1">
              {insightText}
            </Typography>
          )}
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {/* AIChatInterface component */}
            <AIChatInterface
              showChat={true}
              onClose={() => setExpanded(false)}
              aquarium={aquarium} // Pass the aquarium prop for context
            />
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default AquariumInsights;
