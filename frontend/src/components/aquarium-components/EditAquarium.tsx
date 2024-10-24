import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Aquarium } from '../../interfaces/Aquarium';

interface EditAquariumProps {
    aquarium: Aquarium;
    onSave: (updatedAquarium: Aquarium) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
    open: boolean;
}

const EditAquarium: React.FC<EditAquariumProps> = ({ aquarium, onSave, onDelete, onClose, open }) => {
    const [name, setName] = useState(aquarium.name);
    const [size, setSize] = useState(aquarium.size);
    const [type, setType] = useState(aquarium.type);

    const handleSave = () => {
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
            <DialogTitle>Edit Aquarium</DialogTitle>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAquarium;
