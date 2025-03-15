/**
 * Test Workout Generation
 * A script to test the workout generation functionality
 */
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration - add option to override LLM URL from command line
const API_URL = process.env.API_URL || 'http://localhost:5000';
const LLM_URL = process.env.LLM_API_URL || 'http://localhost:1234/v1/chat/completions';
const OUTPUT_DIR = path.join(__dirname, '../../test-output');

// Print configuration for debugging
console.log('🛠️  Test Configuration:');
console.log(`- API URL: ${API_URL}`);
console.log(`- LLM URL: ${LLM_URL}`);
console.log(`- Output Directory: ${OUTPUT_DIR}`);
console.log('');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Sample workout preferences for testing
const samplePreferences = {
  fitnessGoal: 'strength',
  experienceLevel: 'intermediate',
  workoutDaysPerWeek: 4,
  workoutDuration: 45,
  availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
  preferredWorkoutTypes: ['Strength Training', 'HIIT'],
  equipmentAccess: 'full',
  limitations: '',
  additionalNotes: 'Focus on upper body development'
};

/**
 * Check if the server is running
 */
async function checkServerRunning() {
  console.log('\n--- Checking if server is running ---');
  try {
    // Try to access the root health endpoint
    const response = await axios.get(`${API_URL}/health`, { 
      timeout: 5000 
    });
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running. Please start the server with "npm run dev"');
    } else {
      console.error('❌ Error checking server:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    return false;
  }
}

/**
 * Test direct connection to LLM
 */
async function testLlmConnection() {
  console.log('\n--- Testing direct LLM connection ---');
  
  try {
    console.log(`Sending request to: ${LLM_URL}`);
    const response = await axios.post(LLM_URL, {
      model: 'mistral-7b-instruct-v0.2',
      messages: [
        {
          role: 'user',
          content: 'Respond with "LLM service is working properly"'
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    }, {
      timeout: 10000, // 10 seconds timeout
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('LLM Response:', response.data.choices[0].message.content);
    console.log('✅ Direct LLM connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ LLM connection failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

/**
 * Test all available health check endpoints
 */
async function testHealthCheck() {
  console.log('\n--- Testing Health Check API ---');
  const endpoints = [
    '/api/health-check',
    '/api/health-check/',
    '/health',
    '/health-check',
    '/api/health'
  ];
  
  let success = false;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${API_URL}${endpoint}`);
      const response = await axios.get(`${API_URL}${endpoint}`, { timeout: 5000 });
      console.log(`✅ Health check successful at ${endpoint}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      success = true;
      break;
    } catch (error) {
      console.error(`❌ Health check failed at ${endpoint}:`, error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
  
  return success;
}

/**
 * Test the AI health check endpoint
 */
async function testAIHealthCheck() {
  console.log('\n--- Testing AI Health Check API ---');
  
  try {
    const response = await axios.get(`${API_URL}/api/ai/health`, { timeout: 5000 });
    console.log('AI Health Check Response:', JSON.stringify(response.data, null, 2));
    console.log('✅ AI health check API successful');
    
    return true;
  } catch (error) {
    console.error('❌ AI health check failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

/**
 * Test the workout generation endpoint directly
 */
async function testWorkoutGeneration() {
  console.log('\n--- Testing Workout Generation ---');
  
  try {
    // For simplicity in testing, we'll use a direct call without authentication
    const response = await axios.post(`${API_URL}/api/ai/workout`, samplePreferences);
    
    console.log('✅ Workout generation successful');
    console.log('Generated Plan Type:', typeof response.data);
    
    // Save the generated plan to a file for inspection
    const outputFile = path.join(OUTPUT_DIR, `workout-plan-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2));
    console.log(`Workout plan saved to: ${outputFile}`);
    
    return true;
  } catch (error) {
    console.error('❌ Workout generation failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🏋️‍♂️ Starting Workout Generation Tests');
  
  // First check if server is running
  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    console.log('⚠️ Server is not running. Please start the server and try again.');
    return;
  }
  
  const llmResult = await testLlmConnection();
  const healthResult = await testHealthCheck();
  const aiHealthResult = await testAIHealthCheck();
  
  // Try workout generation if either health check or AI health check passed
  if (llmResult && (healthResult || aiHealthResult)) {
    await testWorkoutGeneration();
  } else {
    console.log('⚠️ Skipping workout generation test due to failed prerequisites');
  }
  
  console.log('\n--- Test Summary ---');
  console.log(`Server Running: ${serverRunning ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`LLM Connection: ${llmResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Health Check: ${healthResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AI Health Check: ${aiHealthResult ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n🏁 Testing completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
