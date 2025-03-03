const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authController = require('./controllers/AuthController');
const planController = require('./controllers/PlanController');
const profileController = require('./controllers/ProfileController');

const app = express();
app.use(express.json());

app.post('/api/auth/register', authController.registerUser);
app.post('/api/auth/login', authController.loginUser);
app.post('/api/plans/generate', planController.generatePlan);
app.get('/api/profile', profileController.viewProfile);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
