/**
 * Health Routes
 * Endpoints for checking system health and dependencies
 */
const express = require('express');
const { Workout, User } = require('../models');
const { sequelize } = require('../models');
const llmService = require('../services/llmService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /health-check
 * @description Check overall system health
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = { operational: false, message: '' };
    try {
      await sequelize.authenticate();
      dbStatus.operational = true;
      dbStatus.message = 'Database connection is OK';
    } catch (error) {
      dbStatus.message = `Database error: ${error.message}`;
      logger.error(`Health check - DB error: ${error.message}`);
    }

    // Check LLM service
    const llmStatus = { operational: false, message: '' };
    try {
      const llmHealth = await llmService.checkHealth();
      llmStatus.operational = llmHealth.operational;
      llmStatus.message = llmHealth.message;
    } catch (error) {
      llmStatus.message = `LLM service error: ${error.message}`;
      logger.error(`Health check - LLM error: ${error.message}`);
    }

    // Get some basic system stats
    const stats = {
      workoutsCount: await Workout.count(),
      usersCount: await User.count(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    // Return overall health status
    const isHealthy = dbStatus.operational && llmStatus.operational;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'OK' : 'DEGRADED',
      database: dbStatus,
      llmService: llmStatus,
      stats,
    });
  } catch (error) {
    logger.error(`Health check failed: ${error.message}`);
    res.status(500).json({
      status: 'ERROR',
      message: `Health check failed: ${error.message}`,
    });
  }
});

/**
 * @route GET /health-check/db
 * @description Check database connectivity only
 * @access Public
 */
router.get('/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      message: 'Database connection is healthy'
    });
  } catch (error) {
    logger.error(`Database health check failed: ${error.message}`);
    res.status(503).json({
      status: 'ERROR',
      message: `Database connection failed: ${error.message}`
    });
  }
});

/**
 * @route GET /health-check/llm
 * @description Check LLM service health only
 * @access Public
 */
router.get('/llm', async (req, res) => {
  try {
    const health = await llmService.checkHealth();
    res.status(health.operational ? 200 : 503).json({
      status: health.operational ? 'OK' : 'ERROR',
      message: health.message,
      details: health
    });
  } catch (error) {
    logger.error(`LLM health check failed: ${error.message}`);
    res.status(503).json({
      status: 'ERROR',
      message: `LLM service is unavailable: ${error.message}`
    });
  }
});

module.exports = router;
