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
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateIcon from '@mui/icons-material/Create';
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
  PARAMETER_GRAPH,
  HEALTH_CHECK,
}

const ParametersCard: React.FC<ParametersCardProps> = ({ aquarium, onUpdateParameters, handleSnackbar }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CURRENT_PARAMETERS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingModalOpen, setLoggingModalOpen] = useState(false);
  const [parameterEntries, setParameterEntries] = useState<WaterParameterEntry[]>(aquarium.parameterEntries || []);
  const [selectedParameter, setSelectedParameter] = useState<keyof WaterParameterEntry>('temperature');
  const [timeFrame, setTimeFrame] = useState<string>('All Time');

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
    [DisplayMode.PARAMETER_GRAPH]: 'Parameter Graph',
    [DisplayMode.HEALTH_CHECK]: 'Health Check',
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
      case DisplayMode.PARAMETER_GRAPH:
        return renderParameterGraph();
      case DisplayMode.HEALTH_CHECK:
        return renderHealthCheck();
      default:
        return null;
    }
  };

  const renderParameterGraph = () => {
    const filteredEntries = parameterEntries
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .filter((entry) => {
        if (timeFrame === 'All Time') return true;
        const timeDifference = Date.now() - entry.timestamp;
        if (timeFrame === 'Last Week') return timeDifference <= 7 * 24 * 60 * 60 * 1000;
        if (timeFrame === 'Last Month') return timeDifference <= 30 * 24 * 60 * 60 * 1000;
        return true;
      });

    const data = {
      labels: filteredEntries.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1),
          data: filteredEntries.map((entry) => entry[selectedParameter]),
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    };

    return (
      <Box sx={{ marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Parameter</InputLabel>
          <Select
            value={selectedParameter}
            label="Parameter"
            onChange={(e) => setSelectedParameter(e.target.value as keyof WaterParameterEntry)}
          >
            <MenuItem value="temperature">Temperature</MenuItem>
            <MenuItem value="ph">pH</MenuItem>
            <MenuItem value="hardness">Hardness</MenuItem>
            {/* Add more parameters as needed */}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select value={timeFrame} label="Time Frame" onChange={(e) => setTimeFrame(e.target.value)}>
            <MenuItem value="All Time">All Time</MenuItem>
            <MenuItem value="Last Week">Last Week</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            {/* Add more time frames as needed */}
          </Select>
        </FormControl>
        <Line data={data} />
      </Box>
    );
  };

  const renderHealthCheck = () => {
    const latestEntry = parameterEntries.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
    if (!latestEntry) {
      return <Typography variant="body2">No parameter entries available for health check.</Typography>;
    }

    const issues: string[] = [];

    // Example comparison logic
    aquarium.species.forEach((fish) => {
      if (fish.waterParameters) {
        // Parse ideal parameters from fish.waterParameters
        const { minTemp, maxTemp, minPh, maxPh } = parseWaterParameters(fish.waterParameters);
        if (latestEntry.temperature < minTemp || latestEntry.temperature > maxTemp) {
          issues.push(`Temperature out of range for ${fish.name}.`);
        }
        if (latestEntry.ph < minPh || latestEntry.ph > maxPh) {
          issues.push(`pH out of range for ${fish.name}.`);
        }
      }
    });

    aquarium.plants.forEach((plant) => {
      if (plant.waterParameters) {
        const { minTemp, maxTemp, minPh, maxPh } = parseWaterParameters(plant.waterParameters);
        if (latestEntry.temperature < minTemp || latestEntry.temperature > maxTemp) {
          issues.push(`Temperature out of range for ${plant.name}.`);
        }
        if (latestEntry.ph < minPh || latestEntry.ph > maxPh) {
          issues.push(`pH out of range for ${plant.name}.`);
        }
      }
    });

    if (issues.length === 0) {
      return (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          All parameters are within ideal ranges for your species and plants.
        </Typography>
      );
    } else {
      return (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">Health Check Issues:</Typography>
          {issues.map((issue, index) => (
            <Typography variant="body2" color="error" key={index}>
              - {issue}
            </Typography>
          ))}
        </Box>
      );
    }
  };

  const parseWaterParameters = (params: string) => {
    // Example parser, assumes format like "pH 6.0-7.0, Temperature 72-78°F"
    const result = { minTemp: 0, maxTemp: 100, minPh: 0, maxPh: 14 };
    const tempMatch = params.match(/Temperature\s*(\d+)-(\d+)/);
    const phMatch = params.match(/pH\s*(\d+\.?\d*)-(\d+\.?\d*)/);
    if (tempMatch) {
      result.minTemp = parseFloat(tempMatch[1]);
      result.maxTemp = parseFloat(tempMatch[2]);
    }
    if (phMatch) {
      result.minPh = parseFloat(phMatch[1]);
      result.maxPh = parseFloat(phMatch[2]);
    }
    return result;
  };

  return (
    <>
      <Card sx={cardStyle} onClick={cycleDisplayMode}>
        <CardContent>
          <Typography variant="h6">Water Parameters</Typography>
          <Typography variant="body1">{displayModeText[displayMode]}</Typography>

          {renderContent()}

          {/* Log New Parameters */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Log New Parameters
            </Typography>

            <Tooltip title="Log New Parameters">
              <IconButton color="primary" onClick={handleOpenLoggingModal}>
                <CreateIcon />
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
              handleMenuClose();
            }}
          >
            Current Parameters
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.PARAMETER_GRAPH);
              handleMenuClose();
            }}
          >
            Parameter Graph
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.HEALTH_CHECK);
              handleMenuClose();
            }}
          >
            Health Check
          </MenuItem>
        </Menu>
      </Card>

      {/* Parameter Logging Modal */}
      <ParameterLoggingModal
        open={loggingModalOpen}
        onClose={handleCloseLoggingModal}
        onAddEntry={handleAddParameterEntry}
        aquarium={aquarium}
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