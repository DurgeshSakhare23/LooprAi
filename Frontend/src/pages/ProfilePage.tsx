import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  Edit as EditIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

interface UserProfile {
  id: string;
  email: string;
  profilePicture?: string;
  financialGoal?: number;
  createdAt?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editGoal, setEditGoal] = useState<number | ''>('');
  const [editProfilePicture, setEditProfilePicture] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setProfile(res.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleEditOpen = () => {
    setEditEmail(profile?.email || '');
    setEditPassword('');
    setEditGoal(profile?.financialGoal ?? '');
    setEditProfilePicture(profile?.profilePicture || '');
    setEditError('');
    setEditSuccess('');
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleProfileUpdate = async () => {
    setEditError('');
    setEditSuccess('');
    try {
      await api.put('/auth/profile', {
        email: editEmail,
        password: editPassword,
        financialGoal: editGoal === '' ? undefined : Number(editGoal),
        profilePicture: editProfilePicture,
      });
      setEditSuccess('Profile updated successfully!');
      setProfile((prev) => prev ? { ...prev, email: editEmail, financialGoal: editGoal === '' ? undefined : Number(editGoal), profilePicture: editProfilePicture } : prev);
      setEditPassword('');
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Update failed');
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  const navigationItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { label: 'Upload', icon: <UploadIcon />, path: '/upload' },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 14 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Loading your profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, pt: { xs: 10, md: 12 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 0,
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                  }}
                  src={profile?.profilePicture}
                >
                  {(!profile?.profilePicture && profile) ? getInitials(profile.email) : <PersonIcon />}
                </Avatar>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Welcome Back!
                </Typography>
                
                <Chip
                  label="Active User"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />

                <Box sx={{ mt: 3 }}>
                  <Tooltip title="Edit Profile">
                    <IconButton
                      onClick={handleEditOpen}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Settings">
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              sx={{
                height: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight="bold">
                    Account Information
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {profile ? (
                  <Box>
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                      <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {profile.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* User ID */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                      <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          User ID
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                          {profile.id}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Join Date */}
                    {profile.createdAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Member Since
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditOpen}
                        sx={{
                          mr: 2,
                          mb: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          py: 1,
                        }}
                      >
                        Edit Profile
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        color="error"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          py: 1,
                        }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to load profile information. Please try refreshing the page.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Section */}
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              {navigationItems.map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={item.icon}
                    onClick={() => window.location.href = item.path}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: 'grey.300',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.50',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Edit Profile
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            variant="outlined"
            helperText="Leave blank to keep current password"
          />
          
          <TextField
            label="Financial Goal"
            type="number"
            fullWidth
            margin="normal"
            value={editGoal}
            onChange={(e) => setEditGoal(e.target.value === '' ? '' : Number(e.target.value))}
            variant="outlined"
            helperText="Set your financial goal (optional)"
          />
          
          <TextField
            label="Profile Picture URL"
            fullWidth
            margin="normal"
            value={editProfilePicture}
            onChange={(e) => setEditProfilePicture(e.target.value)}
            variant="outlined"
            helperText="Enter a URL for your profile picture (optional)"
          />

          {/* Profile Picture Upload & Preview */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditProfilePicture(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
            {editProfilePicture && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Preview:</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Avatar src={editProfilePicture} sx={{ width: 80, height: 80 }} />
                </Box>
              </Box>
            )}
          </Box>
          
          {editError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {editError}
            </Alert>
          )}
          
          {editSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {editSuccess}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleEditClose}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 2, ml: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;