const express = require('express');
const router = express.Router();
const { generateWorkoutPlan } = require('../controllers/aiController');

// Define the route for generating workout plans
router.post('/generate-workout', generateWorkoutPlan);

module.exports = router;

// Add this to your existing routes

// Import routes
const aiRoutes = require('./routes/aiRoutes');

// Use routes
app.use('/api/ai', aiRoutes);