import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Create stub components for missing imports
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
// Simple ProtectedRoute implementation
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you'd check auth state here
  return <>{children}</>;
};

import GenerateWorkout from '../pages/workouts/GenerateWorkout';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts/generate"
          element={
            <ProtectedRoute>
              <GenerateWorkout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
