// FilterPanel.tsx
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

interface FilterPanelProps {
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  careLevelFilter: string;
  setCareLevelFilter: (value: string) => void;
  minTankSizeFilter: number;
  setMinTankSizeFilter: (value: number) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  roles: string[];
  careLevels: string[];
  searchLabel: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  roleFilter,
  setRoleFilter,
  careLevelFilter,
  setCareLevelFilter,
  minTankSizeFilter,
  setMinTankSizeFilter,
  searchQuery,
  setSearchQuery,
  roles,
  careLevels,
  searchLabel,
}) => {
  return (
    <Box>
      {/* Filter by Role */}
      <FormControl fullWidth margin="normal">
        <InputLabel shrink>Filter by Role</InputLabel>
        <Select
          label="Filter by Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filter by Care Level */}
      <FormControl fullWidth margin="normal">
        <InputLabel shrink>Filter by Care Level</InputLabel>
        <Select
          label="Filter by Care Level"
          value={careLevelFilter}
          onChange={(e) => setCareLevelFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Care Levels</MenuItem>
          {careLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filter by Minimum Tank Size */}
      <TextField
        label="Filter by Minimum Tank Size (gallons)"
        type="number"
        value={minTankSizeFilter}
        onChange={(e) => setMinTankSizeFilter(parseInt(e.target.value) || 0)}
        fullWidth
        margin="normal"
      />

      {/* Search by Name */}
      <TextField
        label={searchLabel}
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Box>
  );
};

export default FilterPanel;
