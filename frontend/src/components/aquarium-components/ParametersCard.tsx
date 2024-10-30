// src/components/aquarium-components/ParametersCard.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Aquarium, WaterParameterEntry } from '../../interfaces/Aquarium';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import ParameterLoggingModal from './ParameterLoggingModal';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

interface ParametersCardProps {
  aquarium: Aquarium;
  onUpdateParameters: (newParameters: WaterParameterEntry[]) => void;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

enum DisplayMode {
  CURRENT_PARAMETERS,
  TEMPERATURE_GRAPH,
  PH_GRAPH,
}

const ParametersCard: React.FC<ParametersCardProps> = ({ aquarium, onUpdateParameters, handleSnackbar }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CURRENT_PARAMETERS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingModalOpen, setLoggingModalOpen] = useState(false);
  const [parameterEntries, setParameterEntries] = useState<WaterParameterEntry[]>(aquarium.parameterEntries || []);

  useEffect(() => {
    setParameterEntries(aquarium.parameterEntries || []);
  }, [aquarium]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const cycleDisplayMode = () => {
    if (!anchorEl) {
      const validModes = Object.values(DisplayMode).filter((value) => typeof value === 'number');
      setDisplayMode((prevMode) => ((prevMode + 1) % validModes.length) as DisplayMode);
    }
  };

  const handleOpenLoggingModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoggingModalOpen(true);
  };

  const handleCloseLoggingModal = () => {
    setLoggingModalOpen(false);
  };

  const handleAddParameterEntry = (newEntry: WaterParameterEntry) => {
    const updatedEntries = [...parameterEntries, newEntry];
    setParameterEntries(updatedEntries);
    onUpdateParameters(updatedEntries);
    handleSnackbar('New parameter entry added.', 'success', true);
    setLoggingModalOpen(false);
  };

  const displayModeText = {
    [DisplayMode.CURRENT_PARAMETERS]: 'Current Parameters',
    [DisplayMode.TEMPERATURE_GRAPH]: 'Temperature Over Time',
    [DisplayMode.PH_GRAPH]: 'pH Over Time',
    // Add more display mode texts as needed
  };

  const renderContent = () => {
    switch (displayMode) {
      case DisplayMode.CURRENT_PARAMETERS:
        const latestEntry = parameterEntries.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latestEntry) {
          return <Typography variant="body2">No parameter entries available.</Typography>;
        }
        return (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2">Temperature: {latestEntry.temperature} °C</Typography>
            <Typography variant="body2">pH: {latestEntry.ph}</Typography>
            <Typography variant="body2">Hardness: {latestEntry.hardness} dGH</Typography>
            {/* Add more parameters as needed */}
            <Typography variant="caption" sx={{ display: 'block', marginTop: 1 }}>
              Last Updated: {new Date(latestEntry.timestamp).toLocaleString()}
            </Typography>
          </Box>
        );
      case DisplayMode.TEMPERATURE_GRAPH:
        return renderParameterGraph('temperature', 'Temperature (°C)');
      case DisplayMode.PH_GRAPH:
        return renderParameterGraph('ph', 'pH Level');
      // Add more cases for different parameters
      default:
        return null;
    }
  };

  const renderParameterGraph = (parameterKey: keyof WaterParameterEntry, label: string) => {
    const sortedEntries = parameterEntries.slice().sort((a, b) => a.timestamp - b.timestamp);
    const data = {
      labels: sortedEntries.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: label,
          data: sortedEntries.map((entry) => entry[parameterKey]),
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    };
    return (
      <Box sx={{ marginTop: 2 }}>
        <Line data={data} />
      </Box>
    );
  };

  return (
    <>
      <Card sx={cardStyle} onClick={cycleDisplayMode}>
        <CardContent>
          <Typography variant="h6">Water Parameters</Typography>
          <Typography variant="body1">{displayModeText[displayMode]}</Typography>

          {renderContent()}

          {/* Add New Parameter Entry */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Log New Parameters
            </Typography>

            <Tooltip title="Log New Parameters">
              <IconButton color="primary" onClick={handleOpenLoggingModal}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>

        <IconButton color="primary" sx={iconStyle} onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.CURRENT_PARAMETERS);
            }}
          >
            Current Parameters
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.TEMPERATURE_GRAPH);
            }}
          >
            Temperature Graph
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.PH_GRAPH);
            }}
          >
            pH Graph
          </MenuItem>
          {/* Add more menu items for other parameters */}
        </Menu>
      </Card>

      {/* Parameter Logging Modal */}
      <ParameterLoggingModal
        open={loggingModalOpen}
        onClose={handleCloseLoggingModal}
        onAddEntry={handleAddParameterEntry}
      />
    </>
  );
};

const cardStyle = {
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  userSelect: 'none',
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.01)',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
  },
};

const iconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: '#B0BEC5',
  fontSize: '20px',
};

export default ParametersCard;
