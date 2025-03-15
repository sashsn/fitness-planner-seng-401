const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define the format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports to use
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Error file transport
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
  }),
  
  // Combined logs file transport
  new winston.transports.File({ 
    filename: path.join(__dirname, '../../logs/combined.log') 
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
