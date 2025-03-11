/**
 * Controller for health check endpoints
 */
const os = require('os');
const { version } = require('../../package.json');

/**
 * Get API health status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHealthStatus = (req, res) => {
  const uptime = process.uptime();
  const { rss, heapTotal, heapUsed } = process.memoryUsage();
  
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    version,
    memory: {
      rss: `${Math.round(rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(heapUsed / 1024 / 1024)} MB`,
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      cpus: os.cpus().length,
    }
  };
  
  res.status(200).json(healthData);
};

module.exports = {
  getHealthStatus
};
