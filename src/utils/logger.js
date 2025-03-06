const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create logs directory:', err);
  }
}

// Simple logger implementation
const logger = {
  info: (message) => {
    const logMessage = `${new Date().toISOString()} INFO: ${message}`;
    console.log('\x1b[36m%s\x1b[0m', logMessage); // Cyan color for info
    appendToLogFile('combined.log', logMessage);
  },
  error: (message) => {
    const logMessage = `${new Date().toISOString()} ERROR: ${message}`;
    console.error('\x1b[31m%s\x1b[0m', logMessage); // Red color for errors
    appendToLogFile('error.log', logMessage);
    appendToLogFile('combined.log', logMessage);
  },
  warn: (message) => {
    const logMessage = `${new Date().toISOString()} WARN: ${message}`;
    console.warn('\x1b[33m%s\x1b[0m', logMessage); // Yellow color for warnings
    appendToLogFile('combined.log', logMessage);
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const logMessage = `${new Date().toISOString()} DEBUG: ${message}`;
      console.debug('\x1b[90m%s\x1b[0m', logMessage); // Gray color for debug
      appendToLogFile('combined.log', logMessage);
    }
  },
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
};

// Helper function to append to log file
function appendToLogFile(filename, message) {
  try {
    fs.appendFileSync(path.join(logsDir, filename), message + '\n');
  } catch (err) {
    console.error(`Failed to write to ${filename}:`, err);
  }
}

module.exports = logger;
