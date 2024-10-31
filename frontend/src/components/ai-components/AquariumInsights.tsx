import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface AquariumInsightsProps {
  insightText?: string;
}

const AquariumInsights: React.FC<AquariumInsightsProps> = ({
  insightText = "Your tank's water temperature is optimal for Tetra species. Make sure to monitor pH levels regularly."
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
      <Card
        sx={{
          width: '100%',
          height: '150px',
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
        <CardContent>
          <Typography variant="h6">Aquarium Insights (AI-Powered)</Typography>
          <Typography variant="body1">
            {insightText}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AquariumInsights;
