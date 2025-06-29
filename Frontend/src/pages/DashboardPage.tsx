// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Skeleton,
  Chip,
  IconButton,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';

import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import TransactionTable from '../components/Table';
import ExportModal from '../components/ExportModal';
import GoalWidget from '../components/GoalWidget';
import WidgetSelector from '../components/WidgetSelector';
import HeatmapChart from '../components/HeatmapChart';
import api from '../services/api';
import { Transaction } from '../types/Transaction';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [openExport, setOpenExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(['goal', 'chart']);

  const widgetOptions = [
    { key: 'goal', label: 'Savings Goal' },
    { key: 'chart', label: 'Financial Chart' },
    { key: 'heatmap', label: 'Spending Heatmap' },
  ];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      // Ensure _id is present for each transaction (backend should always return _id)
      const txns = res.data as Transaction[];
      setTransactions(txns);
      setFiltered(txns);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalRevenue = filtered
    .filter((t) => t.category?.toLowerCase() === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.category?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalRevenue - totalExpense;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
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

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* Header Skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Skeleton variant="text" width={300} height={60} />
              <Skeleton variant="circular" width={56} height={56} />
            </Box>

            {/* Stats Cards Skeleton */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>

            {/* Chart Skeleton */}
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 3 }} />

            {/* Table Skeleton */}
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
          </Stack>
        </Container>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color, gradient, delay = 0 }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    delay?: number;
  }) => (
    <Grow in timeout={1000 + delay}>
      <Card
        sx={{
          height: '100%',
          borderRadius: 4,
          background: gradient,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 10px 30px ${color}40`,
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 180,
          maxWidth: 350,
          mx: 'auto',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${color}60`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(30px, -30px)',
          },
        }}
      >
        <CardContent sx={{ p: 2, position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            {icon}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9, mb: 0.5, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            {title}
          </Typography>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              wordBreak: 'break-all',
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              mb: 0.5,
              lineHeight: 1.1,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            ₹{typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            {title === 'Total Revenue' && `+${((totalRevenue / (totalRevenue + totalExpense)) * 100).toFixed(1)}%`}
            {title === 'Total Expense' && `${((totalExpense / (totalRevenue + totalExpense)) * 100).toFixed(1)}%`}
            {title === 'Net Balance' && (balance >= 0 ? 'Profit' : 'Loss')}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <DashboardLayout>
      {/* Background Accent */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 80% 10%, #b2fefa 0%, #e0c3fc 100%)',
        opacity: 0.25,
      }} />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 2.5, sm: 5 },
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        zIndex: 1,
        boxShadow: { xs: 'none', md: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' },
        borderRadius: { xs: 0, md: 6 },
        border: { xs: 'none', md: '1px solid #e0e3e7' },
      }}>
        <Container maxWidth={false} sx={{ mt: 4, px: { xs: 0.5, sm: 2, md: 6 }, width: '100vw' }}>
          <Stack spacing={5} alignItems="center">
            {/* Enhanced Header */}
            <Box sx={{ width: '100%', mb: 2, position: 'relative', textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={900} color="primary.main" sx={{ letterSpacing: 2, textShadow: '0 4px 24px rgba(0,0,0,0.10)', mb: 0.5 }}>
                Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 500, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                Your Financial Overview at a Glance
              </Typography>
              {/* Desktop Buttons */}
              <Box sx={{ position: 'absolute', top: 0, right: 0, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <IconButton color="primary" onClick={fetchTransactions} title="Refresh" aria-label="Refresh">
                  <RefreshIcon />
                </IconButton>
                <IconButton color={showFilters ? 'secondary' : 'default'} onClick={() => setShowFilters((v) => !v)} title="Toggle Filters" aria-label="Toggle Filters">
                  <FilterListIcon />
                </IconButton>
                <IconButton color="primary" onClick={() => setOpenExport(true)} title="Export" aria-label="Export">
                  <FileDownloadIcon />
                </IconButton>
              </Box>
              {/* Mobile FAB */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2, gap: 2 }}>
                <IconButton color="primary" onClick={fetchTransactions} title="Refresh" aria-label="Refresh">
                  <RefreshIcon />
                </IconButton>
                <IconButton color={showFilters ? 'secondary' : 'default'} onClick={() => setShowFilters((v) => !v)} title="Toggle Filters" aria-label="Toggle Filters">
                  <FilterListIcon />
                </IconButton>
                <IconButton color="primary" onClick={() => setOpenExport(true)} title="Export" aria-label="Export">
                  <FileDownloadIcon />
                </IconButton>
              </Box>
            </Box>
            {/* Stat Cards with Animation and Icon Backgrounds */}
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} sm={4} md={4} display="flex">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ width: '100%' }}>
                  <StatCard
                    title="Total Revenue"
                    value={totalRevenue}
                    icon={<Box sx={{ bgcolor: theme.palette.success.light, borderRadius: '50%', p: 1, display: 'inline-flex' }}><TrendingUpIcon fontSize="large" sx={{ color: theme.palette.success.dark }} /></Box>}
                    color={theme.palette.success.main}
                    gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    delay={0}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4} md={4} display="flex">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ width: '100%' }}>
                  <StatCard
                    title="Total Expense"
                    value={totalExpense}
                    icon={<Box sx={{ bgcolor: theme.palette.error.light, borderRadius: '50%', p: 1, display: 'inline-flex' }}><TrendingDownIcon fontSize="large" sx={{ color: theme.palette.error.dark }} /></Box>}
                    color={theme.palette.error.main}
                    gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                    delay={200}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={4} md={4} display="flex">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ width: '100%' }}>
                  <StatCard
                    title="Net Balance"
                    value={balance}
                    icon={<Box sx={{ bgcolor: theme.palette.info.light, borderRadius: '50%', p: 1, display: 'inline-flex' }}><AccountBalanceWalletIcon fontSize="large" sx={{ color: theme.palette.info.dark }} /></Box>}
                    color={theme.palette.info.main}
                    gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                    delay={400}
                  />
                </motion.div>
              </Grid>
            </Grid>
            {/* Filters */}
            <Fade in={showFilters} unmountOnExit>
              <Box sx={{ width: '100%' }}>
                <FilterBar transactions={transactions} onFilter={setFiltered} />
              </Box>
            </Fade>
            {/* Widget Selector */}
            <Box sx={{ width: '100%' }}>
              <WidgetSelector widgets={widgetOptions} selected={visibleWidgets} onChange={setVisibleWidgets} />
            </Box>
            {/* Main Content with Animation */}
            <Grid container spacing={3} justifyContent="center">
              {visibleWidgets.includes('goal') && (
                <Grid item xs={12} md={4} display="flex">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ width: '100%' }}>
                    <GoalWidget />
                  </motion.div>
                </Grid>
              )}
              {visibleWidgets.includes('chart') && (
                <Grid item xs={12} md={8} display="flex">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ width: '100%' }}>
                    <Chart transactions={filtered} />
                  </motion.div>
                </Grid>
              )}
              {visibleWidgets.includes('heatmap') && (
                <Grid item xs={12} md={12} display="flex">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ width: '100%' }}>
                    <HeatmapChart transactions={filtered} />
                  </motion.div>
                </Grid>
              )}
            </Grid>
            {/* Table Section Title with Fade-in */}
            <Fade in timeout={800}>
              <Box sx={{ width: '100%', mt: 4, mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="primary" sx={{ letterSpacing: 1, mb: 1 }}>
                  Recent Transactions
                </Typography>
              </Box>
            </Fade>
            {/* Table with Animation and row hover effect */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ width: '100%' }}>
              <Box sx={{
                width: '100%',
                '& .MuiTableRow-root:hover': {
                  backgroundColor: 'rgba(51, 134, 103, 0.07)',
                  transition: 'background 0.2s',
                },
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <TransactionTable transactions={filtered} />
              </Box>
            </motion.div>
            {/* Export Modal */}
            <ExportModal open={openExport} onClose={() => setOpenExport(false)} data={filtered} />
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default DashboardPage;

// Enhanced DashboardPage with modern, responsive, business-oriented Material-UI v5 design, Framer Motion, and best practices
// - Consistent color scheme, spacing, and typography
// - Responsive Grid, Cards, and interactive elements
// - Tooltips, icons, and smooth transitions
// - Uses theme and dark mode support