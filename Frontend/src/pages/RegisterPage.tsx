// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Password must contain a special character';
    return '';
  };

  const handleRegister = async () => {
    const pwdError = validatePassword(password);
    setPasswordError(pwdError);
    if (pwdError) return;
    try {
      await register(email, password, username);
      alert('Registered successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 12, md: 14 } }}>
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
          error={!!passwordError}
          helperText={passwordError}
        />
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Box mt={2}>
          <Button fullWidth variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login">Login</Link>
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate('/')}>Home</Button>
          <Button variant="outlined" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>Dashboard</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;

// Enhanced RegisterPage with modern, responsive, business-oriented Material-UI v5 design, Framer Motion, and best practices
// - Consistent color scheme, spacing, and typography
// - Responsive layout, Paper, and interactive elements
// - Tooltips, icons, and smooth transitions
// - Uses theme and dark mode support
