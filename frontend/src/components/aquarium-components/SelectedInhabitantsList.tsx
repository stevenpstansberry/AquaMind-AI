// SelectedInhabitantsList.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Add, Remove, Delete, Info } from '@mui/icons-material';

interface SelectedInhabitantsListProps<T> {
  selectedItems: T[];
  onAddAll: () => void;
  label: string;
  buttonText: string;
  onQuantityChange: (item: T, quantity: number) => void;
  onRemoveItem: (item: T) => void;
  onInfoClick: (item: T) => void; // New prop for info click handler
}

function SelectedInhabitantsList<T extends { name: string; count: number }>(
  props: SelectedInhabitantsListProps<T>
): JSX.Element | null {
  const { selectedItems, onAddAll, label, buttonText, onQuantityChange, onRemoveItem, onInfoClick } = props;

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="selected items table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Info</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="decrease quantity"
                    onClick={() => onQuantityChange(item, item.count - 1)}
                    disabled={item.count <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography variant="body1" display="inline" mx={1}>
                    {item.count}
                  </Typography>
                  <IconButton
                    aria-label="increase quantity"
                    onClick={() => onQuantityChange(item, item.count + 1)}
                  >
                    <Add />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton aria-label="info" onClick={() => onInfoClick(item)}>
                    <Info />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton aria-label="remove item" onClick={() => onRemoveItem(item)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} textAlign="right">
        <Button variant="contained" color="primary" onClick={onAddAll}>
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}

export default SelectedInhabitantsList;
