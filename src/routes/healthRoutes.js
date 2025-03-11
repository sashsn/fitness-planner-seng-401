/**
 * Health check routes
 */
const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/healthController');

// Health check endpoint
router.get('/health-check', getHealthStatus);

module.exports = router;
