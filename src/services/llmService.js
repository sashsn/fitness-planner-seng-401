/**
 * LLM Service
 * Handles communication with the OpenAI API
 */
const axios = require('axios');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

// OpenAI API configuration
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'http://localhost:1234/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
const DEFAULT_TIMEOUT = 30000; // Reduce to 30 seconds for better responsiveness

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

    // Create a cancel token for timeout
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel('Request timeout');
    }, options.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await axios.post(OPENAI_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        timeout: options.timeout || DEFAULT_TIMEOUT,
        cancelToken: source.token
      });

      clearTimeout(timeout);
      
      if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        logger.error('Invalid OpenAI API response structure:', response.data);
        throw new Error('Invalid response from OpenAI API');
      }

      return response.data.choices[0].message.content;
    } catch (axiosError) {
      clearTimeout(timeout);
      if (axios.isCancel(axiosError)) {
        logger.error('OpenAI request timed out');
        throw new Error('OpenAI request timed out after ' + (options.timeout || DEFAULT_TIMEOUT) / 1000 + ' seconds');
      }
      throw axiosError;
    }
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
    // Create a fallback plan immediately as a backup
    const fallbackPlan = createSimpleFallbackPlan(preferences);
    
    try {
      // Create the prompt for the LLM
      const prompt = createWorkoutPlanPrompt(preferences);
      
      // Query the LLM with a reasonable timeout
      logger.debug('Sending workout plan generation request to LLM');
      const rawResponse = await queryLLM(prompt, {
        temperature: 0.7,
        maxTokens: 2500,
        timeout: 60000 // 60 seconds timeout
      });
      
      logger.debug(`Received raw response from LLM, length: ${rawResponse?.length || 0}`);
      
      // Try to parse the response directly first - LM Studio already returns valid JSON
      try {
        const parsedPlan = JSON.parse(rawResponse);
        
        // Validate the basic structure
        if (parsedPlan && parsedPlan.workoutPlan) {
          logger.debug('Successfully parsed LM Studio response as direct JSON');
          return parsedPlan;
        }
      } catch (directParseError) {
        // If direct parsing fails, try to extract JSON using various methods
        logger.debug(`Direct parsing failed: ${directParseError.message}, trying extraction methods`);
      }
      
      // Try different extraction methods sequentially
      let extractedJson = null;
      
      // Method 1: Check for markdown code blocks (```json ... ```)
      const markdownMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (markdownMatch && markdownMatch[1]) {
        try {
          const parsedFromMarkdown = JSON.parse(markdownMatch[1].trim());
          if (parsedFromMarkdown && parsedFromMarkdown.workoutPlan) {
            logger.debug('Successfully extracted JSON from markdown code block');
            return parsedFromMarkdown;
          }
        } catch (markdownParseError) {
          logger.debug(`Markdown extraction failed: ${markdownParseError.message}`);
        }
      }
      
      // Method 2: Try to extract any JSON object with a string match
      const jsonObjectMatch = rawResponse.match(/(\{[\s\S]*\})/);
      if (jsonObjectMatch && jsonObjectMatch[1]) {
        try {
          const parsedFromObject = JSON.parse(jsonObjectMatch[1].trim());
          if (parsedFromObject && parsedFromObject.workoutPlan) {
            logger.debug('Successfully extracted JSON using object pattern matching');
            return parsedFromObject;
          }
        } catch (objectParseError) {
          logger.debug(`Object extraction failed: ${objectParseError.message}`);
        }
      }
      
      // If we're here, all parsing attempts failed
      logger.warn('All JSON parsing methods failed, using fallback plan');
      return fallbackPlan;
      
    } catch (error) {
      logger.error(`Error in workout generation: ${error.message}`);
      return fallbackPlan;
    }
  } catch (error) {
    logger.error(`Fatal error in workout generation: ${error.message}`);
    return createBasicFallbackPlan();
  }
}

/**
 * Create a most basic fallback plan
 */
function createBasicFallbackPlan() {
  return {
    workoutPlan: {
      metadata: {
        name: "Basic Workout Plan",
        goal: "General Fitness",
        fitnessLevel: "Beginner",
        durationWeeks: 4,
        createdAt: new Date().toISOString()
      },
      overview: {
        description: "A simple workout plan for general fitness.",
        weeklyStructure: "3 days per week",
        recommendedEquipment: ["No equipment needed"],
        estimatedTimePerSession: "30 minutes"
      },
      schedule: [
        {
          week: 1,
          days: [
            {
              dayOfWeek: "Monday",
              workoutType: "Full Body",
              focus: "General Fitness",
              duration: 30,
              exercises: [
                {
                  name: "Push-ups",
                  category: "Strength",
                  targetMuscles: ["Chest", "Triceps"],
                  sets: 3,
                  reps: 10,
                  weight: "Bodyweight",
                  restBetweenSets: 60,
                  notes: "Modify as needed",
                  alternatives: []
                }
              ]
            }
          ]
        }
      ],
      nutrition: {
        generalGuidelines: "Eat a balanced diet",
        dailyProteinGoal: "0.8g per kg bodyweight",
        mealTimingRecommendation: "3-4 hours between meals"
      },
      progressionPlan: {
        weeklyAdjustments: []
      },
      additionalNotes: "This is a fallback plan."
    }
  };
}

/**
 * Create a simple fallback workout plan based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Object} Basic workout plan
 */
function createSimpleFallbackPlan(preferences) {
  // Extract basic preferences
  const {
    fitnessGoal = "General fitness",
    experienceLevel = "Beginner",
    workoutDaysPerWeek = 3,
    workoutDuration = 30,
    availableDays = ["Monday", "Wednesday", "Friday"],
    preferredWorkoutTypes = ["Strength Training"],
    equipmentAccess = "limited"
  } = preferences;
  
  // Create a day in the schedule for each available day (up to workoutDaysPerWeek)
  const scheduleDays = [];
  const daysToUse = availableDays.slice(0, workoutDaysPerWeek);
  
  // Create workout days
  daysToUse.forEach(day => {
    scheduleDays.push({
      dayOfWeek: day,
      workoutType: preferredWorkoutTypes[0] || "Full Body",
      focus: fitnessGoal === "muscleGain" ? "Strength" : 
             fitnessGoal === "weightLoss" ? "Cardio" : 
             fitnessGoal === "endurance" ? "Endurance" : "General",
      duration: workoutDuration,
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
        },
        {
          name: "Push-ups",
          category: "Strength",
          targetMuscles: ["Chest", "Shoulders", "Triceps"],
          sets: 3,
          reps: 10,
          weight: "Bodyweight",
          restBetweenSets: 60,
          notes: "Modify by doing on knees if needed",
          alternatives: ["Incline Push-ups"]
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
    });
  });
  
  return {
    workoutPlan: {
      metadata: {
        name: `${fitnessGoal} Plan for ${experienceLevel}`,
        goal: fitnessGoal,
        fitnessLevel: experienceLevel,
        durationWeeks: 4,
        createdAt: new Date().toISOString()
      },
      overview: {
        description: `A ${fitnessGoal.toLowerCase()} workout plan for ${experienceLevel.toLowerCase()} level with ${workoutDaysPerWeek} workouts per week.`,
        weeklyStructure: `${workoutDaysPerWeek} days per week`,
        recommendedEquipment: equipmentAccess === "none" ? ["Bodyweight only"] :
                              equipmentAccess === "limited" ? ["Dumbbells", "Resistance bands"] :
                              ["Full gym equipment"],
        estimatedTimePerSession: `${workoutDuration} minutes`
      },
      schedule: [
        {
          week: 1,
          days: scheduleDays
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
      additionalNotes: `This plan focuses on ${fitnessGoal.toLowerCase()} and is designed for your ${experienceLevel.toLowerCase()} level.`
    }
  };
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
    return {
      available: false,
      operational: false,
      error: error.message
    };
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
As an expert fitness coach, create a personalized workout plan based on these preferences:

- Fitness Goal: ${fitnessGoal || 'General fitness'}
- Experience Level: ${experienceLevel || 'Beginner'}
- Workout Days Per Week: ${workoutDaysPerWeek || 3}
- Workout Duration: ${workoutDuration || 45} minutes
- Available Days: ${availableDays ? availableDays.join(', ') : 'Flexible'}
- Preferred Workout Types: ${preferredWorkoutTypes ? preferredWorkoutTypes.join(', ') : 'Any'}
- Equipment Access: ${equipmentAccess || 'Limited'}
- Limitations/Injuries: ${limitations || 'None'}
- Additional Notes: ${additionalNotes || 'None'}

Respond with ONLY a JSON object in this format:
{
  "workoutPlan": {
    "metadata": {
      "name": "Name of plan",
      "goal": "Primary goal",
      "fitnessLevel": "User level",
      "durationWeeks": 4,
      "createdAt": "Current date"
    },
    "overview": {
      "description": "Brief description",
      "weeklyStructure": "Brief structure overview",
      "recommendedEquipment": ["Equipment list"],
      "estimatedTimePerSession": "Minutes per session"
    },
    "schedule": [
      {
        "week": 1,
        "days": [
          {
            "dayOfWeek": "Day name",
            "workoutType": "Type",
            "focus": "Focus area",
            "duration": 30,
            "exercises": [
              {
                "name": "Exercise name",
                "category": "Category",
                "targetMuscles": ["Muscles"],
                "sets": 3,
                "reps": 10,
                "weight": "Weight",
                "restBetweenSets": 60,
                "notes": "Notes",
                "alternatives": ["Alternatives"]
              }
            ]
          }
        ]
      }
    ],
    "nutrition": {
      "generalGuidelines": "Nutrition advice",
      "dailyProteinGoal": "Protein recommendation",
      "mealTimingRecommendation": "Meal timing advice"
    },
    "progressionPlan": {
      "weeklyAdjustments": [
        {
          "week": 2,
          "adjustments": "Week 2 adjustments"
        }
      ]
    },
    "additionalNotes": "Any additional notes"
  }
}

The response should be JUST the JSON object without any markdown formatting, explanation, or wrapper text.
`;
}

module.exports = {
  generateWorkoutPlan,
  checkHealth,
  queryLLM
};
