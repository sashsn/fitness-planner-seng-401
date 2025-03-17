import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { checkAuth } from './features/auth/authSlice';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';

// Import Routes
import ProtectedRoute from './routes/ProtectedRoute';

// Import Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/workouts/Workouts';
import GenerateWorkout from './pages/workouts/GenerateWorkout';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const location = useLocation();  // Get current location

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
    console.log("App - Checking authentication status");
  }, [dispatch]);

  useEffect(() => {
    console.log("App - Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [isAuthenticated]);

  // Check if the user is accessing the dashboard as a guest (using query params)
  const isGuest = location.pathname === '/dashboard' && location.search.includes('guest=true');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={
          <ProtectedRoute isGuest={isGuest}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="workouts/generate" element={<GenerateWorkout />} />
          <Route path="workouts/:id" element={<WorkoutDetail />} />
          <Route path="profile" element={<div>Profile Page</div>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
