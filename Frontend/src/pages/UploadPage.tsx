import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Fade,
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  InsertDriveFile as FileIcon,
  DataObject as JsonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Transaction } from '../types/Transaction';

const UploadPage: React.FC = () => {
  const [jsonPreview, setJsonPreview] = useState<Transaction[] | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Only allow upload if logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess(false);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      // Validate and map fields for backend compatibility
      let data: Transaction[] = Array.isArray(json) ? json : [json];
      data = data.map((t) => ({
        ...t,
        status: t.status || 'pending',
        user_profile: t.user_profile || '',
      }));
      setJsonPreview(data);
    } catch (err) {
      setError('Invalid JSON file. Please check the file format and try again.');
      setJsonPreview(null);
      setFileName('');
      setFileSize(0);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      await api.post('/transactions', jsonPreview);
      setSuccess(true);
      setError('');
      // Clear the file input and preview after successful upload
      setTimeout(() => {
        setJsonPreview(null);
        setFileName('');
        setFileSize(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Upload failed. Please check your server connection and try again.');
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.type === 'application/json' || file.name.endsWith('.json'));
    
    if (jsonFile && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(jsonFile);
      fileInputRef.current.files = dt.files;
      
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFile = () => {
    setJsonPreview(null);
    setFileName('');
    setFileSize(0);
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const navigationItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 14 }, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
            File Upload Center
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Upload your JSON files quickly and securely
          </Typography>
          <Chip
            label="JSON Files Only"
            icon={<JsonIcon />}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.875rem' }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} lg={8}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              sx={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: 3,
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Drop Zone */}
                <Paper
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  sx={{
                    border: '2px dashed',
                    borderColor: jsonPreview ? 'success.main' : 'grey.300',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: jsonPreview ? 'success.50' : 'grey.50',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {jsonPreview ? (
                      <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    ) : (
                      <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    )}
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {jsonPreview ? 'File Ready for Upload' : 'Drop your JSON file here'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {jsonPreview ? 'Click upload button to proceed' : 'or click to browse files'}
                    </Typography>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    
                    {!jsonPreview && (
                      <Button
                        variant="outlined"
                        startIcon={<FileIcon />}
                        sx={{ mt: 1, textTransform: 'none', borderRadius: 2 }}
                      >
                        Choose File
                      </Button>
                    )}
                  </Box>
                </Paper>

                {/* File Info */}
                {fileName && (
                  <Card sx={{ mt: 3, backgroundColor: 'grey.50' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(fileSize)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box>
                          {jsonPreview && (
                            <IconButton
                              onClick={() => setPreviewOpen(true)}
                              sx={{ mr: 1 }}
                              title="Preview JSON"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={clearFile} color="error" title="Remove file">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Uploading...
                    </Typography>
                    <LinearProgress />
                  </Box>
                )}

                {/* Action Buttons */}
                {jsonPreview && !uploading && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CloudUploadIcon />}
                      onClick={handleUpload}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Upload to Server
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setPreviewOpen(true)}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Preview Data
                    </Button>
                  </Box>
                )}

                {/* Status Messages */}
                {error && (
                  <Fade in={!!error}>
                    <Alert
                      severity="error"
                      icon={<ErrorIcon />}
                      sx={{ mt: 3, borderRadius: 2 }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {success && (
                  <Fade in={success}>
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon />}
                      sx={{ mt: 3, borderRadius: 2 }}
                      onClose={() => setSuccess(false)}
                    >
                      Upload successful! Your data has been processed.
                    </Alert>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upload Guidelines
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <JsonIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="JSON Format Only"
                      secondary="Files must be valid JSON format"
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Size Limit: 10MB"
                      secondary="Maximum file size allowed"
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <VisibilityIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Preview Available"
                      secondary="Review your data before uploading"
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CloudUploadIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Drag & Drop"
                      secondary="Simply drag files to upload area"
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Navigation Card */}
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Navigation
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {navigationItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={item.icon}
                      onClick={() => navigate(item.path)}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        py: 1,
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
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* JSON Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              JSON Data Preview
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${Array.isArray(jsonPreview) ? jsonPreview.length : 1} Records`}
              color="primary"
              size="small"
            />
          </Box>
          
          <Paper
            sx={{
              maxHeight: 400,
              overflow: 'auto',
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
              fontFamily: 'monospace',
            }}
          >
            <pre style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.4 }}>
              {JSON.stringify(jsonPreview, null, 2)}
            </pre>
          </Paper>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setPreviewOpen(false);
              handleUpload();
            }}
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'none', borderRadius: 2, ml: 2 }}
            disabled={uploading}
          >
            Upload Data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UploadPage;