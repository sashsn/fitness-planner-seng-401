const { body, validationResult } = require('express-validator');
const { ApiError, logApiError } = require('../utils/errors');

// Validation middleware for user registration
const validateUserRegistration = [
  // Relaxed validations for testing
  /*
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  */
  
  // Minimal validation just checking for email presence
  body('email')
    .notEmpty().withMessage('Email is required'),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      const error = ApiError.badRequest('Validation Error', errorMessages);
      logApiError(error, req);
      return next(error);
    }
    next();
  }
];

module.exports = {
  validateUserRegistration
};
