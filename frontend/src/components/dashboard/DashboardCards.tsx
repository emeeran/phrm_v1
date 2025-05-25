import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  Group,
  Medication,
  Event,
  TrendingUp,
  Add,
  MoreVert,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  action?: () => void;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendValue,
  action,
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
    if (trend === 'down') return <TrendingUp sx={{ fontSize: 16, color: 'error.main', transform: 'rotate(180deg)' }} />;
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small" onClick={action}>
            {action ? <Add /> : <MoreVert />}
          </IconButton>
        </Box>
        
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          {value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {title}
        </Typography>
        
        {trend && trendValue && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {getTrendIcon()}
            <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'}>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardCards: React.FC = () => {
  const theme = useTheme();

  const healthMetrics = [
    {
      title: 'Heart Rate',
      value: '72 BPM',
      icon: <Favorite />,
      color: theme.palette.error.main,
      trend: 'stable' as const,
    },
    {
      title: 'Family Members',
      value: 4,
      icon: <Group />,
      color: theme.palette.primary.main,
      trend: 'up' as const,
      trendValue: '+1',
    },
    {
      title: 'Active Medications',
      value: 3,
      icon: <Medication />,
      color: theme.palette.success.main,
      trend: 'stable' as const,
    },
    {
      title: 'Upcoming Appointments',
      value: 2,
      icon: <Event />,
      color: theme.palette.warning.main,
      trend: 'up' as const,
      trendValue: '+1',
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {healthMetrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <HealthMetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              trend={metric.trend}
              trendValue={metric.trendValue}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCards;
