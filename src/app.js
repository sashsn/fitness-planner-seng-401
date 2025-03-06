/**
 * Express application setup
 * Configures middleware, routes, and error handling
 */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { ApiError, logApiError } = require('./utils/errors');
const logger = require('./utils/logger');
const path = require('path');
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Make sure JSON parsing is configured correctly
app.use(express.json({ 
  limit: '2mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON received:', e.message);
      res.status(400).send('Invalid JSON');
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/users', userRoutes);

// Add a test endpoint to verify the server is running and accessible
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API server is running properly' });
});

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

// 404 handler for routes not found
app.use((req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  logApiError(error, req);
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logApiError(err, req);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = 5000; // Force port to be 5000 to match frontend expectations

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
