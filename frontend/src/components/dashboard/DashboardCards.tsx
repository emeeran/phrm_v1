import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Tooltip,
  Fade,
  alpha,
} from '@mui/material';
import {
  Favorite,
  Group,
  Medication,
  Event,
  TrendingUp,
  TrendingDown,
  Add,
  Timeline,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface HealthMetric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  action?: () => void;
  subtitle?: string;
  progress?: number;
  isLoading?: boolean;
}

const DashboardCards: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const healthMetrics: HealthMetric[] = [
    {
      title: 'Heart Rate',
      value: '72 BPM',
      subtitle: 'Last reading 2h ago',
      icon: <Favorite sx={{ fontSize: 16 }} />,
      color: theme.palette.error.main,
      trend: 'stable',
      trendValue: 'Normal range',
      action: () => console.log('View heart rate details'),
    },
    {
      title: 'Family Members',
      value: 4,
      subtitle: 'Active profiles',
      icon: <Group sx={{ fontSize: 16 }} />,
      color: theme.palette.primary.main,
      trend: 'up',
      trendValue: '+1 this month',
      action: () => console.log('Manage family'),
    },
    {
      title: 'Medications',
      value: 3,
      subtitle: '2 due today',
      icon: <Medication sx={{ fontSize: 16 }} />,
      color: theme.palette.success.main,
      trend: 'stable',
      trendValue: 'On schedule',
      progress: 85,
      action: () => console.log('Manage medications'),
      isLoading: isLoading,
    },
    {
      title: 'Appointments',
      value: 2,
      subtitle: 'Next: Tomorrow 2PM',
      icon: <Event sx={{ fontSize: 16 }} />,
      color: theme.palette.warning.main,
      trend: 'up',
      trendValue: '+1 scheduled',
      action: () => console.log('View appointments'),
    },
  ];

  const getTrendIcon = (trend?: string) => {
    const iconStyle = { 
      fontSize: 16, 
      transition: 'all 0.2s ease',
    };
    
    if (trend === 'up') return <TrendingUp sx={{ ...iconStyle, color: 'success.main' }} />;
    if (trend === 'down') return <TrendingDown sx={{ ...iconStyle, color: 'error.main' }} />;
    return <Timeline sx={{ ...iconStyle, color: 'text.secondary' }} />;
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header with refresh button */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Health Overview
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': { 
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Refresh sx={{ 
                fontSize: 18,
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }} />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.12),
            boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
            '& .MuiTableCell-root': { 
              py: 1.25,
              borderBottom: '1px solid',
              borderBottomColor: alpha(theme.palette.divider, 0.08),
            },
            '& .MuiTableRow-root:last-child .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >        <Table size="small" aria-label="Health metrics overview">
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Metric
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Value
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Trend
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {healthMetrics.map((metric, index) => (
            <TableRow 
              key={index}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: alpha(metric.color, 0.04),
                  transform: 'translateX(2px)',
                },
                transform: hoveredRow === index ? 'translateX(2px)' : 'translateX(0px)',
              }}
            >
              <TableCell>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Tooltip title={`View ${metric.title} details`}>
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: alpha(metric.color, 0.1),
                        color: metric.color,
                        transition: 'all 0.2s ease',
                        ...(hoveredRow === index && {
                          bgcolor: metric.color,
                          color: 'white',
                          transform: 'scale(1.05)',
                        }),
                      }}
                    >
                      {metric.icon}
                    </Box>
                  </Tooltip>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {metric.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {metric.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell align="center">
                {metric.isLoading ? (
                  <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                    <Skeleton variant="text" width={60} height={24} />
                    <Skeleton variant="rectangular" width={80} height={4} />
                  </Box>
                ) : (
                  <>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      color="text.primary"
                      sx={{ 
                        fontSize: '1.25rem',
                        transition: 'all 0.2s ease',
                        ...(hoveredRow === index && {
                          color: metric.color,
                          transform: 'scale(1.05)',
                        }),
                      }}
                    >
                      {metric.value}
                    </Typography>
                    {metric.progress !== undefined && (
                      <Box mt={0.5} width="100%">
                        <LinearProgress
                          variant="determinate"
                          value={metric.progress}
                          sx={{
                            height: 3,
                            borderRadius: 1.5,
                            bgcolor: alpha(metric.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: metric.color,
                              borderRadius: 1.5,
                              transition: 'all 0.3s ease',
                            },
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            mt: 0.25,
                            display: 'block',
                          }}
                        >
                          {metric.progress}% complete
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </TableCell>
              
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: metric.trend === 'up' ? 'success.main' : 
                               metric.trend === 'down' ? 'error.main' : 'info.main',
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {metric.subtitle}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Tooltip title={metric.trendValue}>
                  <Box display="flex" alignItems="center" gap={0.75}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: metric.trend === 'up' ? alpha(theme.palette.success.main, 0.1) : 
                                 metric.trend === 'down' ? alpha(theme.palette.error.main, 0.1) : 
                                 alpha(theme.palette.info.main, 0.1),
                        transition: 'all 0.2s ease',
                        ...(hoveredRow === index && {
                          transform: 'scale(1.1)',
                        }),
                      }}
                    >
                      {getTrendIcon(metric.trend)}
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {metric.trendValue}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
              
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  {metric.action && (
                    <Tooltip title={`Manage ${metric.title}`}>
                      <IconButton 
                        size="small" 
                        onClick={metric.action}
                        aria-label={`Manage ${metric.title}`}
                        sx={{
                          transition: 'all 0.2s ease',
                          bgcolor: alpha(metric.color, 0.08),
                          color: metric.color,
                          '&:hover': {
                            bgcolor: metric.color,
                            color: 'white',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <Add sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="More options">
                    <IconButton 
                      size="small" 
                      aria-label={`More options for ${metric.title}`}
                      sx={{
                        opacity: hoveredRow === index ? 1 : 0,
                        transition: 'all 0.2s ease',
                        bgcolor: alpha(theme.palette.text.secondary, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.text.secondary, 0.1),
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <MoreVert sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Box>
    </Fade>
  );
};

export default DashboardCards;
