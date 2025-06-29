import React from 'react';
import NavigationBar from './NavigationBar';
import Container from '@mui/material/Container';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}>
    <NavigationBar />
    <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
      {children}
    </Container>
  </div>
);

export default Layout;
