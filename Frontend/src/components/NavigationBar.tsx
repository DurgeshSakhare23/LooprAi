import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Container, Stack, Fade, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ProfileIcon from './ProfileIcon';
import { useThemeMode } from '../theme/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Monthly report is ready', time: '2 min ago', unread: true },
    { id: 2, message: 'New expense category detected', time: '1 hour ago', unread: true },
    { id: 3, message: 'Budget goal achieved!', time: '3 hours ago', unread: false },
  ]);
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(30, 22, 54, 0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.10)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountBalanceWalletIcon sx={{ color: '#a259f7', fontSize: 36 }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>FinancePro</Typography>
            </Stack>
            <Button color="inherit" onClick={toggleMode} sx={{ minWidth: 40 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </Button>
            {/* Desktop Navigation */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {token ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/dashboard')} sx={{ color: '#fff', fontWeight: 600 }}>Dashboard</Button>
                  <Button color="inherit" onClick={() => navigate('/analytics')} sx={{ color: '#fff', fontWeight: 600 }}>Analytics</Button>
                  <Button color="inherit" onClick={() => navigate('/upload')} sx={{ color: '#fff', fontWeight: 600 }}>Upload</Button>
                  <Box sx={{ position: 'relative' }}>
                    <IconButton color="inherit">
                      <NotificationsIcon sx={{ color: '#fff' }} />
                      {notifications.some(n => n.unread) && (
                        <Box sx={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, bgcolor: 'error.main', borderRadius: '50%' }} />
                      )}
                    </IconButton>
                  </Box>
                  <ProfileIcon onClick={() => navigate('/profile')} />
                  <Button color="inherit" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} startIcon={<LogoutIcon />} sx={{ color: '#f87171', fontWeight: 600 }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate('/features')} sx={{ color: '#fff', fontWeight: 600 }}>Features</Button>
                  <Button color="inherit" onClick={() => navigate('/pricing')} sx={{ color: '#fff', fontWeight: 600 }}>Pricing</Button>
                  <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: '#fff', fontWeight: 600 }}>Login</Button>
                  <Button variant="contained" onClick={() => navigate('/register')} sx={{ background: 'linear-gradient(90deg, #a259f7 0%, #f857a6 100%)', color: '#fff', fontWeight: 700, borderRadius: 3, px: 3, boxShadow: '0 2px 8px #a259f733' }}>Get Started</Button>
                </>
              )}
            </Stack>
            {/* Mobile Hamburger */}
            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: '#fff' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Container>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Fade in={mobileMenuOpen}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, background: 'rgba(30,22,54,0.95)', px: 2, py: 2 }}>
              <Stack spacing={2}>
                {token ? (
                  <>
                    <Button color="inherit" onClick={() => navigate('/dashboard')} sx={{ color: '#fff', fontWeight: 600 }}>Dashboard</Button>
                    <Button color="inherit" onClick={() => navigate('/analytics')} sx={{ color: '#fff', fontWeight: 600 }}>Analytics</Button>
                    <Button color="inherit" onClick={() => navigate('/upload')} sx={{ color: '#fff', fontWeight: 600 }}>Upload</Button>
                    <Button color="inherit" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} startIcon={<LogoutIcon />} sx={{ color: '#f87171', fontWeight: 600 }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button color="inherit" onClick={() => navigate('/features')} sx={{ color: '#fff', fontWeight: 600 }}>Features</Button>
                    <Button color="inherit" onClick={() => navigate('/pricing')} sx={{ color: '#fff', fontWeight: 600 }}>Pricing</Button>
                    <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: '#fff', fontWeight: 600 }}>Login</Button>
                    <Button variant="contained" onClick={() => navigate('/register')} sx={{ background: 'linear-gradient(90deg, #a259f7 0%, #f857a6 100%)', color: '#fff', fontWeight: 700, borderRadius: 3, px: 3, boxShadow: '0 2px 8px #a259f733' }}>Get Started</Button>
                  </>
                )}
              </Stack>
            </Box>
          </Fade>
        )}
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
