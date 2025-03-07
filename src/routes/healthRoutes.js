const express = require('express');
const router = express.Router();

/**
 * @route GET /api/health-check
 * @description Check if the API is running
 * @access Public
 */
router.get('/health-check', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
