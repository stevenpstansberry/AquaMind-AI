// SelectedInhabitantsList.tsx
import React from 'react';
import { Box, Typography, List, ListItem, Button } from '@mui/material';

interface SelectedInhabitantsListProps<T> {
  selectedItems: T[];
  onAddAll: () => void;
  label: string;
  buttonText: string;
}

const SelectedInhabitantsList = <T extends { name: string }>({
  selectedItems,
  onAddAll,
  label,
  buttonText,
}: SelectedInhabitantsListProps<T>) => {
  return (
    selectedItems.length > 0 && (
      <Box mt={2} display="flex" justifyContent="flex-end" alignItems="flex-end" textAlign="right">
        <Box>
          <Typography variant="h6">{label}</Typography>
          <List>
            {selectedItems.map((item) => (
              <ListItem key={item.name} sx={{ padding: 0 }}>
                <Typography variant="body2">• {item.name}</Typography>
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={onAddAll}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    )
  );
};

export default SelectedInhabitantsList;
