import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Medication,
  LocalHospital,
  Assignment,
  EventNote,
  Person,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ActivityItem {
  id: string;
  type: 'medication' | 'appointment' | 'record' | 'family';
  title: string;
  description: string;
  timestamp: string;
  person?: string;
  priority?: 'high' | 'medium' | 'low';
}

const RecentActivity: React.FC = () => {
  const theme = useTheme();

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Take Lisinopril 10mg',
      timestamp: '2 hours ago',
      person: 'John Doe',
      priority: 'high',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Annual checkup with Dr. Smith',
      timestamp: 'Tomorrow at 2:00 PM',
      person: 'Jane Doe',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'record',
      title: 'Lab Results',
      description: 'Blood work results available',
      timestamp: '3 days ago',
      person: 'John Doe',
      priority: 'low',
    },
    {
      id: '4',
      type: 'family',
      title: 'New Family Member',
      description: 'Added Sarah Doe to family',
      timestamp: '1 week ago',
      priority: 'low',
    },
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'medication':
        return <Medication />;
      case 'appointment':
        return <EventNote />;
      case 'record':
        return <Assignment />;
      case 'family':
        return <Person />;
      default:
        return <LocalHospital />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'medication':
        return theme.palette.secondary.main;
      case 'appointment':
        return theme.palette.warning.main;
      case 'record':
        return theme.palette.info.main;
      case 'family':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title="Recent Activity"
        action={
          <Button size="small" color="primary">
            View All
          </Button>
        }
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <List sx={{ width: '100%' }}>
          {recentActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getActivityColor(activity.type),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {activity.title}
                      </Typography>
                      {activity.priority && (
                        <Chip
                          label={activity.priority}
                          size="small"
                          color={getPriorityColor(activity.priority) as any}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        {activity.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                        {activity.person && (
                          <Typography variant="caption" color="primary">
                            {activity.person}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < recentActivities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
