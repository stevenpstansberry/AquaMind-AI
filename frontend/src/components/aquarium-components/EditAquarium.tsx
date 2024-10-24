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
        onDelete(aquarium.id);
    };

    return (
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
    );
};

export default EditAquarium;
