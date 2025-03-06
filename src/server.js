require('dotenv').config();
const express = require('express');
const path = require('path'); 
const cookieParser = require('cookie-parser'); 
const session = require('express-session');
const cors = require('cors');
const logger = require('./utils/logger');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { connectDB } = require('./config/database');
const routes = require('./routes');

// Force port to be 5000 to match frontend expectations
const app = express();
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
app.use(notFound);
app.use(errorHandler);

// Start the server if this file is run directly
if (require.main === module) {
  // Load database models
  const db = require('./models');
  
  // Connect to PostgreSQL database
  db.sequelize.authenticate()
    .then(() => {
      logger.info('PostgreSQL database connected');
      return db.sequelize.sync({ force: false });
    })
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
      });
    })
    .catch(err => {
      logger.error(`Failed to start server: ${err.message}`);
    });
}

module.exports = app;

