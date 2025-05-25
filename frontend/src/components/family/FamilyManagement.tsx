import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Emergency as EmergencyIcon,
  LocalHospital as HealthIcon,
  Medication as MedicationIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import type { FamilyMember, FamilyMemberCreate } from '../../types/family';

const FamilyManagement: React.FC = () => {
  const theme = useTheme();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FamilyMemberCreate>({
    fullName: '',
    relationType: '',
    dateOfBirth: '',
    phoneNumber: '',
    emergencyContact: false,
    notes: '',
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockFamilyMembers: FamilyMember[] = [
      {
        id: 1,
        userId: 1,
        fullName: 'Jane Doe',
        relationType: 'Spouse',
        dateOfBirth: '1987-03-20',
        phoneNumber: '+1 (555) 987-6543',
        emergencyContact: true,
        notes: 'Primary emergency contact',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        healthRecords: [{ id: 1 } as any, { id: 2 } as any],
        medications: [{ id: 1 } as any],
        appointments: [{ id: 1 } as any, { id: 2 } as any],
      },
      {
        id: 2,
        userId: 1,
        fullName: 'Emma Doe',
        relationType: 'Daughter',
        dateOfBirth: '2015-08-10',
        phoneNumber: '',
        emergencyContact: false,
        notes: 'Regular pediatric checkups',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        healthRecords: [{ id: 3 } as any],
        medications: [],
        appointments: [{ id: 3 } as any],
      },
      {
        id: 3,
        userId: 1,
        fullName: 'Robert Doe Sr.',
        relationType: 'Father',
        dateOfBirth: '1955-11-15',
        phoneNumber: '+1 (555) 555-1234',
        emergencyContact: false,
        notes: 'Chronic conditions monitoring',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        healthRecords: [{ id: 4 } as any, { id: 5 } as any, { id: 6 } as any],
        medications: [{ id: 2 } as any, { id: 3 } as any],
        appointments: [],
      },
    ];
    setFamilyMembers(mockFamilyMembers);
  }, []);

  const relationTypes = [
    'Spouse', 'Partner', 'Child', 'Parent', 'Sibling', 
    'Grandparent', 'Grandchild', 'Other'
  ];

  const handleOpenDialog = (member?: FamilyMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        fullName: member.fullName,
        relationType: member.relationType,
        dateOfBirth: member.dateOfBirth || '',
        phoneNumber: member.phoneNumber || '',
        emergencyContact: member.emergencyContact,
        notes: member.notes || '',
      });
      setIsEditing(true);
    } else {
      setSelectedMember(null);
      setFormData({
        fullName: '',
        relationType: '',
        dateOfBirth: '',
        phoneNumber: '',
        emergencyContact: false,
        notes: '',
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Implement API calls
    console.log(isEditing ? 'Updating member:' : 'Creating member:', formData);
    
    // Mock API response
    setTimeout(() => {
      if (isEditing && selectedMember) {
        setFamilyMembers(prev => prev.map(member => 
          member.id === selectedMember.id 
            ? { ...member, ...formData, updatedAt: new Date().toISOString() }
            : member
        ));
      } else {
        const newMember: FamilyMember = {
          id: Date.now(),
          userId: 1,
          ...formData,
          emergencyContact: formData.emergencyContact || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          healthRecords: [],
          medications: [],
          appointments: [],
        };
        setFamilyMembers(prev => [...prev, newMember]);
      }
      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  const getAvatarColor = (relationType: string) => {
    const colors = {
      'Spouse': theme.palette.secondary.main,
      'Partner': theme.palette.secondary.main,
      'Child': theme.palette.primary.main,
      'Parent': theme.palette.warning.main,
      'Sibling': theme.palette.info.main,
      'Grandparent': theme.palette.success.main,
      'Grandchild': theme.palette.primary.light,
      'Other': theme.palette.grey[500],
    };
    return colors[relationType as keyof typeof colors] || theme.palette.grey[500];
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Family Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Family Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {familyMembers.map((member) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!member.emergencyContact}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(member.relationType),
                        width: 56,
                        height: 56,
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                  </Badge>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(member)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {member.fullName}
                </Typography>
                
                <Chip
                  label={member.relationType}
                  size="small"
                  sx={{
                    bgcolor: `${getAvatarColor(member.relationType)}20`,
                    color: getAvatarColor(member.relationType),
                    fontWeight: 600,
                    mb: 2,
                  }}
                />

                {member.emergencyContact && (
                  <Chip
                    icon={<EmergencyIcon />}
                    label="Emergency Contact"
                    size="small"
                    color="error"
                    sx={{ mb: 2, ml: 1 }}
                  />
                )}

                <Box sx={{ mt: 2 }}>
                  {member.dateOfBirth && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <CakeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Age {calculateAge(member.dateOfBirth)}
                      </Typography>
                    </Box>
                  )}
                  
                  {member.phoneNumber && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {member.phoneNumber}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Tooltip title="Health Records">
                      <Box display="flex" alignItems="center">
                        <HealthIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                        <Typography variant="caption" color="primary.main">
                          {member.healthRecords?.length || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Medications">
                      <Box display="flex" alignItems="center">
                        <MedicationIcon sx={{ fontSize: 16, color: 'secondary.main', mr: 0.5 }} />
                        <Typography variant="caption" color="secondary.main">
                          {member.medications?.length || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Appointments">
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="caption" color="warning.main">
                          {member.appointments?.length || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {isEditing ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </Grid>
            
            <Grid size={12}>
              <FormControl fullWidth required>
                <InputLabel>Relationship</InputLabel>
                <Select
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
                  label="Relationship"
                >
                  {relationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid size={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </Grid>
            
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.checked })}
                  />
                }
                label="Emergency Contact"
              />
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this family member..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.fullName || !formData.relationType}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FamilyManagement;
