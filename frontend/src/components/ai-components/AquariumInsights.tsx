/**
 * @file AquariumInsights.tsx
 * @location src/components/aquarium/AquariumInsights.tsx
 * @description This component provides an interactive card that displays AI-powered insights about a specific aquarium.
 * Users can expand or collapse the card to access an AI chat interface for more detailed insights.
 * 
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AIChatInterface from './AIChatInterface'; 
import { Aquarium } from '../../interfaces/Aquarium'; 

/**
 * @interface AquariumInsightsProps
 * @description Props for the AquariumInsights component.
 * @property {string} [insightText] - Optional text to display as a teaser for the insights. Defaults to a preset description.
 * @property {Aquarium} aquarium - The aquarium object containing details relevant for generating AI insights.
 */
interface AquariumInsightsProps {
  insightText?: string;
  aquarium: Aquarium; 
}

/**
 * @component AquariumInsights
 * @description A collapsible card component that provides AI-powered insights for a specific aquarium.
 * The card includes a teaser text, an expand/collapse mechanism, and an embedded AIChatInterface component.
 * @param {AquariumInsightsProps} props - Props for the AquariumInsights component.
 * @returns {JSX.Element} A responsive, interactive card with expandable AI insights.
 */
const AquariumInsights: React.FC<AquariumInsightsProps> = ({
  insightText = "Get insights about your aquarium from our AI-powered chat interface.",
  aquarium,
}) => {
  const [expanded, setExpanded] = useState(false);

  /**
   * @function handleExpandClick
   * @description Toggles the expansion state of the card.
   */
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
