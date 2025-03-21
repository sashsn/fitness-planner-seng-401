import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GenerateWorkout from '../pages/workouts/GenerateWorkout';
import WorkoutPlans from '../pages/workouts/WorkoutPlans';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Nutrition from '../pages/nutrition/Nutrition';

import CreateMeal from '../pages/nutrition/CreateMeal';


// Create stub components for missing pages
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Workouts = () => <div>Workouts List Page</div>;

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/nutrition/CreateMeal" element={<CreateMeal />} />
        
        {/* Protected routes using MainLayout with sidebar */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="workouts/generate" element={<GenerateWorkout />} />
          <Route path="workouts/plans" element={<WorkoutPlans />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
