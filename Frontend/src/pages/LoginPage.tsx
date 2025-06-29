import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';

// Enhanced LoginPage with modern, responsive, business-oriented Material-UI v5 design, Framer Motion, and best practices
// - Consistent color scheme, spacing, and typography
// - Responsive layout, Paper, and interactive elements
// - Tooltips, icons, and smooth transitions
// - Uses theme and dark mode support

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      onLogin();
      setSnackbarOpen(true);
      setTimeout(() => navigate('/'), 800);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 12, md: 14 }, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper
        component={motion.div}
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 5,
          p: { xs: 3, sm: 5 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          mb: 5,
          textAlign: 'center',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.22)',
          },
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ letterSpacing: 1, mb: 2, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box mt={2}>
          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        {errorMsg && (
          <Box mt={2}>
            <Typography color="error">{errorMsg}</Typography>
          </Box>
        )}
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register">Register</Link>
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate('/')}>Home</Button>
          <Button variant="outlined" onClick={() => navigate('/register')}>Register</Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>Dashboard</Button>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Login successful! Redirecting..."
        />
      </Paper>
    </Container>
  );
};

export default LoginPage;
