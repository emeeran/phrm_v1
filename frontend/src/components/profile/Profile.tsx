import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { 
  updateProfileStart, 
  updateProfileSuccess, 
  updateProfileFailure,
  clearError 
} from '../../store/userSlice';
import type { UserProfile, UpdateProfileRequest } from '../../types/user';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (profile && isEditing) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        phone: profile.phone,
        address: profile.address,
        emergencyContact: profile.emergencyContact,
        medicalInfo: profile.medicalInfo,
        preferences: profile.preferences,
      });
    }
  }, [profile, isEditing]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    dispatch(clearError());
  };

  const handleSave = async () => {
    dispatch(updateProfileStart());
    
    // Simulate API call with timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create updated profile
      const updatedProfile: UserProfile = {
        ...profile!,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch(updateProfileSuccess(updatedProfile));
      setIsEditing(false);
    } catch (err) {
      dispatch(updateProfileFailure('Failed to update profile. Please try again.'));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => {
      const parentData = prev[parent as keyof UpdateProfileRequest];
      const existingData = parentData && typeof parentData === 'object' ? parentData : {};
      
      return {
        ...prev,
        [parent]: {
          ...existingData,
          [field]: value
        }
      };
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // In a real app, you'd upload this to a server
        console.log('Avatar selected:', base64.substring(0, 50) + '...');
      };
      reader.readAsDataURL(file);
    }
  };

  const addToArray = (arrayType: 'allergies' | 'chronicConditions' | 'medications', value: string) => {
    if (!value.trim()) return;
    
    const currentArray = formData.medicalInfo?.[arrayType] || [];
    handleNestedInputChange('medicalInfo', arrayType, [...currentArray, value.trim()]);
    
    if (arrayType === 'allergies') setNewAllergy('');
    if (arrayType === 'chronicConditions') setNewCondition('');
    if (arrayType === 'medications') setNewMedication('');
  };

  const removeFromArray = (arrayType: 'allergies' | 'chronicConditions' | 'medications', index: number) => {
    const currentArray = formData.medicalInfo?.[arrayType] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleNestedInputChange('medicalInfo', arrayType, newArray);
  };

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          User Profile
        </Typography>
        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                Basic Information
              </Typography>
              
              {/* Avatar */}
              <Box display="flex" justifyContent="center" mb={3}>
                <Box position="relative">
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120,
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                    src={profile.avatar}
                  >
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={isEditing ? (formData.firstName || '') : profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={isEditing ? (formData.lastName || '') : profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                    variant="standard"
                    InputProps={{ readOnly: true }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={isEditing ? (formData.phone || '') : (profile.phone || '')}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={isEditing ? (formData.dateOfBirth || '') : (profile.dateOfBirth || '')}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth disabled={!isEditing} variant={isEditing ? 'outlined' : 'standard'}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={isEditing ? (formData.gender || '') : (profile.gender || '')}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Address Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={isEditing ? (formData.address?.street || '') : (profile.address?.street || '')}
                    onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={isEditing ? (formData.address?.city || '') : (profile.address?.city || '')}
                    onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="State"
                    value={isEditing ? (formData.address?.state || '') : (profile.address?.state || '')}
                    onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={isEditing ? (formData.address?.zipCode || '') : (profile.address?.zipCode || '')}
                    onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={isEditing ? (formData.address?.country || '') : (profile.address?.country || '')}
                    onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emergency Contact
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Contact Name"
                    value={isEditing ? (formData.emergencyContact?.name || '') : (profile.emergencyContact?.name || '')}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={isEditing ? (formData.emergencyContact?.relationship || '') : (profile.emergencyContact?.relationship || '')}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={isEditing ? (formData.emergencyContact?.phone || '') : (profile.emergencyContact?.phone || '')}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medical Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Blood Type"
                    value={isEditing ? (formData.medicalInfo?.bloodType || '') : (profile.medicalInfo?.bloodType || '')}
                    onChange={(e) => handleNestedInputChange('medicalInfo', 'bloodType', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{ readOnly: !isEditing }}
                  />
                </Grid>
                
                {/* Allergies */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Allergies
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                    {(isEditing ? (formData.medicalInfo?.allergies || []) : (profile.medicalInfo?.allergies || [])).map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy}
                        onDelete={isEditing ? () => removeFromArray('allergies', index) : undefined}
                        size="small"
                        color="secondary"
                      />
                    ))}
                  </Box>
                  {isEditing && (
                    <Box display="flex" gap={1}>
                      <TextField
                        size="small"
                        placeholder="Add allergy"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('allergies', newAllergy)}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => addToArray('allergies', newAllergy)}
                        disabled={!newAllergy.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Chronic Conditions */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Chronic Conditions
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                    {(isEditing ? (formData.medicalInfo?.chronicConditions || []) : (profile.medicalInfo?.chronicConditions || [])).map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        onDelete={isEditing ? () => removeFromArray('chronicConditions', index) : undefined}
                        size="small"
                        color="warning"
                      />
                    ))}
                  </Box>
                  {isEditing && (
                    <Box display="flex" gap={1}>
                      <TextField
                        size="small"
                        placeholder="Add condition"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('chronicConditions', newCondition)}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => addToArray('chronicConditions', newCondition)}
                        disabled={!newCondition.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Current Medications */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Medications
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                    {(isEditing ? (formData.medicalInfo?.medications || []) : (profile.medicalInfo?.medications || [])).map((medication, index) => (
                      <Chip
                        key={index}
                        label={medication}
                        onDelete={isEditing ? () => removeFromArray('medications', index) : undefined}
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Box>
                  {isEditing && (
                    <Box display="flex" gap={1}>
                      <TextField
                        size="small"
                        placeholder="Add medication"
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('medications', newMedication)}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => addToArray('medications', newMedication)}
                        disabled={!newMedication.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences & Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEditing ? (formData.preferences?.notifications?.email ?? true) : (profile.preferences?.notifications?.email ?? true)}
                        onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                          ...formData.preferences?.notifications,
                          email: e.target.checked
                        })}
                        disabled={!isEditing}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEditing ? (formData.preferences?.notifications?.sms ?? false) : (profile.preferences?.notifications?.sms ?? false)}
                        onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                          ...formData.preferences?.notifications,
                          sms: e.target.checked
                        })}
                        disabled={!isEditing}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEditing ? (formData.preferences?.notifications?.push ?? true) : (profile.preferences?.notifications?.push ?? true)}
                        onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                          ...formData.preferences?.notifications,
                          push: e.target.checked
                        })}
                        disabled={!isEditing}
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Account Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Account Created:</strong> {new Date(profile.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
