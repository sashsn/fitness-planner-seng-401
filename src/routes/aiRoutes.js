/**
 * AI Routes
 * Defines API endpoints for AI-powered features like workout generation
 */
const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const aiController = require('../controllers/aiController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Use appropriate auth middleware based on environment:
 * - Required auth in production
 * - Optional auth in development
 */
const authMiddleware = process.env.NODE_ENV === 'production' 
  ? [auth]
  : [optionalAuth];

/**
 * @route POST /api/ai/workout
 * @description Generate a personalized workout plan using AI
 * @access Private or Optional in development
 */
router.post('/workout', authMiddleware, asyncHandler(aiController.generateWorkout));

/**
 * @route GET /api/ai/workout/status/:jobId
 * @description Get the status of a workout generation job
 * @access Private or Optional in development
 */
router.get('/workout/status/:jobId', authMiddleware, asyncHandler(aiController.getJobStatus));

/**
 * @route GET /api/ai/workout/result/:jobId
 * @description Get the result of a completed workout generation job
 * @access Private
 */
router.get('/workout/result/:jobId', authMiddleware, asyncHandler(aiController.getJobResult));

/**
 * @route DELETE /api/ai/workout/cancel/:jobId
 * @description Cancel a workout generation job
 * @access Private
 */
router.delete('/workout/cancel/:jobId', authMiddleware, asyncHandler(aiController.cancelJob));

/**
 * @route GET /api/ai/health
 * @description Check if the AI service is available
 * @access Public
 */
router.get('/health', asyncHandler(aiController.getHealth));

module.exports = router;
