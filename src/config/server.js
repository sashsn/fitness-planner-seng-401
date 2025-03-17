/**
 * Server Configuration
 * Loads environment variables and sets up server-related configurations
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define server configuration
module.exports = {
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your-development-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  // Updated to use OpenAI instead of LM Studio with new API key
  openaiApiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions',
  openaiApiKey: process.env.OPENAI_API_KEY || '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'
};

console.log(`Server configured for ${module.exports.environment} environment`);
console.log(`OpenAI API configured for workout generation`);
