import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Medication as MedicationIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import type { Medication, MedicationCreate, FamilyMember } from '../../types/family';

const MedicationManagement: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | 'all'>('all');
  const [formData, setFormData] = useState<MedicationCreate>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    prescribedBy: '',
    purpose: '',
    sideEffects: '',
    isActive: true,
    notes: '',
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockFamilyMembers: FamilyMember[] = [
      { id: 1, fullName: 'John Doe', relationType: 'Self' } as FamilyMember,
      { id: 2, fullName: 'Jane Doe', relationType: 'Spouse' } as FamilyMember,
      { id: 3, fullName: 'Emma Doe', relationType: 'Daughter' } as FamilyMember,
    ];
    setFamilyMembers(mockFamilyMembers);

    const mockMedications: Medication[] = [
      {
        id: 1,
        familyMemberId: 1,
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '',
        prescribedBy: 'Dr. Smith',
        purpose: 'Type 2 Diabetes management',
        sideEffects: 'Nausea, diarrhea',
        isActive: true,
        notes: 'Take with meals',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        familyMemberId: 1,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '',
        prescribedBy: 'Dr. Johnson',
        purpose: 'High blood pressure',
        sideEffects: 'Dry cough, dizziness',
        isActive: true,
        notes: 'Take in the morning',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 3,
        familyMemberId: 2,
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Daily',
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-05-01T00:00:00Z',
        prescribedBy: 'Dr. Wilson',
        purpose: 'Vitamin D deficiency',
        sideEffects: '',
        isActive: false,
        notes: 'Completed course',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-05-01T00:00:00Z',
      },
      {
        id: 4,
        familyMemberId: 3,
        name: 'Children\'s Tylenol',
        dosage: '160mg',
        frequency: 'As needed',
        startDate: '2024-03-01T00:00:00Z',
        endDate: '',
        prescribedBy: 'Dr. Brown',
        purpose: 'Fever and pain relief',
        sideEffects: '',
        isActive: true,
        notes: 'For fever above 100.4°F',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
      },
    ];
    setMedications(mockMedications);
  }, []);

  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
    'As needed', 'Weekly', 'Monthly', 'Other'
  ];

  const handleOpenDialog = (medication?: Medication, memberId?: number) => {
    if (medication) {
      setSelectedMedication(medication);
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.split('T')[0],
        endDate: medication.endDate ? medication.endDate.split('T')[0] : '',
        prescribedBy: medication.prescribedBy || '',
        purpose: medication.purpose || '',
        sideEffects: medication.sideEffects || '',
        isActive: medication.isActive,
        notes: medication.notes || '',
      });
      setSelectedMemberId(medication.familyMemberId);
      setIsEditing(true);
    } else {
      setSelectedMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        prescribedBy: '',
        purpose: '',
        sideEffects: '',
        isActive: true,
        notes: '',
      });
      setSelectedMemberId(memberId || (familyMembers.length > 0 ? familyMembers[0].id : 1));
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMedication(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Implement API calls
    console.log(isEditing ? 'Updating medication:' : 'Creating medication:', formData);
    
    // Mock API response
    setTimeout(() => {
      if (isEditing && selectedMedication) {
        setMedications(prev => prev.map(med => 
          med.id === selectedMedication.id 
            ? { 
                ...med, 
                ...formData, 
                familyMemberId: selectedMemberId as number,
                startDate: formData.startDate + 'T00:00:00Z',
                endDate: formData.endDate ? formData.endDate + 'T00:00:00Z' : '',
                updatedAt: new Date().toISOString() 
              }
            : med
        ));
      } else {
        const newMedication: Medication = {
          id: Date.now(),
          familyMemberId: selectedMemberId as number,
          ...formData,
          isActive: formData.isActive !== undefined ? formData.isActive : true,
          startDate: formData.startDate + 'T00:00:00Z',
          endDate: formData.endDate ? formData.endDate + 'T00:00:00Z' : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMedications(prev => [...prev, newMedication]);
      }
      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  const toggleMedicationStatus = (medicationId: number) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, isActive: !med.isActive, updatedAt: new Date().toISOString() }
        : med
    ));
  };

  const handleDelete = async (medicationId: number) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== medicationId));
    }
  };

  const getMemberName = (memberId: number) => {
    const member = familyMembers.find(m => m.id === memberId);
    return member ? member.fullName : 'Unknown';
  };

  const filteredMedications = selectedMemberId === 'all' 
    ? medications 
    : medications.filter(med => med.familyMemberId === selectedMemberId);

  const activeMedications = filteredMedications.filter(med => med.isActive);
  const inactiveMedications = filteredMedications.filter(med => !med.isActive);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Medications
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
          Add Medication
        </Button>
      </Box>

      {/* Family Member Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">Filter by Family Member:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value as number | 'all')}
              >
                <MenuItem value="all">All Family Members</MenuItem>
                {familyMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.fullName} ({member.relationType})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {activeMedications.length}
                  </Typography>
                  <Typography variant="body2">Active Medications</Typography>
                </Box>
                <MedicationIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {activeMedications.filter(med => med.endDate && 
                      new Date(med.endDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </Typography>
                  <Typography variant="body2">Ending Soon</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {activeMedications.filter(med => med.frequency.includes('daily')).length}
                  </Typography>
                  <Typography variant="body2">Daily Medications</Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {inactiveMedications.length}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Medications */}
      {activeMedications.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicationIcon color="primary" />
              Active Medications ({activeMedications.length})
            </Typography>
            <Grid container spacing={2}>
              {activeMedications.map((medication) => (
                <Grid size={{ xs: 12, md: 6 }} key={medication.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {medication.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getMemberName(medication.familyMemberId)}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <IconButton size="small" onClick={() => handleOpenDialog(medication)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(medication.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`${medication.dosage} - ${medication.frequency}`}
                          size="small"
                          color="primary"
                          sx={{ mb: 1, mr: 1 }}
                        />
                        {medication.endDate && (
                          <Chip
                            label={`Until ${new Date(medication.endDate).toLocaleDateString()}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {medication.purpose && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Purpose:</strong> {medication.purpose}
                        </Typography>
                      )}

                      {medication.prescribedBy && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Prescribed by:</strong> {medication.prescribedBy}
                        </Typography>
                      )}

                      {medication.notes && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Notes:</strong> {medication.notes}
                        </Typography>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          Started: {new Date(medication.startDate).toLocaleDateString()}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => toggleMedicationStatus(medication.id)}
                          color="warning"
                        >
                          Mark as Completed
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Inactive/Completed Medications */}
      {inactiveMedications.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="action" />
              Completed Medications ({inactiveMedications.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {inactiveMedications.map((medication) => (
                <Grid size={{ xs: 12, md: 6 }} key={medication.id}>
                  <Card variant="outlined" sx={{ opacity: 0.7 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {medication.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getMemberName(medication.familyMemberId)}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <IconButton size="small" onClick={() => handleOpenDialog(medication)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(medication.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Chip
                        label={`${medication.dosage} - ${medication.frequency}`}
                        size="small"
                        color="default"
                        sx={{ mb: 1 }}
                      />

                      <Typography variant="caption" color="text.secondary" display="block">
                        Completed: {new Date(medication.updatedAt).toLocaleDateString()}
                      </Typography>

                      <Button
                        size="small"
                        onClick={() => toggleMedicationStatus(medication.id)}
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        Reactivate
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {filteredMedications.length === 0 && (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <MedicationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No medications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add medications to start tracking prescriptions and dosages.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {isEditing ? 'Edit Medication' : 'Add Medication'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Family Member</InputLabel>
                <Select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value as number)}
                  label="Family Member"
                >
                  {familyMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.fullName} ({member.relationType})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Medication Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg, 10ml, 1 tablet"
                required
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  label="Frequency"
                >
                  {frequencyOptions.map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="End Date (Optional)"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Prescribed By"
                value={formData.prescribedBy}
                onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                placeholder="Doctor's name"
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="What is this medication for?"
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Side Effects"
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                placeholder="Known side effects or warnings"
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes, instructions, or reminders..."
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active Medication"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.name || !formData.dosage || !formData.frequency}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationManagement;
