import React, { ReactNode } from 'react';
import {
  Container,
  Box,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<Props> = ({ children, title }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/;'; // Remove token cookie if set
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
        <Paper
          component={motion.div}
          elevation={6}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.22)',
            },
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardLayout;
