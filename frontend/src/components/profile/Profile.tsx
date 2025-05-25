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
  Fade,
  Grow,
  Slide,
  alpha,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const { profile, isLoading, error } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
        <Fade in timeout={600}>
          <Box textAlign="center">
            <CircularProgress 
              size={60} 
              sx={{ 
                color: 'primary.main',
                mb: 2,
              }} 
            />
            <Typography variant="h6" color="text.secondary">
              Loading your profile...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Fade in={mounted} timeout={600}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              User Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your personal information and preferences
            </Typography>
          </Box>
          <Grow in={mounted} timeout={800}>
            <Box>
              {!isEditing ? (
                <Tooltip title="Edit your profile information" arrow>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
                        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </Tooltip>
              ) : (
                <Box display="flex" gap={1}>
                  <Tooltip title="Cancel editing" arrow>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={isLoading}
                      sx={{
                        borderRadius: 2,
                        px: 2.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                  <Tooltip title="Save your changes" arrow>
                    <Button
                      variant="contained"
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={isLoading}
                      sx={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                        borderRadius: 2,
                        px: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
                          background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
                        }
                      }}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Grow>
        </Box>
      </Fade>

      {error && (
        <Slide in={!!error} direction="down" timeout={400}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)',
            }}
          >
            {error}
          </Alert>
        </Slide>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in={mounted} timeout={1000}>
            <Card 
              sx={{ 
                height: 'fit-content',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: hoveredCard === 'basic' ? 'primary.main' : alpha(theme.palette.primary.main, 0.1),
                boxShadow: hoveredCard === 'basic' 
                  ? '0 8px 32px rgba(33, 150, 243, 0.2)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredCard === 'basic' ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard('basic')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <PersonIcon />
                  Basic Information
                </Typography>
                
                {/* Avatar */}
                <Box display="flex" justifyContent="center" mb={3}>
                  <Box position="relative">
                    <Zoom in={mounted} timeout={1200}>
                      <Avatar
                        sx={{ 
                          width: 120, 
                          height: 120,
                          background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          boxShadow: avatarHover 
                            ? '0 8px 32px rgba(255, 107, 107, 0.3)' 
                            : '0 4px 20px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          transform: avatarHover ? 'scale(1.05)' : 'scale(1)',
                        }}
                        src={profile.avatar}
                        onMouseEnter={() => setAvatarHover(true)}
                        onMouseLeave={() => setAvatarHover(false)}
                      >
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </Avatar>
                    </Zoom>
                    {isEditing && (
                      <Zoom in={isEditing} timeout={600}>
                        <Tooltip title="Upload new avatar" arrow>
                          <IconButton
                            sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              right: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                bgcolor: 'primary.dark',
                                transform: 'scale(1.1)',
                                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                              }
                            }}
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <UploadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Zoom>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(33, 150, 243, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(33, 150, 243, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiInput-root': {
                          '&:before': {
                            borderBottomColor: alpha(theme.palette.text.disabled, 0.3),
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(33, 150, 243, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(33, 150, 243, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormControl 
                      fullWidth 
                      disabled={!isEditing} 
                      variant={isEditing ? 'outlined' : 'standard'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(33, 150, 243, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                          }
                        }
                      }}
                    >
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
          </Grow>
        </Grid>

        {/* Address Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in={mounted} timeout={1200}>
            <Card 
              sx={{ 
                height: 'fit-content',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: hoveredCard === 'address' ? 'secondary.main' : alpha(theme.palette.secondary.main, 0.1),
                boxShadow: hoveredCard === 'address' 
                  ? '0 8px 32px rgba(156, 39, 176, 0.2)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredCard === 'address' ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard('address')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <HomeIcon />
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(156, 39, 176, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(156, 39, 176, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(156, 39, 176, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(156, 39, 176, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(156, 39, 176, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Emergency Contact */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in={mounted} timeout={1400}>
            <Card
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: hoveredCard === 'emergency' ? 'warning.main' : alpha(theme.palette.warning.main, 0.1),
                boxShadow: hoveredCard === 'emergency' 
                  ? '0 8px 32px rgba(255, 152, 0, 0.2)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredCard === 'emergency' ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard('emergency')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    color: 'warning.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <ContactPhoneIcon />
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(255, 152, 0, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(255, 152, 0, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)',
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(255, 152, 0, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Medical Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in={mounted} timeout={1600}>
            <Card
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: hoveredCard === 'medical' ? 'error.main' : alpha(theme.palette.error.main, 0.1),
                boxShadow: hoveredCard === 'medical' 
                  ? '0 8px 32px rgba(244, 67, 54, 0.2)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredCard === 'medical' ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard('medical')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    color: 'error.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <LocalHospitalIcon />
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 15px rgba(244, 67, 54, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)',
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Allergies */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Allergies
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                      {(isEditing ? (formData.medicalInfo?.allergies || []) : (profile.medicalInfo?.allergies || [])).map((allergy, index) => (
                        <Zoom key={index} in timeout={300 + index * 100}>
                          <Chip
                            label={allergy}
                            onDelete={isEditing ? () => removeFromArray('allergies', index) : undefined}
                            size="small"
                            color="secondary"
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                              }
                            }}
                          />
                        </Zoom>
                      ))}
                    </Box>
                    {isEditing && (
                      <Slide in={isEditing} direction="up" timeout={400}>
                        <Box display="flex" gap={1} alignItems="center">
                          <TextField
                            size="small"
                            placeholder="Add allergy"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addToArray('allergies', newAllergy)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: '0 2px 10px rgba(156, 39, 176, 0.2)',
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                                }
                              }
                            }}
                          />
                          <Tooltip title="Add allergy" arrow>
                            <IconButton 
                              size="small" 
                              onClick={() => addToArray('allergies', newAllergy)}
                              disabled={!newAllergy.trim()}
                              sx={{
                                bgcolor: 'secondary.main',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'secondary.dark',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 15px rgba(156, 39, 176, 0.4)',
                                },
                                '&:disabled': {
                                  bgcolor: alpha(theme.palette.secondary.main, 0.3),
                                  color: alpha(theme.palette.common.white, 0.5),
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Slide>
                    )}
                  </Grid>

                  {/* Chronic Conditions */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Chronic Conditions
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                      {(isEditing ? (formData.medicalInfo?.chronicConditions || []) : (profile.medicalInfo?.chronicConditions || [])).map((condition, index) => (
                        <Zoom key={index} in timeout={300 + index * 100}>
                          <Chip
                            label={condition}
                            onDelete={isEditing ? () => removeFromArray('chronicConditions', index) : undefined}
                            size="small"
                            color="warning"
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                              }
                            }}
                          />
                        </Zoom>
                      ))}
                    </Box>
                    {isEditing && (
                      <Slide in={isEditing} direction="up" timeout={500}>
                        <Box display="flex" gap={1} alignItems="center">
                          <TextField
                            size="small"
                            placeholder="Add condition"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addToArray('chronicConditions', newCondition)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: '0 2px 10px rgba(255, 152, 0, 0.2)',
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                                }
                              }
                            }}
                          />
                          <Tooltip title="Add condition" arrow>
                            <IconButton 
                              size="small" 
                              onClick={() => addToArray('chronicConditions', newCondition)}
                              disabled={!newCondition.trim()}
                              sx={{
                                bgcolor: 'warning.main',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'warning.dark',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                                },
                                '&:disabled': {
                                  bgcolor: alpha(theme.palette.warning.main, 0.3),
                                  color: alpha(theme.palette.common.white, 0.5),
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Slide>
                    )}
                  </Grid>

                  {/* Current Medications */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Current Medications
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={isEditing ? 1 : 0}>
                      {(isEditing ? (formData.medicalInfo?.medications || []) : (profile.medicalInfo?.medications || [])).map((medication, index) => (
                        <Zoom key={index} in timeout={300 + index * 100}>
                          <Chip
                            label={medication}
                            onDelete={isEditing ? () => removeFromArray('medications', index) : undefined}
                            size="small"
                            color="primary"
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                              }
                            }}
                          />
                        </Zoom>
                      ))}
                    </Box>
                    {isEditing && (
                      <Slide in={isEditing} direction="up" timeout={600}>
                        <Box display="flex" gap={1} alignItems="center">
                          <TextField
                            size="small"
                            placeholder="Add medication"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addToArray('medications', newMedication)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: '0 2px 10px rgba(33, 150, 243, 0.2)',
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                }
                              }
                            }}
                          />
                          <Tooltip title="Add medication" arrow>
                            <IconButton 
                              size="small" 
                              onClick={() => addToArray('medications', newMedication)}
                              disabled={!newMedication.trim()}
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                                },
                                '&:disabled': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.3),
                                  color: alpha(theme.palette.common.white, 0.5),
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Slide>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Preferences */}
        <Grid size={{ xs: 12 }}>
          <Grow in={mounted} timeout={1800}>
            <Card
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: hoveredCard === 'preferences' ? 'success.main' : alpha(theme.palette.success.main, 0.1),
                boxShadow: hoveredCard === 'preferences' 
                  ? '0 8px 32px rgba(76, 175, 80, 0.2)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredCard === 'preferences' ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard('preferences')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                  sx={{
                    color: 'success.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <SettingsIcon />
                  Preferences & Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      display="flex" 
                      alignItems="center" 
                      gap={1}
                      sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                    >
                      <NotificationsIcon fontSize="small" />
                      Notification Preferences
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Zoom in={mounted} timeout={2000}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isEditing ? (formData.preferences?.notifications?.email ?? true) : (profile.preferences?.notifications?.email ?? true)}
                              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                                ...formData.preferences?.notifications,
                                email: e.target.checked
                              })}
                              disabled={!isEditing}
                              sx={{
                                '& .MuiSwitch-track': {
                                  backgroundColor: alpha(theme.palette.success.main, 0.3),
                                },
                                '& .MuiSwitch-thumb': {
                                  transition: 'all 0.3s ease',
                                },
                                '&:hover .MuiSwitch-thumb': {
                                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                }
                              }}
                            />
                          }
                          label="Email Notifications"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </Zoom>
                      <Zoom in={mounted} timeout={2100}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isEditing ? (formData.preferences?.notifications?.sms ?? false) : (profile.preferences?.notifications?.sms ?? false)}
                              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                                ...formData.preferences?.notifications,
                                sms: e.target.checked
                              })}
                              disabled={!isEditing}
                              sx={{
                                '& .MuiSwitch-track': {
                                  backgroundColor: alpha(theme.palette.success.main, 0.3),
                                },
                                '& .MuiSwitch-thumb': {
                                  transition: 'all 0.3s ease',
                                },
                                '&:hover .MuiSwitch-thumb': {
                                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                }
                              }}
                            />
                          }
                          label="SMS Notifications"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </Zoom>
                      <Zoom in={mounted} timeout={2200}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isEditing ? (formData.preferences?.notifications?.push ?? true) : (profile.preferences?.notifications?.push ?? true)}
                              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                                ...formData.preferences?.notifications,
                                push: e.target.checked
                              })}
                              disabled={!isEditing}
                              sx={{
                                '& .MuiSwitch-track': {
                                  backgroundColor: alpha(theme.palette.success.main, 0.3),
                                },
                                '& .MuiSwitch-thumb': {
                                  transition: 'all 0.3s ease',
                                },
                                '&:hover .MuiSwitch-thumb': {
                                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                }
                              }}
                            />
                          }
                          label="Push Notifications"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </Zoom>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                    >
                      Account Information
                    </Typography>
                    <Slide in={mounted} direction="left" timeout={2000}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.05) 100%)',
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <strong>Account Created:</strong> 
                          {new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <strong>Last Updated:</strong> 
                          {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Slide>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
