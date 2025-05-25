import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Typography,
  Avatar,
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

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        p: 2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}20`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 40,
          height: 40,
          mb: 2,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Button>
  );
};

const QuickActions: React.FC = () => {
  const theme = useTheme();

  const quickActions = [
    {
      title: 'Add Health Record',
      description: 'Log symptoms, vitals, or medical notes',
      icon: <Add />,
      color: theme.palette.primary.main,
      onClick: () => console.log('Add health record'),
    },
    {
      title: 'Add Family Member',
      description: 'Include someone in your health circle',
      icon: <PersonAdd />,
      color: theme.palette.secondary.main,
      onClick: () => console.log('Add family member'),
    },
    {
      title: 'Log Medication',
      description: 'Track prescriptions and dosages',
      icon: <MedicalServices />,
      color: theme.palette.info.main,
      onClick: () => console.log('Log medication'),
    },
    {
      title: 'Schedule Appointment',
      description: 'Book medical appointments',
      icon: <EventAvailable />,
      color: theme.palette.warning.main,
      onClick: () => console.log('Schedule appointment'),
    },
    {
      title: 'Upload Document',
      description: 'Add medical reports and images',
      icon: <FileUpload />,
      color: theme.palette.success.main,
      onClick: () => console.log('Upload document'),
    },
    {
      title: 'View Reports',
      description: 'Analyze health trends and insights',
      icon: <Assessment />,
      color: theme.palette.error.main,
      onClick: () => console.log('View reports'),
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Quick Actions"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <QuickActionButton {...action} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
