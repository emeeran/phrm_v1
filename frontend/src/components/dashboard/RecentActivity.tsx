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
  Chip,
  Button,
  Badge,
  Paper,
  IconButton,
  Tooltip,
  Fade,
  alpha,
  Collapse,
} from '@mui/material';
import {
  Medication,
  Assignment,
  EventNote,
  Person,
  AccessTime,
  NotificationImportant,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ActivityItem {
  id: string;
  type: 'medication' | 'appointment' | 'record' | 'family' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  person?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'completed' | 'pending' | 'overdue';
  progress?: number;
  isUrgent?: boolean;
}

const RecentActivity: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Take Lisinopril 10mg with food',
      timestamp: '2 hours ago',
      person: 'John Doe',
      priority: 'high',
      status: 'overdue',
      isUrgent: true,
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Annual checkup with Dr. Smith',
      timestamp: 'Tomorrow 2PM',
      person: 'Jane Doe',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '3',
      type: 'record',
      title: 'Lab Results Available',
      description: 'Blood panel & cholesterol screening',
      timestamp: '3 days ago',
      person: 'John Doe',
      priority: 'low',
      status: 'completed',
    },
    {
      id: '4',
      type: 'family',
      title: 'New Family Member',
      description: 'Sarah Doe profile created',
      timestamp: '1 week ago',
      priority: 'low',
      status: 'completed',
    },
    {
      id: '5',
      type: 'record',
      title: 'Prescription Refill',
      description: 'Metformin prescription renewed',
      timestamp: '2 weeks ago',
      person: 'John Doe',
      priority: 'medium',
      status: 'completed',
    },
  ];

  const visibleActivities = expanded ? recentActivities : recentActivities.slice(0, 3);

  const getActivityIcon = (type: ActivityItem['type'], status?: string) => {
    const iconProps = { 
      sx: { 
        fontSize: 16,
        transition: 'all 0.2s ease',
      } 
    };
    
    switch (type) {
      case 'medication':
        return status === 'completed' ? <CheckCircle {...iconProps} /> : <Medication {...iconProps} />;
      case 'appointment':
        return <EventNote {...iconProps} />;
      case 'record':
        return <Assignment {...iconProps} />;
      case 'family':
        return <Person {...iconProps} />;
      case 'reminder':
        return <NotificationImportant {...iconProps} />;
      default:
        return <Assignment {...iconProps} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type'], status?: string, isUrgent?: boolean) => {
    if (isUrgent) return theme.palette.error.main;
    if (status === 'completed') return theme.palette.success.main;
    if (status === 'overdue') return theme.palette.error.main;
    
    switch (type) {
      case 'medication':
        return theme.palette.secondary.main;
      case 'appointment':
        return theme.palette.warning.main;
      case 'record':
        return theme.palette.info.main;
      case 'family':
        return theme.palette.primary.main;
      case 'reminder':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusChip = (status?: string, isUrgent?: boolean) => {
    if (isUrgent) {
      return (
        <Chip
          label="Urgent"
          size="small"
          color="error"
          variant="filled"
          sx={{ fontSize: '0.65rem', height: 16 }}
        />
      );
    }
    
    if (status === 'completed') {
      return (
        <Chip
          label="Done"
          size="small"
          color="success"
          variant="outlined"
          sx={{ fontSize: '0.65rem', height: 16 }}
        />
      );
    }
    
    if (status === 'overdue') {
      return (
        <Chip
          label="Overdue"
          size="small"
          color="error"
          variant="filled"
          sx={{ fontSize: '0.65rem', height: 16 }}
        />
      );
    }
    
    return null;
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header with refresh and expand controls */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Recent Activity
            </Typography>
            <Badge 
              badgeContent={recentActivities.filter(a => a.isUrgent || a.status === 'overdue').length} 
              color="error" 
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                },
              }}
            >
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Badge>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Refresh activities">
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
                  fontSize: 16,
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
              </IconButton>
            </Tooltip>
            <Button 
              size="small" 
              variant="text"
              color="primary"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ 
                fontSize: '0.75rem',
                minWidth: 'auto',
                px: 1,
              }}
            >
              {expanded ? 'Less' : 'More'}
            </Button>
          </Box>
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
        >
      <Box px={2} py={1} borderBottom="1px solid" borderColor="divider">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Recent Activity
            </Typography>
            <Badge badgeContent={2} color="error" variant="dot">
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Badge>
          </Box>
          <Button 
            size="small" 
            color="primary"
            variant="text"
            aria-label="View all recent activities"
          >
            View All
          </Button>
        </Box>
      </Box>
      
        <Table size="small" aria-label="Recent health activities">
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Activity
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Description
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              When
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Person
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleActivities.map((activity, index) => (
            <Fade in timeout={300 + index * 100} key={activity.id}>
              <TableRow 
                onMouseEnter={() => setHoveredRow(activity.id)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: alpha(getActivityColor(activity.type, activity.status, activity.isUrgent), 0.04),
                    transform: 'translateX(2px)',
                  },
                  transform: hoveredRow === activity.id ? 'translateX(2px)' : 'translateX(0px)',
                }}
              >
              <TableCell>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Tooltip title={`${activity.type} activity`}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: alpha(getActivityColor(activity.type, activity.status, activity.isUrgent), 0.1),
                        color: getActivityColor(activity.type, activity.status, activity.isUrgent),
                        transition: 'all 0.2s ease',
                        ...(hoveredRow === activity.id && {
                          bgcolor: getActivityColor(activity.type, activity.status, activity.isUrgent),
                          color: 'white',
                          transform: 'scale(1.05)',
                        }),
                      }}
                    >
                      {getActivityIcon(activity.type, activity.status)}
                    </Box>
                  </Tooltip>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {activity.title}
                    </Typography>
                    {activity.isUrgent && (
                      <Typography variant="caption" color="error.main" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>
                        ⚠ Urgent
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                  }}
                >
                  {activity.description}
                </Typography>
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
                      bgcolor: activity.status === 'completed' ? 'success.main' : 
                               activity.status === 'overdue' ? 'error.main' : 'warning.main',
                    }}
                  />
                  {getStatusChip(activity.status, activity.isUrgent)}
                </Box>
              </TableCell>
              
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {activity.timestamp}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                {activity.person && (
                  <Chip
                    label={activity.person}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 20,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      color: 'primary.main',
                    }}
                  />
                )}
              </TableCell>
              
              <TableCell align="center">
                <Tooltip title="More options">
                  <IconButton 
                    size="small" 
                    aria-label={`More options for ${activity.title}`}
                    sx={{
                      opacity: hoveredRow === activity.id ? 1 : 0,
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
              </TableCell>
            </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Box>
    </Fade>
  );
};

export default RecentActivity;
