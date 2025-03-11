/**
 * Service for handling LLM (Language Learning Model) API requests
 */

// Base URL for LLM API with port 1234
const LLM_API_BASE_URL = 'http://localhost:1234';

/**
 * Send a prompt to the LLM API
 * @param {string} prompt - The input prompt to send to the LLM
 * @param {Object} options - Additional options for the request
 * @returns {Promise} - Promise resolving to the API response
 */
export async function queryLLM(prompt, options = {}) {
  try {
    const response = await fetch(`${LLM_API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        ...options
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API returned ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying LLM API:', error);
    throw error;
  }
}

/**
 * Get model information from the LLM API
 * @returns {Promise} - Promise resolving to the model information
 */
export async function getModelInfo() {
  try {
    const response = await fetch(`${LLM_API_BASE_URL}/api/model-info`);
    
    if (!response.ok) {
      throw new Error(`LLM API returned ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting LLM model info:', error);
    throw error;
  }
}

/**
 * Calculate daily protein goal based on user's weight
 * @param {number} weightInPounds - User's weight in pounds
 * @param {Object} additionalUserData - Optional additional user data (activity level, goals, etc.)
 * @returns {Promise} - Promise resolving to protein goal recommendation
 */
export async function calculateProteinGoal(weightInPounds, additionalUserData = {}) {
  try {
    const prompt = `
      Calculate the daily protein goal for a person weighing ${weightInPounds} pounds.
      The general guideline is approximately 1g of protein per pound of body weight.
      
      Additional user information:
      ${Object.entries(additionalUserData).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
      
      Please provide:
      1. The recommended daily protein intake in grams
      2. A brief explanation of why this amount is recommended
      3. Suggest 3-4 high protein foods that would help meet this goal
    `;
    
    const response = await queryLLM(prompt);
    return response;
  } catch (error) {
    console.error('Error calculating protein goal:', error);
    throw error;
  }
}

/**
 * Get user's protein goal using data from their profile
 * @param {Object} userProfile - User profile containing weight and other relevant data
 * @returns {Promise} - Promise resolving to personalized protein goal data
 */
export async function getUserProteinGoal(userProfile) {
  if (!userProfile || !userProfile.weight) {
    throw new Error('User weight is required to calculate protein goal');
  }
  
  const weightInPounds = userProfile.weight; // Assuming weight is stored in pounds
  
  // Additional data that might be relevant for a more personalized recommendation
  const additionalData = {
    activityLevel: userProfile.activityLevel || 'moderate',
    fitnessGoals: userProfile.fitnessGoals || 'general fitness',
    gender: userProfile.gender || 'not specified',
    age: userProfile.age || 'not specified'
  };
  
  return calculateProteinGoal(weightInPounds, additionalData);
}
