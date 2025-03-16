/**
 * AI Controller
 * Handles AI integration and workout generation
 */
const { v4: uuidv4 } = require('uuid');
const llmService = require('../services/llmService');
const logger = require('../utils/logger');
const workoutService = require('../services/workoutService');
const workoutJobQueue = require('../services/workoutJobQueue');
const { ApiError } = require('../utils/errors');

/**
 * Generate a workout plan with AI
 * Creates a job and returns job ID for polling
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.generateWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'test-user';  // Use test-user in dev mode
    const preferences = req.body;
    
    // Input validation
    if (!preferences || !preferences.fitnessGoal || !preferences.experienceLevel) {
      throw new ApiError(400, 'Invalid preferences: fitnessGoal and experienceLevel are required');
    }
    
    // Generate unique ID for this job
    const jobId = uuidv4();
    
    // Respond immediately with jobId
    res.status(202).json({
      success: true,
      message: 'Workout generation job started',
      jobId
    });
    
    // Then add job to queue (after response is sent)
    workoutJobQueue.addJob(jobId, { preferences, userId }, async (data, progressCallback) => {
      try {
        // This function will be executed asynchronously by the job queue
        progressCallback(5, 'Starting workout generation');
        
        // Get the preferences from the job data
        const { preferences, userId } = data;
        
        // Log the request for debugging purposes
        logger.debug(`Processing workout generation for user: ${userId}`);
        
        // Create the prompt with the preferences
        progressCallback(20, 'Creating workout plan request');
        
        // Generate the workout plan with LLM
        progressCallback(30, 'Sending request to AI model');
        logger.debug('Sending request to LLM for workout generation');
        
        // Use Promise.race for better timeout handling
        let workoutPlan;
        try {
          const llmPromise = llmService.generateWorkoutPlan(preferences);
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Workout generation timed out')), 45000);
          });
          
          // Race the two promises
          progressCallback(40, 'Waiting for AI response...');
          workoutPlan = await Promise.race([llmPromise, timeoutPromise]);
          progressCallback(70, 'Processing AI response');
        } catch (error) {
          logger.error(`Error during workout generation: ${error.message}`);
          progressCallback(75, 'Handling error, creating fallback plan');
          
          // Create a very basic fallback plan using the preferences
          workoutPlan = {
            workoutPlan: {
              metadata: {
                name: `${preferences.fitnessGoal || 'Custom'} Workout Plan`,
                goal: preferences.fitnessGoal || "General fitness",
                fitnessLevel: preferences.experienceLevel || "Beginner",
                durationWeeks: 4,
                createdAt: new Date().toISOString()
              },
              overview: {
                description: `A ${preferences.fitnessGoal || 'custom'} workout plan for ${preferences.experienceLevel || 'beginner'} level.`,
                weeklyStructure: `${preferences.workoutDaysPerWeek || 3} days per week`,
                recommendedEquipment: ["Minimal equipment needed"],
                estimatedTimePerSession: `${preferences.workoutDuration || 30} minutes`
              },
              // Simplified schedule with one week and basic exercises
              schedule: [
                {
                  week: 1,
                  days: [
                    {
                      dayOfWeek: preferences.availableDays ? preferences.availableDays[0] : "Monday",
                      workoutType: preferences.preferredWorkoutTypes ? preferences.preferredWorkoutTypes[0] : "Full Body",
                      focus: "Strength",
                      duration: preferences.workoutDuration || 30,
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
                      ]
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
                weeklyAdjustments: []
              },
              additionalNotes: "This is a basic plan created due to an error with the AI generation."
            }
          };
        }
        
        // Validate the workout plan structure - if invalid, use a fallback
        if (!workoutPlan || !workoutPlan.workoutPlan || !workoutPlan.workoutPlan.metadata) {
          logger.error('Invalid workout plan structure');
          throw new Error('Invalid workout plan structure received from AI service');
        }
        
        progressCallback(90, 'Finalizing workout plan');
        
        // Return the generated plan
        progressCallback(100, 'Workout plan ready');
        
        // Return a lightweight version to prevent excessive data transfer
        return { 
          workoutPlan: {
            metadata: workoutPlan.workoutPlan.metadata,
            overview: workoutPlan.workoutPlan.overview,
            schedule: workoutPlan.workoutPlan.schedule ? 
              workoutPlan.workoutPlan.schedule.slice(0, 4) : [], // Limit to 4 weeks max
            nutrition: workoutPlan.workoutPlan.nutrition || {},
            progressionPlan: workoutPlan.workoutPlan.progressionPlan || {},
            additionalNotes: workoutPlan.workoutPlan.additionalNotes || ''
          }
        };
      } catch (error) {
        logger.error(`Error in workout generation job: ${error.message}`);
        
        // Always return a valid workout plan structure even on errors
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
              description: "A simple workout plan generated after encountering an error.",
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
                    ]
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
              weeklyAdjustments: []
            },
            additionalNotes: "This is a fallback plan due to an error. Please try again."
          }
        };
      }
    });
    
    // Log the job start
    logger.info(`Started workout generation job ${jobId} for user ${userId}`);
    
  } catch (error) {
    logger.error(`Error starting workout generation: ${error.message}`);
    return next(error);
  }
};

/**
 * Check the status of a workout generation job
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getJobStatus = (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      throw new ApiError(400, 'Job ID is required');
    }
    
    // Get job status from queue
    const status = workoutJobQueue.getJobStatus(jobId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      status: status.status,
      progress: status.progress,
      error: status.error
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the result of a completed workout generation job
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getJobResult = (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      throw new ApiError(400, 'Job ID is required');
    }
    
    // Get job status from queue
    const status = workoutJobQueue.getJobStatus(jobId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (status.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Job is not complete. Current status: ${status.status}`,
        status: status.status,
        progress: status.progress
      });
    }
    
    res.status(200).json(status.result);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a workout generation job
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.cancelJob = (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      throw new ApiError(400, 'Job ID is required');
    }
    
    // Try to cancel the job
    const canceled = workoutJobQueue.cancelJob(jobId);
    
    if (canceled) {
      return res.status(200).json({
        success: true,
        message: 'Job canceled successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Job could not be canceled. It may be completed, failed, or not found.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get the health status of the AI service
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getHealth = async (req, res, next) => {
  try {
    // Get queue stats
    const queueStats = workoutJobQueue.getStats();
    
    // Check LLM health (with short timeout)
    let llmHealth;
    try {
      llmHealth = await llmService.checkHealth();
    } catch (error) {
      llmHealth = {
        available: false,
        error: error.message
      };
    }
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      queue: queueStats,
      llm: llmHealth
    });
  } catch (error) {
    next(error);
  }
};
