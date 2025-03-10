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
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateIcon from '@mui/icons-material/Create';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Aquarium, WaterParameterEntry } from '../../interfaces/Aquarium';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js';
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
  AGGREGATED_RANGES,
}


interface LatestParameter {
  value: number;
  timestamp: number;
}

interface LatestParameters {
  temperature?: LatestParameter;
  ph?: LatestParameter;
  hardness?: LatestParameter;
  // Add other parameters as needed
}

// Function to get the latest value of each parameter
const getLatestParameters = (entries: WaterParameterEntry[]): LatestParameters => {
  const latestParameters: LatestParameters = {};
  const sortedEntries = entries.slice().sort((a, b) => b.timestamp - a.timestamp);

  for (const entry of sortedEntries) {
    if (!latestParameters.temperature && entry.temperature !== undefined) {
      latestParameters.temperature = { value: entry.temperature, timestamp: entry.timestamp };
    }
    if (!latestParameters.ph && entry.ph !== undefined) {
      latestParameters.ph = { value: entry.ph, timestamp: entry.timestamp };
    }
    if (!latestParameters.hardness && entry.hardness !== undefined) {
      latestParameters.hardness = { value: entry.hardness, timestamp: entry.timestamp };
    }
    // Add checks for other parameters
    // if (Object.keys(latestParameters).length === totalParametersCount) break;
  }

  return latestParameters;
};

const ParametersCard: React.FC<ParametersCardProps> = ({ aquarium, onUpdateParameters, handleSnackbar }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CURRENT_PARAMETERS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingModalOpen, setLoggingModalOpen] = useState(false);
  const [parameterEntries, setParameterEntries] = useState<WaterParameterEntry[]>(aquarium.parameterEntries || []);
  const [selectedParameter, setSelectedParameter] = useState<keyof WaterParameterEntry>('temperature');
  const [timeFrame, setTimeFrame] = useState<string>('All Time');
  const [filter, setFilter] = useState<string>('');

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
    [DisplayMode.AGGREGATED_RANGES]: 'Aggregated Ranges',
  };

  const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

  const renderContent = () => {
    switch (displayMode) {
      case DisplayMode.CURRENT_PARAMETERS:
        return renderCurrentParameters();
      case DisplayMode.PARAMETER_GRAPH:
        return renderParameterGraph();
      case DisplayMode.HEALTH_CHECK:
        return renderHealthCheck();
      case DisplayMode.AGGREGATED_RANGES:
        return renderAggregatedRanges();
      default:
        return null;
    }
  };

  const renderCurrentParameters = () => {
    if (parameterEntries.length === 0) {
      return <Typography variant="body2">No parameter entries available.</Typography>;
    }
  
    const latestParameters = getLatestParameters(parameterEntries);
    const lastUpdatedTimestamp = Math.max(
      ...Object.values(latestParameters)
        .map((param) => param?.timestamp || 0)
    );
  
    return (
      <Box sx={{ marginTop: 2 }}>
        {latestParameters.temperature && (
          <Typography variant="body2">
            Temperature: {latestParameters.temperature.value.toFixed(1)}°F
          </Typography>
        )}
        {latestParameters.ph && (
          <Typography variant="body2">
            pH: {latestParameters.ph.value.toFixed(1)}
          </Typography>
        )}
        {latestParameters.hardness && (
          <Typography variant="body2">
            Hardness: {latestParameters.hardness.value.toFixed(1)} dGH
          </Typography>
        )}
        {/* Add checks for additional parameters as needed */}
        <Typography variant="caption" sx={{ display: 'block', marginTop: 1 }}>
          Last Updated: {new Date(lastUpdatedTimestamp).toLocaleString()}
        </Typography>
      </Box>
    );
  };

  const renderParameterGraph = () => {
    const latestEntry = parameterEntries.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
    if (!latestEntry) {
      return <Typography variant="body2">No parameter entries available for graph.</Typography>;
    }
  
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
  
    const availableParameters = ['temperature', 'ph', 'hardness'].filter((param) =>
      parameterEntries.some((entry) => entry[param as keyof WaterParameterEntry] !== undefined)
    );
  
    const data = {
      labels: filteredEntries.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: selectedParameter === 'ph' ? 'pH' : selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1),
          data: filteredEntries.map((entry) =>
            selectedParameter === 'temperature'
              ? entry[selectedParameter]?.toFixed(1)
              : entry[selectedParameter]
          ),
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
            onClick={(e) => e.stopPropagation()}
          >
            {availableParameters.map((param) => (
              <MenuItem key={param} value={param}>
                {param === 'ph' ? 'pH' : param.charAt(0).toUpperCase() + param.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select
            value={timeFrame}
            label="Time Frame"
            onChange={(e) => setTimeFrame(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
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
    if (aquarium.species.length === 0 && aquarium.plants.length === 0) {
      return <Typography variant="body2">No aquarium inhabitants</Typography>;
    }
  
    const latestEntry = parameterEntries.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
  
    if (!latestEntry) {
      return <Typography variant="body2">No parameter entries available for health check.</Typography>;
    }
  
    const issues: {
      parameter: string;
      message: string;
      severity: string;
      species: string;
      idealRange: string;
    }[] = [];
  
    // Calculate aggregated parameters
    const aggregatedParameters = calculateAggregatedParameters();
  
    // Collect ideal ranges for species and plants
    const speciesParameters: { [name: string]: { [parameter: string]: string } } = {};
  
    // Comparison logic
    aquarium.species.forEach((fish) => {
      if (fish.waterParameters) {
        const { minTemp, maxTemp, minPh, maxPh } = parseWaterParameters(fish.waterParameters);
  
        speciesParameters[fish.name] = {
          Temperature: `${minTemp.toFixed(1)}°F - ${maxTemp.toFixed(1)}°F`,
          pH: `${minPh.toFixed(1)} - ${maxPh.toFixed(1)}`,
        };
  
        if (latestEntry.temperature !== undefined && (latestEntry.temperature < minTemp || latestEntry.temperature > maxTemp)) {
          issues.push({
            parameter: 'Temperature',
            message: `Temperature out of range for ${fish.name}.`,
            severity: 'critical',
            species: fish.name,
            idealRange: speciesParameters[fish.name]['Temperature'],
          });
        }
        if (latestEntry.ph !== undefined && (latestEntry.ph < minPh || latestEntry.ph > maxPh)) {
          issues.push({
            parameter: 'pH',
            message: `pH out of range for ${fish.name}.`,
            severity: 'warning',
            species: fish.name,
            idealRange: speciesParameters[fish.name]['pH'],
          });
        }
      }
    });
  
    aquarium.plants.forEach((plant) => {
      if (plant.waterParameters) {
        const { minTemp, maxTemp, minPh, maxPh } = parseWaterParameters(plant.waterParameters);
  
        speciesParameters[plant.name] = {
          Temperature: `${minTemp.toFixed(1)}°F - ${maxTemp.toFixed(1)}°F`,
          pH: `${minPh.toFixed(1)} - ${maxPh.toFixed(1)}`,
        };
  
        if (latestEntry.temperature !== undefined && (latestEntry.temperature < minTemp || latestEntry.temperature > maxTemp)) {
          issues.push({
            parameter: 'Temperature',
            message: `Temperature out of range for ${plant.name}.`,
            severity: 'critical',
            species: plant.name,
            idealRange: speciesParameters[plant.name]['Temperature'],
          });
        }
        if (latestEntry.ph !== undefined && (latestEntry.ph < minPh || latestEntry.ph > maxPh)) {
          issues.push({
            parameter: 'pH',
            message: `pH out of range for ${plant.name}.`,
            severity: 'warning',
            species: plant.name,
            idealRange: speciesParameters[plant.name]['pH'],
          });
        }
      }
    });
  
    const groupedIssues = issues.reduce((groups, issue) => {
      const { parameter } = issue;
      if (!groups[parameter]) {
        groups[parameter] = [];
      }
      groups[parameter].push(issue);
      return groups;
    }, {} as { [key: string]: typeof issues });
  
    const filteredGroupedIssues = Object.entries(groupedIssues)
      .filter(([parameter]) => parameter.toLowerCase().includes(filter.toLowerCase()))
      .reduce((obj, [parameter, issues]) => {
        obj[parameter] = issues;
        return obj;
      }, {} as { [key: string]: typeof issues });
  
    const latestEntryDate = latestEntry
      ? new Date(latestEntry.timestamp).toLocaleString()
      : 'No entries yet';
  
    return (
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">
          Health Check (Latest Entry: {latestEntryDate})
        </Typography>
        {issues.length === 0 ? (
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            All parameters are within ideal ranges for your species and plants.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="error">
              Total Issues: {issues.length}
            </Typography>
            <TextField
              label="Filter Issues"
              variant="outlined"
              size="small"
              onChange={(e) => setFilter(e.target.value)}
              sx={{ marginY: 2 }}
              onClick={(e) => e.stopPropagation()}
            />
            {Object.entries(filteredGroupedIssues).map(([parameter, issues]) => (
              <Accordion key={parameter}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography variant="body2">
                    {parameter} ({issues.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Display aggregated ideal range for the parameter */}
                  <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Aquarium Ideal Range:{' '}
                    {aggregatedParameters.find((p) => p.name === parameter)?.min} -{' '}
                    {aggregatedParameters.find((p) => p.name === parameter)?.max}{' '}
                    {aggregatedParameters.find((p) => p.name === parameter)?.unit}
                  </Typography>
                  {/* Display latest logged parameter */}
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    Latest Logged {parameter}: {latestEntry[parameter.toLowerCase() as keyof WaterParameterEntry] ?? 'N/A'}
                  </Typography>
                  {/* Display issues with species-specific ideal ranges */}
                  {issues.map((issue, idx) => (
                    <Box key={idx} sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: issue.severity === 'critical' ? 'error.main' : 'warning.main',
                        }}
                      >
                        - {issue.message}
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: 2 }}>
                        {issue.species} Ideal Range: {issue.idealRange}
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>
    );
  };

  const renderAggregatedRanges = () => {
    if (aquarium.species.length === 0 && aquarium.plants.length === 0) {
      return <Typography variant="body2">No aquarium inhabitants</Typography>;
    }    

    const aggregatedParameters = calculateAggregatedParameters();

    return (
      <Box>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Aggregated Acceptable Parameter Ranges
        </Typography>
        {aggregatedParameters.map((param, index) => (
          <Typography key={index} variant="body2">
            {param.name}: {param.min} - {param.max} {param.unit}
          </Typography>
        ))}
      </Box>
    );
  };

  const calculateAggregatedParameters = () => {
    const parameters: {
      [key: string]: { min: number; max: number; unit: string };
    } = {};

    const speciesList = [...aquarium.species, ...aquarium.plants];

    speciesList.forEach((item) => {
      if (item.waterParameters) {
        const params = parseWaterParameters(item.waterParameters);
        if (!parameters['Temperature']) {
          parameters['Temperature'] = {
            min: params.minTemp,
            max: params.maxTemp,
            unit: '°F',
          };
        } else {
          parameters['Temperature'].min = Math.max(parameters['Temperature'].min, params.minTemp);
          parameters['Temperature'].max = Math.min(parameters['Temperature'].max, params.maxTemp);
        }

        if (!parameters['pH']) {
          parameters['pH'] = {
            min: params.minPh,
            max: params.maxPh,
            unit: '',
          };
        } else {
          parameters['pH'].min = Math.max(parameters['pH'].min, params.minPh);
          parameters['pH'].max = Math.min(parameters['pH'].max, params.maxPh);
        }
        // Add more parameters as needed
      }
    });

    return Object.keys(parameters).map((key) => ({
      name: key,
      min:
        key === 'Temperature'
          ? (parameters[key].min).toFixed(1)
          : parameters[key].min.toFixed(1),
      max:
        key === 'Temperature'
          ? (parameters[key].max).toFixed(1)
          : parameters[key].max.toFixed(1),
      unit: parameters[key].unit,
    }));
  };

  const parseWaterParameters = (params: string) => {
    // Example parser, assumes format like "pH 6.0-7.0, Temperature 22-26°C"
    const result = { minTemp: 0, maxTemp: 100, minPh: 0, maxPh: 14 };
    const tempMatch = params.match(/Temperature\s*(\d+\.?\d*)-(\d+\.?\d*)[°]?[CF]/i);
    const phMatch = params.match(/pH\s*(\d+\.?\d*)-(\d+\.?\d*)/i);
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
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode(DisplayMode.AGGREGATED_RANGES);
              handleMenuClose();
            }}
          >
            Aggregated Ranges
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