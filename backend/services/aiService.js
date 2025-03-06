const { OpenAI } = require('openai');
const config = require('../config');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  /**
   * Generate a workout plan based on user preferences
   * @param {Object} preferences - User workout preferences
   * @returns {Promise<Object>} - Generated workout plan
   */
  async generateWorkoutPlan(preferences) {
    try {
      const prompt = this.buildWorkoutPrompt(preferences);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106", // Using a version that supports json_object response format
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      // Extract the response content
      const content = response.choices[0].message.content;
      
      try {
        // Parse the JSON response
        const workoutPlan = JSON.parse(content);
        return workoutPlan;
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        throw new Error('Failed to parse workout plan data');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  }

  /**
   * Build a prompt for workout plan generation based on user preferences
   * @param {Object} preferences - User workout preferences
   * @returns {String} - Formatted prompt for OpenAI
   */
  buildWorkoutPrompt(preferences) {
    const {
      fitnessGoal,
      experienceLevel,
      workoutDaysPerWeek,
      workoutDuration,
      availableDays,
      preferredWorkoutTypes,
      equipmentAccess,
      limitations,
      additionalNotes
    } = preferences;

    return `
      Please create a personalized workout plan with the following preferences:
      
      Fitness Goal: ${fitnessGoal}
      Experience Level: ${experienceLevel}
      Workout Days Per Week: ${workoutDaysPerWeek}
      Workout Duration: ${workoutDuration} minutes per session
      Available Days: ${availableDays.join(', ')}
      Preferred Workout Types: ${preferredWorkoutTypes.join(', ')}
      Equipment Access: ${equipmentAccess}
      ${limitations ? `Limitations/Injuries: ${limitations}` : 'No specific limitations or injuries.'}
      ${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}
      
      Please provide a detailed workout plan following the JSON format specified in your instructions, with specific exercises, sets, reps, and a weekly schedule.
    `;
  }

  /**
   * Get system prompt for OpenAI to output in the desired JSON format
   * @returns {String} - System prompt
   */
  getSystemPrompt() {
    return `
      You are a professional fitness trainer specialized in creating personalized workout plans.
      Create a workout plan based on user preferences and return it in the following JSON format ONLY:

      {
        "workoutPlan": {
          "metadata": {
            "name": "Custom Fitness Plan",
            "goal": "[User's Goal]",
            "fitnessLevel": "[User's Experience Level]",
            "durationWeeks": 4,
            "createdAt": "[Current Date in ISO Format]"
          },
          "overview": {
            "description": "[Brief description of the program]",
            "weeklyStructure": "[Overall structure]",
            "recommendedEquipment": ["[Equipment Item 1]", "[Equipment Item 2]", "..."],
            "estimatedTimePerSession": "[Duration] minutes"
          },
          "schedule": [
            {
              "week": 1,
              "days": [
                {
                  "dayOfWeek": "[Day name]",
                  "workoutType": "[Type]",
                  "focus": "[Focus area]",
                  "duration": [Duration in minutes],
                  "exercises": [
                    {
                      "name": "[Exercise name]",
                      "category": "[Category]",
                      "targetMuscles": ["[Muscle 1]", "[Muscle 2]", "..."],
                      "sets": [Number],
                      "reps": [Number],
                      "weight": "[Description or blank]",
                      "restBetweenSets": [Seconds],
                      "notes": "[Optional notes]",
                      "alternatives": ["[Alt 1]", "[Alt 2]", "..."]
                    }
                    // More exercises...
                  ],
                  "warmup": {
                    "duration": [Minutes],
                    "description": "[Description]"
                  },
                  "cooldown": {
                    "duration": [Minutes],
                    "description": "[Description]"
                  }
                },
                // Or if it's a rest day:
                {
                  "dayOfWeek": "[Day name]",
                  "isRestDay": true,
                  "recommendations": "[Optional light activities]"
                }
                // More days...
              ]
            }
            // Additional weeks...
          ],
          "nutrition": {
            "generalGuidelines": "[Brief nutrition advice]",
            "dailyProteinGoal": "[Recommendation]",
            "mealTimingRecommendation": "[Recommendation]"
          },
          "progressionPlan": {
            "weeklyAdjustments": [
              {
                "week": 2,
                "adjustments": "[Description of changes]"
              }
              // More weeks...
            ]
          },
          "additionalNotes": "[Any other important information]"
        }
      }

      Important:
      1. Your response MUST be valid JSON only with no additional text.
      2. Include at least 3-4 exercises per workout day.
      3. For rest days, use the simplified REST DAY format.
      4. Ensure exercises match the user's equipment access and experience level.
      5. Adapt for any limitations/injuries mentioned.
      6. Include warmup and cooldown recommendations.
      7. Create a reasonable progression plan across weeks.
      8. DO NOT include any explanations or text outside the JSON structure.
    `;
  }
}

module.exports = new AIService();
