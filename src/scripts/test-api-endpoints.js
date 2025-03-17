/**
 * API Endpoints Test
 * Tests critical API endpoints for the workout plan generation feature
 */
require('dotenv').config();
const axios = require('axios');
// Replace chalk with a simpler color solution that works with CommonJS
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  white: (text) => `\x1b[37m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5000';
const timeout = 5000; // 5 second timeout for requests

// Sample workout preferences for testing the workout generation endpoint
const sampleWorkoutPreferences = {
  fitnessGoal: 'strength',
  experienceLevel: 'intermediate',
  workoutDaysPerWeek: 3,
  workoutDuration: 30,
  availableDays: ['Monday', 'Wednesday', 'Friday'],
  preferredWorkoutTypes: ['Strength Training'],
  equipmentAccess: 'limited',
  limitations: '',
  additionalNotes: 'Quick test'
};

/**
 * Format console output with colors
 */
const log = {
  info: (msg) => console.log(colors.blue('ℹ️ ' + msg)),
  success: (msg) => console.log(colors.green('✅ ' + msg)),
  error: (msg) => console.log(colors.red('❌ ' + msg)),
  warn: (msg) => console.log(colors.yellow('⚠️ ' + msg)),
  header: (msg) => console.log(colors.bold('\n' + msg)),
  json: (data) => console.log(colors.gray(JSON.stringify(data, null, 2))),
  separator: () => console.log(colors.gray('─'.repeat(50)))
};

/**
 * Test an API endpoint
 * @param {string} name - Human-readable name of the endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} endpoint - API endpoint path
 * @param {object} [data] - Optional data payload for POST requests
 * @returns {Promise<object>} - Test result
 */
async function testEndpoint(name, method, endpoint, data = null) {
  const url = `${API_URL}${endpoint}`;
  log.info(`Testing ${name}: ${method} ${url}`);
  
  try {
    const config = { timeout };
    const response = method === 'GET' 
      ? await axios.get(url, config) 
      : await axios.post(url, data, config);
    
    log.success(`${name} endpoint available (${response.status})`);
    log.json(response.data);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    log.error(`${name} endpoint failed: ${error.message}`);
    
    if (error.response) {
      log.error(`Status: ${error.response.status}`);
      log.error('Response data:');
      log.json(error.response.data);
      return { 
        success: false, 
        status: error.response.status, 
        data: error.response.data, 
        error: error.message 
      };
    } else if (error.request) {
      log.error('No response received from server');
      return { 
        success: false, 
        error: 'No response received from server',
        details: error.message 
      };
    } else {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Run all endpoint tests
 */
async function runTests() {
  log.header('API ENDPOINTS TEST');
  log.info(`Testing against API at ${API_URL}`);
  const startTime = Date.now();
  const results = {};

  // Test server health endpoint
  log.header('1. Server Health Check');
  results.serverHealth = await testEndpoint('Server Health', 'GET', '/health');
  log.separator();

  // Test AI health endpoint
  log.header('2. AI Service Health Check');
  results.aiHealth = await testEndpoint('AI Service Health', 'GET', '/api/ai/health');
  log.separator();

  // Test workout generation endpoint
  log.header('3. Workout Plan Generation');
  results.workoutGeneration = await testEndpoint(
    'Workout Generation', 
    'POST',
    '/api/ai/workout',
    sampleWorkoutPreferences
  );
  log.separator();

  // Summarize results
  log.header('TEST SUMMARY');
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const allSuccess = Object.values(results).every(r => r.success);
  
  console.log(`Tests completed in ${duration}s`);
  console.log(`Server Health: ${results.serverHealth.success ? colors.green('PASS') : colors.red('FAIL')}`);
  console.log(`AI Service Health: ${results.aiHealth.success ? colors.green('PASS') : colors.red('FAIL')}`);
  console.log(`Workout Generation: ${results.workoutGeneration.success ? colors.green('PASS') : colors.red('FAIL')}`);
  console.log(`Overall Status: ${allSuccess ? colors.green('ALL TESTS PASSED') : colors.red('SOME TESTS FAILED')}`);
  
  return results;
}

// Exit handler
process.on('SIGINT', () => {
  log.warn('Test interrupted');
  process.exit(1);
});

// Run the tests if called directly
if (require.main === module) {
  runTests()
    .catch(error => {
      log.error(`Unhandled test error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runTests };
