/**
 * LLM Service
 * Handles communication with the OpenAI API instead of local LM Studio
 */
const axios = require('axios');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

// OpenAI API configuration
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
const DEFAULT_TIMEOUT = 60000; // 60 seconds

/**
 * Send a query to the OpenAI API
 * @param {string} prompt - The prompt to send to the OpenAI
 * @param {Object} options - Additional options for the OpenAI query
 * @returns {Promise<Object>} - The response from the OpenAI
 */
async function queryLLM(prompt, options = {}) {
  try {
    const requestBody = {
      model: options.model || 'gpt-3.5-turbo', // Default OpenAI model
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: false
    };

    logger.debug(`Sending request to OpenAI API`);

    const response = await axios.post(OPENAI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      timeout: options.timeout || DEFAULT_TIMEOUT
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error(`OpenAI API Error: ${error.message}`);
    if (error.response) {
      logger.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
    }
    throw new ApiError(500, 'Error communicating with AI service: ' + error.message);
  }
}

/**
 * Generate a workout plan based on user preferences
 * @param {Object} preferences - User's workout preferences
 * @returns {Promise<Object>} - Generated workout plan
 */
async function generateWorkoutPlan(preferences) {
  try {
    // Create a detailed prompt for the LLM
    const prompt = createWorkoutPlanPrompt(preferences);
    
    // Query the LLM
    const rawResponse = await queryLLM(prompt, {
      temperature: 0.7,
      maxTokens: 3000, // Increased for detailed workout plans
      timeout: 90000 // 90 seconds for complex workout generation
    });
    
    // Parse the response from the LLM into structured workout plan
    const workoutPlan = parseWorkoutPlanResponse(rawResponse);
    
    return workoutPlan;
  } catch (error) {
    logger.error(`Workout plan generation failed: ${error.message}`);
    throw new ApiError(500, 'Failed to generate workout plan: ' + error.message);
  }
}

/**
 * Check if the OpenAI service is available and responsive
 * @returns {Promise<Object>} - Health status information
 */
async function checkHealth() {
  try {
    // Simple prompt to check if OpenAI is responsive
    const response = await queryLLM("Respond with 'OpenAI is operational'", {
      maxTokens: 20,
      timeout: 5000 // Short timeout for health checks
    });
    
    // Check if the response contains expected confirmation
    const isOperational = response.includes('operational');
    
    return {
      available: true,
      operational: isOperational,
      responseTime: Date.now(),
      message: response
    };
  } catch (error) {
    logger.error(`OpenAI health check failed: ${error.message}`);
    throw new ApiError(503, 'OpenAI service unavailable: ' + error.message);
  }
}

/**
 * Create a detailed prompt for workout plan generation
 * @param {Object} preferences - User's workout preferences
 * @returns {string} - Formatted prompt for the LLM
 */
function createWorkoutPlanPrompt(preferences) {
  // Extract relevant preferences
  const {
    fitnessGoal,
    experienceLevel,
    workoutDaysPerWeek,
    workoutDuration,
    availableDays,
    preferredWorkoutTypes,
    equipmentAccess,
    limitations,
    additionalNotes,
    userProfile
  } = preferences;

  // Create a detailed prompt that instructs the LLM to generate a workout plan in JSON format
  return `
You are an expert fitness coach creating a personalized workout plan. Generate a detailed workout plan based on the following preferences:

### User Preferences:
- Fitness Goal: ${fitnessGoal || 'General fitness'}
- Experience Level: ${experienceLevel || 'Beginner'}
- Workout Days Per Week: ${workoutDaysPerWeek || 3}
- Workout Duration: ${workoutDuration || 45} minutes
- Available Days: ${availableDays ? availableDays.join(', ') : 'Flexible'}
- Preferred Workout Types: ${preferredWorkoutTypes ? preferredWorkoutTypes.join(', ') : 'Any'}
- Equipment Access: ${equipmentAccess || 'Limited'}
- Limitations/Injuries: ${limitations || 'None'}
- Additional Notes: ${additionalNotes || 'None'}

${userProfile ? `
### User Profile:
- Weight: ${userProfile.weight ? `${userProfile.weight} ${userProfile.weightUnit || 'kg'}` : 'Unknown'}
- Height: ${userProfile.height ? `${userProfile.height} ${userProfile.heightUnit || 'cm'}` : 'Unknown'}
- Age: ${userProfile.age || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}
` : ''}

Generate a comprehensive workout plan in valid JSON format with the following structure,
the values in this example should be updated with new values to matche the peronalized plan you will provide, right now they are descriptors of what to put and are not real valid values.
Ensure the response is valid JSON by setting all attributes as strings, no numerical datatypes:
{
  "workoutPlan": {
    "metadata": {
      "name": "Name of the workout plan",
      "goal": "Primary fitness goal",
      "fitnessLevel": "User's fitness level",
      "durationWeeks": Number of weeks for the program,
      "createdAt": "Current date in ISO format"
    },
    "overview": {
      "description": "Brief description of the workout plan",
      "weeklyStructure": "Brief overview of the weekly workout structure",
      "recommendedEquipment": ["List of required equipment"],
      "estimatedTimePerSession": "Average time per workout session in minutes"
    },
    "schedule": [
      {
        "week": 1,
        "days": [
          {
            "dayOfWeek": "Day name",
            "workoutType": "Type of workout",
            "focus": "Body part or focus area",
            "duration": Duration in minutes,
            "exercises": [
              {
                "name": "Exercise name",
                "category": "Exercise category",
                "targetMuscles": ["Target muscles"],
                "sets": Number of sets,
                "reps": Number of repetitions,
                "weight": "Weight recommendation",
                "restBetweenSets": Rest time in seconds,
                "notes": "Additional notes",
                "alternatives": ["Alternative exercises"]
              }
            ],
            "warmup": {
              "duration": Duration in minutes,
              "description": "Warmup description"
            },
            "cooldown": {
              "duration": Duration in minutes,
              "description": "Cooldown description"
            }
          }
        ]
      }
    ],
    "nutrition": {
      "generalGuidelines": "General nutrition advice",
      "dailyProteinGoal": "Recommended protein intake",
      "mealTimingRecommendation": "Advice on meal timing"
    },
    "progressionPlan": {
      "weeklyAdjustments": [
        {
          "week": Week number,
          "adjustments": "Adjustments for this week"
        }
      ]
    },
    "additionalNotes": "Any additional notes or recommendations"
  }
}

Ensure you include multiple weeks in the schedule based on the durationWeeks value, with appropriate progression between weeks. Each week should have workout days matching the user's available days and preferences.

IMPORTANT: The response must be valid JSON without any additional text. Provide only the JSON object as described above.
`;
}

/**
 * Parse the LLM response into a structured workout plan
 * @param {string} response - Raw text response from LLM
 * @returns {Object} - Structured workout plan object
 */
function parseWorkoutPlanResponse(response) {
  try {
    // Log the raw response for debugging
    logger.debug(`Raw LLM response length: ${response.length} characters`);
    
    // First, try to extract JSON if the response contains text around it
    let jsonString = response;
    
    // Look for JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
      logger.debug(`Extracted JSON object with length: ${jsonString.length}`);
    }

    // Preprocessing: Try to fix common JSON syntax errors
    // jsonString = cleanJsonString(jsonString);
    // Parse the JSON
    const workoutPlan = JSON.parse(jsonString);
    

    // Validate the structure has required fields
    if (!workoutPlan.workoutPlan) {
      throw new Error('Missing workoutPlan field in response');
    }
    
    // Return the parsed workout plan
    return workoutPlan;
  } catch (error) {
    logger.error(`Failed to parse LLM response: ${error.message}`);
    // logger.debug(`Response snippet: ${response.substring(0, 200)}...`);
    
    if (error.message.includes('position')) {
      // Extract position from error message
      const positionMatch = error.message.match(/position (\d+)/);
      if (positionMatch && positionMatch[1]) {
        const errorPosition = parseInt(positionMatch[1]);
        const startPos = Math.max(0, errorPosition - 50);
        const endPos = Math.min(response.length, errorPosition + 50);
        
        logger.error(`Context around error position: "${response.substring(startPos, errorPosition)}[ERROR HERE]${response.substring(errorPosition, endPos)}"`);
      }
    }
    
    // If parsing fails, create a minimal valid structure
    return generateFallbackPlan();
  }
}

/**
 * Clean JSON string to fix common syntax errors
 * @param {string} jsonString - Raw JSON string
 * @returns {string} - Cleaned JSON string
 */
function cleanJsonString(jsonString) {
  try {
    // Remove potential trailing commas (common error in JSON)
    jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');
    
    // Handle unquoted property names
    jsonString = jsonString.replace(/(\{|\,)\s*(\w+)\s*\:/g, '$1"$2":');
    
    // Fix specific issue with "X minute" or "X minutes" values without quotes
    jsonString = jsonString.replace(/"reps"\s*:\s*(\d+)\s+(minute|minutes|second|seconds|rep|reps)/g, '"reps": "$1 $2"');
    jsonString = jsonString.replace(/"duration"\s*:\s*(\d+)\s+(minute|minutes|second|seconds)/g, '"duration": "$1 $2"');
    jsonString = jsonString.replace(/"restBetweenSets"\s*:\s*(\d+)\s+(minute|minutes|second|seconds)/g, '"restBetweenSets": "$1 $2"');
    
    // More general case for unquoted strings - quotes values that contain alphabetic chars
    jsonString = jsonString.replace(/:\s*(\d+\s+[a-zA-Z]+[a-zA-Z\s]*)([,\}])/g, ': "$1"$2');
    
    // Fix missing quotes around string values (more robust pattern)
    const propertyPattern = /("[\w]+")\s*:\s*([^"{\[\d][^,{}\[\]]*?)(\s*[,}\]])/g;
    while (propertyPattern.test(jsonString)) {
      jsonString = jsonString.replace(propertyPattern, '$1: "$2"$3');
    }
    
    // Extra handling for common units in exercise data
    const unitsPattern = /:\s*(\d+)(\s*)(kg|lbs|lb|pounds|seconds|minutes|reps)([,\}])/g;
    jsonString = jsonString.replace(unitsPattern, ': "$1$2$3"$4');
    
    return jsonString;
  } catch (error) {
    logger.warn(`Error while cleaning JSON string: ${error.message}`);
    return jsonString; // Return original if cleaning fails
  }
}

/**
 * Generate a fallback workout plan when parsing fails
 * @returns {Object} - Fallback workout plan
 */
function generateFallbackPlan() {
  logger.info('Generating fallback workout plan due to parsing error');
  
  return {
    workoutPlan: {
      metadata: {
        name: "Basic Workout Plan",
        goal: "General fitness",
        fitnessLevel: "Beginner",
        durationWeeks: 4,
        createdAt: new Date().toISOString()
      },
      overview: {
        description: "This is a basic workout plan generated when the detailed generation failed. Please try again, thank you for your patience!",
        weeklyStructure: "3 days per week",
        recommendedEquipment: ["Minimal equipment needed"],
        estimatedTimePerSession: "30 minutes"
      },
      schedule: [
        {
          week: 1,
          days: [
            {
              dayOfWeek: "Monday",
              workoutType: "Full Body",
              focus: "Strength",
              duration: 30,
              exercises: [
                {
                  name: "Bodyweight Squats",
                  category: "Strength",
                  targetMuscles: ["Legs"],
                  sets: 3,
                  reps: 10,
                  weight: "Bodyweight",
                  restBetweenSets: 60,
                  notes: "Focus on form",
                  alternatives: ["Lunges"]
                }
              ],
              warmup: {
                duration: 5,
                description: "Light cardio and dynamic stretching"
              },
              cooldown: {
                duration: 5,
                description: "Static stretching and breathing exercises"
              }
            }
          ]
        }
      ],
      nutrition: {
        generalGuidelines: "Focus on whole foods and adequate protein",
        dailyProteinGoal: "0.8g per kg of bodyweight",
        mealTimingRecommendation: "Eat every 3-4 hours"
      },
      progressionPlan: {
        weeklyAdjustments: [
          {
            week: 2,
            adjustments: "Increase repetitions by 2-3 per exercise"
          }
        ]
      },
      additionalNotes: "An error occurred during workout plan generation. This is a simplified plan. Please try again or contact support."
    }
  };
}

module.exports = {
  generateWorkoutPlan,
  checkHealth,
  queryLLM
};
