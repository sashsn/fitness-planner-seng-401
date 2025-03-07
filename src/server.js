/**
 * Server entry point
 * This file starts the Express server
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const logger = require('./utils/logger');
const { connectDB } = require('./config/database');

// Create Express app
const app = express();

// Force port to be 5000 to match frontend expectations
const PORT = 5000;

console.log(`Server starting on port ${PORT}...`);

// Middleware setup - Fix CORS for proper frontend communication
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add pre-flight response for complex requests
app.options('*', cors());

// Express JSON configuration with error handling
app.use(express.json({ 
  limit: '2mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON received');
      res.status(400).send('Invalid JSON');
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Session setup
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Import routes
const routes = require('./routes');

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// Import seedDB in development mode
const { seedUsers } = process.env.NODE_ENV !== 'production' ? require('./utils/seedDB') : { seedUsers: () => {} };

// Start the server with database connection
const startServer = async () => {
  try {
    await connectDB();
    
    // Seed the database with test data in development
    if (process.env.NODE_ENV !== 'production') {
      await seedUsers();
    }
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;

