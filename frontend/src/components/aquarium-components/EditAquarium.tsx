import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Aquarium } from '../../interfaces/Aquarium';

interface EditAquariumProps {
    aquarium: Aquarium;
    onSave: (updatedAquarium: Aquarium) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
    open: boolean;
    handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

const EditAquarium: React.FC<EditAquariumProps> = ({ aquarium, onSave, onDelete, onClose, open, handleSnackbar }) => {
    const [name, setName] = useState(aquarium.name);
    const [size, setSize] = useState(aquarium.size);
    const [type, setType] = useState(aquarium.type);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State to manage confirmation dialog


    const handleSave = () => {
        if (name.trim() === '' || size.trim() === '') {
            handleSnackbar('Name and size must be filled out!', 'warning', true);
            return;
        }

        const updatedAquarium: Aquarium = {
            ...aquarium,
            name,
            size,
            type,
        };
        onSave(updatedAquarium);
    };

    const handleDelete = () => {
        setConfirmDialogOpen(true); // Open confirmation dialog when delete is clicked
    };

    const handleConfirmDelete = () => {
        onDelete(aquarium.id);
        handleSnackbar('Aquarium deleted successfully!', 'success', true);
        setConfirmDialogOpen(false); // Close confirmation dialog
        onClose(); // Close the edit dialog
    };

    const handleCancelDelete = () => {
        setConfirmDialogOpen(false); // Close confirmation dialog without deleting
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>
                    Edit Aquarium: {aquarium.name}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        <TextField
                            label="Aquarium Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Size (gallons)"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            type="number"
                            fullWidth
                        />
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value as "Freshwater" | "Saltwater")}
                            fullWidth
                        >
                            <MenuItem value="Freshwater">Freshwater</MenuItem>
                            <MenuItem value="Saltwater">Saltwater</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog for Deletion */}
            <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this aquarium? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditAquarium;
