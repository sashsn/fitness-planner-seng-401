import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/reduxHooks';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Workouts from './pages/workouts/Workouts';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import CreateWorkout from './pages/workouts/CreateWorkout';
import EditWorkout from './pages/workouts/EditWorkout';
import Nutrition from './pages/nutrition/Nutrition';
import CreateMeal from './pages/nutrition/CreateMeal';
import EditMeal from './pages/nutrition/EditMeal';
import Goals from './pages/goals/Goals';
import CreateGoal from './pages/goals/CreateGoal';
import EditGoal from './pages/goals/EditGoal';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkingAuth } = useAppSelector((state) => state.auth);

  // If still checking auth, return nothing yet
  if (checkingAuth) return null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="workouts/create" element={<CreateWorkout />} />
        <Route path="workouts/:id" element={<WorkoutDetail />} />
        <Route path="workouts/:id/edit" element={<EditWorkout />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="nutrition/create" element={<CreateMeal />} />
        <Route path="nutrition/:id/edit" element={<EditMeal />} />
        <Route path="goals" element={<Goals />} />
        <Route path="goals/create" element={<CreateGoal />} />
        <Route path="goals/:id/edit" element={<EditGoal />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
