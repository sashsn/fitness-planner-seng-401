/**
 * Environment configuration
 * Centralizes all environment variables and configuration settings
 */

// Configuration from environment variables
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  
  // Database configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'O7frfuiq.',
  DB_NAME: process.env.DB_NAME || 'fitness_planner', // Match exactly the database name from psql output
  OPENAI_API_KEY: '',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',

  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};