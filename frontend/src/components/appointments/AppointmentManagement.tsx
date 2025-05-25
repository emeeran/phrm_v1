import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Stack,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
  Home as HomeIcon,
  LocalHospital as HospitalIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Today as TodayIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import type {
  Appointment,
  AppointmentFormData,
  AppointmentFilters,
  AppointmentType,
  AppointmentStatus,
  Priority,
  HealthProvider,
} from '../../types/appointments';
import type { FamilyMember } from '../../types/family';

// Mock data
const mockFamilyMembers: FamilyMember[] = [
  {
    id: 1,
    userId: 1,
    fullName: 'John Doe',
    relationType: 'Self',
    dateOfBirth: '1990-05-15',
    phoneNumber: '+1-555-0101',
    emergencyContact: true,
    notes: 'Primary account holder',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    fullName: 'Jane Doe',
    relationType: 'Spouse',
    dateOfBirth: '1992-08-22',
    phoneNumber: '+1-555-0102',
    emergencyContact: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockProviders: HealthProvider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    phone: '+1-555-0201',
    email: 'dr.johnson@healthcenter.com',
    address: '456 Medical Plaza, Suite 200',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    phone: '+1-555-0202',
    email: 'dr.chen@heartcenter.com',
    address: '789 Heart Center Dr, Suite 150',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dental',
    phone: '+1-555-0203',
    email: 'dr.rodriguez@dentalcare.com',
    address: '321 Dental Way, Suite 100',
    rating: 4.7,
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Annual Physical Checkup',
    type: 'General Checkup',
    description: 'Routine annual physical examination',
    familyMemberId: 1,
    familyMemberName: 'John Doe',
    provider: mockProviders[0],
    dateTime: '2024-02-15T10:00:00Z',
    duration: 60,
    location: {
      type: 'In-Person',
      address: '456 Medical Plaza, Suite 200',
      room: 'Room 205',
    },
    status: 'Scheduled',
    priority: 'Medium',
    reminderSet: true,
    reminderTime: 60,
    notes: 'Bring previous lab results',
    followUpRequired: false,
    cost: 250,
    insuranceCovered: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Cardiology Consultation',
    type: 'Specialist Visit',
    description: 'Follow-up for high blood pressure',
    familyMemberId: 1,
    familyMemberName: 'John Doe',
    provider: mockProviders[1],
    dateTime: '2024-02-20T14:30:00Z',
    duration: 45,
    location: {
      type: 'Telemedicine',
      meetingLink: 'https://zoom.us/j/123456789',
      platform: 'Zoom',
    },
    status: 'Confirmed',
    priority: 'High',
    reminderSet: true,
    reminderTime: 120,
    notes: 'Discuss recent medication changes',
    followUpRequired: true,
    cost: 350,
    insuranceCovered: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Dental Cleaning',
    type: 'Dental',
    description: 'Regular dental cleaning and checkup',
    familyMemberId: 2,
    familyMemberName: 'Jane Doe',
    provider: mockProviders[2],
    dateTime: '2024-01-30T09:00:00Z',
    duration: 90,
    location: {
      type: 'In-Person',
      address: '321 Dental Way, Suite 100',
      room: 'Chair 3',
    },
    status: 'Completed',
    priority: 'Low',
    reminderSet: false,
    notes: 'No issues found, next cleaning in 6 months',
    followUpRequired: false,
    cost: 150,
    insuranceCovered: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-30T12:00:00Z',
  },
];

const appointmentTypes: AppointmentType[] = [
  'General Checkup', 'Specialist Visit', 'Emergency', 'Dental', 'Eye Exam',
  'Physical Therapy', 'Mental Health', 'Vaccination', 'Laboratory', 'Imaging',
  'Surgery', 'Follow-up', 'Telemedicine', 'Other'
];

const appointmentStatuses: AppointmentStatus[] = [
  'Scheduled', 'Confirmed', 'Cancelled', 'Completed', 'No-Show', 'Rescheduled'
];

const priorities: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [open, setOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    type: 'General Checkup',
    description: '',
    familyMemberId: '',
    provider: mockProviders[0],
    dateTime: '',
    duration: 60,
    location: {
      type: 'In-Person',
      address: '',
    },
    priority: 'Medium',
    reminderSet: true,
    reminderTime: 60,
    notes: '',
    followUpRequired: false,
    cost: 0,
    insuranceCovered: true,
  });

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          appointment.title.toLowerCase().includes(searchLower) ||
          appointment.familyMemberName.toLowerCase().includes(searchLower) ||
          appointment.provider.name.toLowerCase().includes(searchLower) ||
          appointment.type.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && appointment.status !== filters.status) return false;

      // Type filter
      if (filters.type && appointment.type !== filters.type) return false;

      // Family member filter
      if (filters.familyMemberId && appointment.familyMemberId !== filters.familyMemberId) return false;

      // Priority filter
      if (filters.priority && appointment.priority !== filters.priority) return false;

      return true;
    });
  }, [appointments, filters, searchTerm]);

  // Calculate summary statistics
  const appointmentSummary = useMemo(() => {
    const now = new Date();
    return {
      total: appointments.length,
      upcoming: appointments.filter(apt => new Date(apt.dateTime) > now && apt.status !== 'Cancelled').length,
      today: appointments.filter(apt => isToday(new Date(apt.dateTime))).length,
      thisWeek: appointments.filter(apt => isThisWeek(new Date(apt.dateTime))).length,
      overdue: appointments.filter(apt => isPast(new Date(apt.dateTime)) && apt.status === 'Scheduled').length,
    };
  }, [appointments]);

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        title: appointment.title,
        type: appointment.type,
        description: appointment.description || '',
        familyMemberId: appointment.familyMemberId,
        provider: appointment.provider,
        dateTime: appointment.dateTime.slice(0, -1), // Remove Z for datetime-local input
        duration: appointment.duration,
        location: appointment.location,
        priority: appointment.priority,
        reminderSet: appointment.reminderSet,
        reminderTime: appointment.reminderTime || 60,
        notes: appointment.notes || '',
        followUpRequired: appointment.followUpRequired || false,
        cost: appointment.cost || 0,
        insuranceCovered: appointment.insuranceCovered || true,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        title: '',
        type: 'General Checkup',
        description: '',
        familyMemberId: '',
        provider: mockProviders[0],
        dateTime: '',
        duration: 60,
        location: {
          type: 'In-Person',
          address: '',
        },
        priority: 'Medium',
        reminderSet: true,
        reminderTime: 60,
        notes: '',
        followUpRequired: false,
        cost: 0,
        insuranceCovered: true,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingAppointment(null);
  };

  const handleSave = () => {
    const appointmentData: Appointment = {
      id: editingAppointment?.id || Date.now().toString(),
      ...formData,
      familyMemberId: typeof formData.familyMemberId === 'string' ? parseInt(formData.familyMemberId) : formData.familyMemberId,
      familyMemberName: mockFamilyMembers.find(m => m.id === (typeof formData.familyMemberId === 'string' ? parseInt(formData.familyMemberId) : formData.familyMemberId))?.fullName || '',
      dateTime: formData.dateTime + 'Z', // Add Z back for ISO format
      status: editingAppointment?.status || 'Scheduled',
      createdAt: editingAppointment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingAppointment) {
      setAppointments(prev => prev.map(apt => apt.id === appointmentData.id ? appointmentData : apt));
    } else {
      setAppointments(prev => [...prev, appointmentData]);
    }

    handleCloseDialog();
  };

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus, updatedAt: new Date().toISOString() }
          : apt
      )
    );
  };

  const handleDelete = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled': return 'default';
      case 'Confirmed': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'No-Show': return 'warning';
      case 'Rescheduled': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Low': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'High': return '#f44336';
      case 'Urgent': return '#e91e63';
      default: return '#9e9e9e';
    }
  };

  const formatAppointmentTime = (dateTime: string) => {
    const date = parseISO(dateTime);
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const getLocationIcon = (type: 'In-Person' | 'Telemedicine' | 'Home Visit') => {
    switch (type) {
      case 'In-Person': return <HospitalIcon />;
      case 'Telemedicine': return <VideoCallIcon />;
      case 'Home Visit': return <HomeIcon />;
      default: return <LocationIcon />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Appointment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Schedule Appointment
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'primary.50' }}>
            <CardContent>
              <TodayIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {appointmentSummary.today}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.50' }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="success.main">
                {appointmentSummary.upcoming}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'info.50' }}>
            <CardContent>
              <CalendarIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="info.main">
                {appointmentSummary.thisWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.50' }}>
            <CardContent>
              <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {appointmentSummary.overdue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'grey.50' }}>
            <CardContent>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'grey.600', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="grey.600">
                {appointmentSummary.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Family Member</InputLabel>
              <Select
                value={filters.familyMemberId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, familyMemberId: e.target.value || undefined }))}
              >
                <MenuItem value="">All Members</MenuItem>
                {mockFamilyMembers.map(member => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as AppointmentStatus || undefined }))}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {appointmentStatuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as AppointmentType || undefined }))}
              >
                <MenuItem value="">All Types</MenuItem>
                {appointmentTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilters({})}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments List */}
      <Grid container spacing={3}>
        {filteredAppointments.map((appointment) => (
          <Grid size={12} key={appointment.id}>
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {appointment.title}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getPriorityColor(appointment.priority),
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {appointment.type} • {appointment.familyMemberName}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton onClick={() => handleOpenDialog(appointment)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(appointment.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatAppointmentTime(appointment.dateTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({appointment.duration} mins)
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {getLocationIcon(appointment.location.type)}
                      <Typography variant="body2">
                        {appointment.location.type}
                        {appointment.location.address && ` • ${appointment.location.address}`}
                        {appointment.location.room && ` • ${appointment.location.room}`}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {appointment.provider.name} ({appointment.provider.specialty})
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {appointment.description && (
                      <Typography variant="body2" mb={1}>
                        <strong>Description:</strong> {appointment.description}
                      </Typography>
                    )}
                    {appointment.notes && (
                      <Typography variant="body2" mb={1}>
                        <strong>Notes:</strong> {appointment.notes}
                      </Typography>
                    )}
                    {appointment.reminderSet && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <NotificationIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="primary">
                          Reminder set for {appointment.reminderTime} minutes before
                        </Typography>
                      </Box>
                    )}
                    {appointment.cost && (
                      <Typography variant="body2" mb={1}>
                        <strong>Cost:</strong> ${appointment.cost}
                        {appointment.insuranceCovered && ' (Insurance Covered)'}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {appointment.status === 'Scheduled' && (
                  <Box mt={2} pt={2} borderTop="1px solid" borderColor="grey.200">
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusChange(appointment.id, 'Confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleStatusChange(appointment.id, 'Rescheduled')}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleStatusChange(appointment.id, 'Cancelled')}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAppointments.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchTerm || Object.keys(filters).length > 0 
              ? 'Try adjusting your search or filters'
              : 'Schedule your first appointment to get started'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Schedule Appointment
          </Button>
        </Paper>
      )}

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Appointment Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AppointmentType }))}
                >
                  {appointmentTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Family Member</InputLabel>
                <Select
                  value={formData.familyMemberId}
                  onChange={(e) => setFormData(prev => ({ ...prev, familyMemberId: e.target.value as number | '' }))}
                >
                  {mockFamilyMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.fullName} ({member.relationType})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Healthcare Provider</InputLabel>
                <Select
                  value={formData.provider.id}
                  onChange={(e) => {
                    const provider = mockProviders.find(p => p.id === e.target.value);
                    if (provider) {
                      setFormData(prev => ({ ...prev, provider }));
                    }
                  }}
                >
                  {mockProviders.map(provider => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name} - {provider.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Date & Time"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                inputProps={{ min: 15, max: 480, step: 15 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Location Type</InputLabel>
                <Select
                  value={formData.location.type}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, type: e.target.value as 'In-Person' | 'Telemedicine' | 'Home Visit' }
                  }))}
                >
                  <MenuItem value="In-Person">In-Person</MenuItem>
                  <MenuItem value="Telemedicine">Telemedicine</MenuItem>
                  <MenuItem value="Home Visit">Home Visit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                >
                  {priorities.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {formData.location.type === 'In-Person' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.location.address || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Room/Suite"
                    value={formData.location.room || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, room: e.target.value }
                    }))}
                  />
                </Grid>
              </>
            )}
            {formData.location.type === 'Telemedicine' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Meeting Link"
                    value={formData.location.meetingLink || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, meetingLink: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Platform"
                    value={formData.location.platform || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, platform: e.target.value }
                    }))}
                    placeholder="Zoom, Teams, etc."
                  />
                </Grid>
              </>
            )}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.reminderSet}
                    onChange={(e) => setFormData(prev => ({ ...prev, reminderSet: e.target.checked }))}
                  />
                }
                label="Set Reminder"
              />
              {formData.reminderSet && (
                <TextField
                  sx={{ ml: 2, width: 200 }}
                  label="Minutes Before"
                  type="number"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: parseInt(e.target.value) || 0 }))}
                  inputProps={{ min: 5, max: 1440, step: 5 }}
                />
              )}
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                multiline
                rows={3}
                placeholder="Any additional notes or instructions..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Estimated Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.insuranceCovered}
                    onChange={(e) => setFormData(prev => ({ ...prev, insuranceCovered: e.target.checked }))}
                  />
                }
                label="Insurance Covered"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                  />
                }
                label="Follow-up Required"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.title || !formData.familyMemberId || !formData.dateTime}
          >
            {editingAppointment ? 'Update' : 'Schedule'} Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagement;
