import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/reduxHooks';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Import Routes
import ProtectedRoute from './routes/ProtectedRoute';

// Import Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/workouts/Workouts';
import GenerateWorkout from './pages/workouts/GenerateWorkout';
import WorkoutPlans from './pages/workouts/WorkoutPlans';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Main Application Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="workouts/generate" element={<GenerateWorkout />} />
        <Route path="workouts/plans" element={<WorkoutPlans />} />
        <Route path="workouts/:id" element={<WorkoutDetail />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
