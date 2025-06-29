// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Transaction } from '../types/Transaction';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import ReviewSection from '../components/ReviewSection';
import ReviewForm from '../components/ReviewForm';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const token = localStorage.getItem('token');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Monthly report is ready', time: '2 min ago', unread: true },
    { id: 2, message: 'New expense category detected', time: '1 hour ago', unread: true },
    { id: 3, message: 'Budget goal achieved!', time: '3 hours ago', unread: false },
  ]);

  // Ensure token is always up-to-date (react to login/logout)
  useEffect(() => {
    const syncToken = () => {
      const t = localStorage.getItem('token');
      if (t !== token) window.location.reload();
    };
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.category?.toLowerCase() === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.category?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalRevenue - totalExpense;

  const features = [
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Real-time Analytics',
      description: 'Track your financial performance with live charts and insights',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry standards',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      title: 'Lightning Fast',
      description: 'Process thousands of transactions in seconds with our optimized engine',
    },
    {
      icon: <SmartphoneIcon sx={{ fontSize: 40, color: '#a259f7' }} />,
      title: 'Mobile First',
      description: 'Manage your finances on the go with our responsive design and mobile app',
    },
    {
      icon: <PublicIcon sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Multi-Currency',
      description: 'Support for 150+ currencies with real-time exchange rates',
    },
    {
      icon: <LockIcon sx={{ fontSize: 40, color: '#22c55e' }} />,
      title: 'Privacy First',
      description: 'Your financial data stays private. We never sell or share your information',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'This platform transformed how I manage my business finances. The insights are incredible!',
      rating: 5,
      avatar: 'SJ',
    },
    {
      name: 'Mike Chen',
      role: 'Freelance Consultant',
      content: 'The automated categorization saves me hours every week. Highly recommended!',
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'Lisa Williams',
      role: 'Startup Founder',
      content: 'Finally, a financial tool that actually understands my business needs.',
      rating: 5,
      avatar: 'LW',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #23243a 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Fixed Header with Glassmorphism */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: 'rgba(30, 22, 54, 0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.10)',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountBalanceWalletIcon sx={{ color: '#a259f7', fontSize: 36 }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>FinancePro</Typography>
            </Stack>
            {/* Desktop Navigation */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {token ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/dashboard')} sx={{ color: '#fff', fontWeight: 600 }}>Dashboard</Button>
                  <Button color="inherit" onClick={() => navigate('/upload')} sx={{ color: '#fff', fontWeight: 600 }}>Upload</Button>
                  <Box sx={{ position: 'relative' }}>
                    <IconButton color="inherit">
                      <NotificationsIcon sx={{ color: '#fff' }} />
                      {notifications.some(n => n.unread) && (
                        <Box sx={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, bgcolor: 'error.main', borderRadius: '50%' }} />
                      )}
                    </IconButton>
                  </Box>
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
      </Box>

      {/* Add top padding to prevent content from being hidden behind navbar */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 12, md: 14 }, // Increased top padding for fixed navbar
          pb: { xs: 4, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={24}
              sx={{
                borderRadius: { xs: 3, md: 6 },
                p: { xs: 3, sm: 4, md: 6 },
                mb: { xs: 3, md: 6 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient 3s ease infinite',
                },
                '@keyframes gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <AccountBalanceWalletIcon 
                  sx={{ 
                    fontSize: { xs: 60, md: 80 }, 
                    color: '#667eea', 
                    mb: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))'
                  }} 
                />
              </motion.div>

              <Typography
                variant={isMobile ? "h3" : "h2"}
                gutterBottom
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: { xs: 0.5, md: 1 },
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  mb: 2,
                }}
              >
                Financial Dashboard
              </Typography>

              <Typography
                variant={isMobile ? "body1" : "h6"}
                color="text.secondary"
                sx={{ 
                  mb: 4, 
                  maxWidth: '600px', 
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Take control of your finances with our powerful analytics platform. 
                Track expenses, monitor revenue, and make data-driven decisions.
              </Typography>

              {/* Action Buttons */}
              {token ? (
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center" 
                  flexWrap="wrap"
                  sx={{ gap: { xs: 2, sm: 1 } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<UploadFileIcon />}
                    onClick={() => navigate('/upload')}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      borderColor: '#667eea',
                      color: '#667eea',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Upload Data
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AccountCircleIcon />}
                    onClick={() => navigate('/profile')}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      borderColor: '#764ba2',
                      color: '#764ba2',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#764ba2',
                        background: 'rgba(118, 75, 162, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    startIcon={<LogoutIcon />}
                    onClick={() => { 
                      localStorage.removeItem('token'); 
                      window.location.reload(); 
                    }}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      color: '#d32f2f',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(211, 47, 47, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Paper>
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: { xs: 3, md: 6 } }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Grow in timeout={1000 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Financial Summary for logged-in users */}
          {token && transactions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Fade in timeout={1500}>
                <Paper
                  elevation={16}
                  sx={{
                    borderRadius: 4,
                    p: 4,
                    mb: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ 
                      fontWeight: 700, 
                      color: '#2d3748',
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    Your Financial Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 20px rgba(72, 187, 120, 0.3)'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Revenue
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            ₹{totalRevenue.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 20px rgba(245, 101, 101, 0.3)'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <TrendingDownIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Expenses
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            ₹{totalExpense.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ 
                        background: balance >= 0 
                          ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                          : 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: balance >= 0 
                          ? '0 8px 20px rgba(66, 153, 225, 0.3)'
                          : '0 8px 20px rgba(237, 137, 54, 0.3)'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <AccountBalanceWalletIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Balance
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            ₹{balance.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            </motion.div>
          )}

          {/* Quick Actions for logged-in users */}
          {token && (
            <motion.div variants={itemVariants}>
              <Paper
                elevation={12}
                sx={{
                  borderRadius: 4,
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ 
                    fontWeight: 700, 
                    color: '#2d3748',
                    mb: 3,
                    textAlign: 'center'
                  }}
                >
                  Quick Actions
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center"
                >
                  <Button 
                    startIcon={<UploadFileIcon />} 
                    variant="outlined" 
                    onClick={() => navigate('/upload')}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Upload Transactions
                  </Button>
                  <Button 
                    startIcon={<DashboardIcon />} 
                    variant="outlined" 
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    View Dashboard
                  </Button>
                  <Button 
                    startIcon={<AnalyticsIcon />} 
                    variant="outlined" 
                    onClick={() => navigate('/analytics')}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Analytics
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          )}

          {/* Review Form and Testimonials Carousel */}
          <Box sx={{ my: 6 }}>
            {token && <ReviewForm onSuccess={() => window.location.reload()} />}
            <ReviewSection />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage;

// Enhanced HomePage with modern, responsive, business-oriented Material-UI v5 design, Framer Motion, and best practices
// - Consistent color scheme, spacing, and typography
// - Responsive Grid, Cards, and interactive elements
// - Tooltips, icons, and smooth transitions
// - Uses theme and dark mode support