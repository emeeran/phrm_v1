import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  Grow,
  alpha,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  MedicalServices,
  EventAvailable,
  FileUpload,
  Assessment,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  isNew?: boolean;
  isPriority?: boolean;
}

const QuickActions: React.FC = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  const quickActions: QuickAction[] = [
    {
      title: 'Add Health Record',
      description: 'Upload lab results, prescriptions',
      icon: <Add sx={{ fontSize: 16 }} />,
      color: theme.palette.primary.main,
      onClick: () => console.log('Add record'),
      isPriority: true,
    },
    {
      title: 'Add Family Member',
      description: 'Invite family to share records',
      icon: <PersonAdd sx={{ fontSize: 16 }} />,
      color: theme.palette.success.main,
      onClick: () => console.log('Add family member'),
    },
    {
      title: 'Log Medication',
      description: 'Track daily medications',
      icon: <MedicalServices sx={{ fontSize: 16 }} />,
      color: theme.palette.warning.main,
      onClick: () => console.log('Log medication'),
      isPriority: true,
    },
    {
      title: 'Schedule Appointment',
      description: 'Book with healthcare providers',
      icon: <EventAvailable sx={{ fontSize: 16 }} />,
      color: theme.palette.info.main,
      onClick: () => console.log('Schedule appointment'),
    },
    {
      title: 'Upload Documents',
      description: 'Import medical files',
      icon: <FileUpload sx={{ fontSize: 16 }} />,
      color: theme.palette.secondary.main,
      onClick: () => console.log('Upload documents'),
      isNew: true,
    },
    {
      title: 'View Reports',
      description: 'Generate health summaries',
      icon: <Assessment sx={{ fontSize: 16 }} />,
      color: theme.palette.error.main,
      onClick: () => console.log('View reports'),
    },
  ];

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Fade in timeout={400}>
        <Box>
          <Typography 
            variant="subtitle2" 
            fontWeight={700} 
            color="text.primary" 
            sx={{ mb: 1.5 }}
          >
            Quick Actions
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1.5, 
              overflowX: 'auto',
              pb: 1,
              px: 0.5,
              '&::-webkit-scrollbar': { 
                height: 3,
                borderRadius: 1.5,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 1.5,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: alpha(theme.palette.divider, 0.1),
                borderRadius: 1.5,
              },
            }}
          >
            {quickActions.map((action, index) => (
              <Grow 
                key={index} 
                in 
                timeout={300 + index * 100}
                style={{ transformOrigin: 'center bottom' }}
              >
                <Box
                  onClick={action.onClick}
                  onMouseEnter={() => setHoveredAction(index)}
                  onMouseLeave={() => setHoveredAction(null)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 90,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(action.color, 0.05),
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: alpha(action.color, 0.1),
                    '&:hover': {
                      bgcolor: alpha(action.color, 0.12),
                      borderColor: alpha(action.color, 0.3),
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: `0 8px 25px ${alpha(action.color, 0.25)}`,
                    },
                  }}
                >
                  <Badge
                    variant="dot"
                    invisible={!action.isPriority && !action.isNew}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: action.isPriority ? 'warning.main' : 'info.main',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: action.color,
                        color: 'white',
                        mb: 1,
                        transition: 'all 0.3s ease',
                        ...(hoveredAction === index && {
                          transform: 'scale(1.1) rotate(5deg)',
                          boxShadow: `0 4px 12px ${alpha(action.color, 0.4)}`,
                        }),
                      }}
                    >
                      {action.icon}
                    </Box>
                  </Badge>
                  <Typography 
                    variant="caption" 
                    fontWeight={600} 
                    textAlign="center"
                    color="text.primary"
                    sx={{ 
                      fontSize: '0.75rem',
                      lineHeight: 1.3,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.2s ease',
                      ...(hoveredAction === index && {
                        color: action.color,
                      }),
                    }}
                  >
                    {action.title.split(' ').slice(0, 2).join(' ')}
                  </Typography>
                </Box>
              </Grow>
            ))}
          </Box>
        </Box>
      </Fade>
    );
  }

  // Desktop vertical layout
  return (
    <Fade in timeout={600}>
      <Box>
        <Typography 
          variant="subtitle2" 
          fontWeight={700} 
          color="text.primary" 
          sx={{ mb: 2, px: 0.5 }}
        >
          Quick Actions
        </Typography>
        
        <List dense disablePadding sx={{ '& .MuiListItem-root': { mb: 0.75 } }}>
          {quickActions.map((action, index) => (
            <Grow 
              key={index} 
              in 
              timeout={400 + index * 150}
              style={{ transformOrigin: 'left center' }}
            >
              <ListItem disablePadding>
                <Tooltip 
                  title={action.description} 
                  placement="right"
                  arrow
                  enterDelay={500}
                >
                  <ListItemButton
                    onClick={action.onClick}
                    onMouseEnter={() => setHoveredAction(index)}
                    onMouseLeave={() => setHoveredAction(null)}
                    aria-label={action.title}
                    sx={{ 
                      py: 1,
                      px: 1.25,
                      borderRadius: 2,
                      minHeight: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 3,
                        height: '100%',
                        bgcolor: action.color,
                        opacity: hoveredAction === index ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        bgcolor: alpha(action.color, 0.08),
                        transform: 'translateX(6px)',
                        '& .action-icon': {
                          bgcolor: action.color,
                          color: 'white',
                          transform: 'scale(1.1)',
                          boxShadow: `0 4px 12px ${alpha(action.color, 0.3)}`,
                        },
                        '& .action-text': {
                          color: action.color,
                          fontWeight: 700,
                        }
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Badge
                        variant="dot"
                        invisible={!action.isPriority && !action.isNew}
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: action.isPriority ? 'warning.main' : 'info.main',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            top: 2,
                            right: 2,
                          },
                        }}
                      >
                        <Box
                          className="action-icon"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: alpha(action.color, 0.12),
                            color: action.color,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {action.icon}
                        </Box>
                      </Badge>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography 
                          className="action-text"
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {action.title}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </Grow>
          ))}
        </List>
      </Box>
    </Fade>
  );
};

export default QuickActions;
