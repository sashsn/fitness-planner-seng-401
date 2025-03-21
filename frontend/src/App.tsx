import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import EditWorkout from './pages/workouts/EditWorkout';
import CreateWorkout from './pages/workouts/CreateWorkout';
import GenerateWorkout from './pages/workouts/GenerateWorkout';
import WorkoutPlans from './pages/workouts/WorkoutPlans';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import NotFound from './pages/NotFound';

import Goals from './pages/goals/Goals';
import EditGoal from './pages/goals/EditGoal';
import CreateGoal from './pages/goals/CreateGoal';

import Nutrition from './pages/nutrition/Nutrition';
import EditMeal from './pages/nutrition/EditMeal';
import CreateMeal from './pages/nutrition/CreateMeal';

import PlanDetail from './pages/workouts/PlanDetail';


const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
    console.log("App - Checking authentication status");
  }, [dispatch]);
  
  useEffect(() => {
    console.log("App - Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [isAuthenticated]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />
        
        {/* Protected routes with layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workouts/Workouts" element={<Workouts />} />
          <Route path="workouts/CreateWorkout" element={<CreateWorkout />} />
          <Route path="workouts/GenerateWorkout" element={<GenerateWorkout />} />
          <Route path="workouts/:id" element={<WorkoutDetail />} />
          <Route path="workouts/WorkoutPlans" element={<WorkoutPlans />} />
          <Route path="workouts/EditWorkout/:id" element={<EditWorkout />} />


          {/* will need to add paths for all potential paths from the dashboard to this file */}
          <Route path="/goals/CreateGoal" element={<CreateGoal />} />
          <Route path="/goals/:id/EditGoal" element={<EditGoal />} />
          <Route path="/goals/Goals" element={<Goals />} />

          <Route path="/nutrition/CreateMeal" element={<CreateMeal />} />
          <Route path="/nutrition/:id/EditMeal" element={<EditMeal />} />
          <Route path="/nutrition/Nutrition" element={<Nutrition />} />

          <Route path="/workouts/PlanDetails/:id" element={<PlanDetail />} />

          <Route path="profile" element={<div>Profile Page</div>} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
