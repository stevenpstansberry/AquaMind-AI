/**
 * @file FilterPanel.tsx
 * @location src/components/common/FilterPanel.tsx
 * @description A reusable filter panel component for filtering items based on role, care level, tank size, and search query.
 * Provides dropdowns for role and care level filtering, a numeric input for minimum tank size, and a text input for search.
 * 
 * @interface FilterPanelProps
 * @property {string} roleFilter - The selected role filter value.
 * @property {(value: string) => void} setRoleFilter - Callback to update the role filter.
 * @property {string} careLevelFilter - The selected care level filter value.
 * @property {(value: string) => void} setCareLevelFilter - Callback to update the care level filter.
 * @property {number} minTankSizeFilter - The minimum tank size filter value.
 * @property {(value: number) => void} setMinTankSizeFilter - Callback to update the minimum tank size filter.
 * @property {string} searchQuery - The current search query for name filtering.
 * @property {(value: string) => void} setSearchQuery - Callback to update the search query.
 * @property {string[]} roles - List of available roles for filtering.
 * @property {string[]} careLevels - List of available care levels for filtering.
 * @property {string} searchLabel - Label for the search input field.
 * 
 * @author Steven Stansberry
 */
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

/**
 * @component FilterPanel
 * @description A panel with controls to filter items based on role, care level, tank size, and name search.
 * @param {FilterPanelProps} props - The component props.
 * @returns {JSX.Element} The FilterPanel component.
 */
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
