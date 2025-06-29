import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // optional
import UploadPage from './pages/UploadPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NavigationBar from './components/NavigationBar';
import { CustomThemeProvider } from './theme/ThemeContext';

const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <CustomThemeProvider>
      <Router>
        <NavigationBar />
        <Routes>
          {/* Public route */}
          <Route path="/" element={<HomePage />} />

          {/* Auth-only restricted routes */}
          <Route
            path="/login"
            element={
              token
                ? <Navigate to="/" />
                : <LoginPage onLogin={() => setToken(localStorage.getItem('token'))} />
            }
          />

          <Route
            path="/register"
            element={
              token
                ? <Navigate to="/" />
                : <RegisterPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              token
                ? <DashboardPage />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/profile"
            element={
              token
                ? <ProfilePage />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/upload"
            element={
              token
                ? <UploadPage />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/analytics"
            element={
              token
                ? <AnalyticsPage />
                : <Navigate to="/login" />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
};

export default App;
