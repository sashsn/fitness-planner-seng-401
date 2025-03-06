/**
 * Form validation schemas
 */
import * as Yup from 'yup';

// Login form validation schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

// Registration form validation schema
export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  dateOfBirth: Yup.date().nullable().max(new Date(), 'Date of birth cannot be in the future'),
  height: Yup.number().positive('Height must be positive').nullable(),
  weight: Yup.number().positive('Weight must be positive').nullable(),
});

// Profile update form validation schema
export const profileUpdateSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  email: Yup.string()
    .email('Invalid email address'),
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  dateOfBirth: Yup.date().nullable().max(new Date(), 'Date of birth cannot be in the future'),
  height: Yup.number().positive('Height must be positive').nullable(),
  weight: Yup.number().positive('Weight must be positive').nullable(),
});

// Workout form validation schema
export const workoutSchema = Yup.object({
  name: Yup.string().required('Workout name is required'),
  description: Yup.string().nullable(),
  date: Yup.date().required('Date is required'),
  duration: Yup.number().integer().min(0, 'Duration cannot be negative').nullable(),
  caloriesBurned: Yup.number().min(0, 'Calories cannot be negative').nullable(),
  workoutType: Yup.string().oneOf(['cardio', 'strength', 'flexibility', 'balance', 'other']).required('Type is required'),
  isCompleted: Yup.boolean(),
});

// Exercise form validation schema
export const exerciseSchema = Yup.object({
  name: Yup.string().required('Exercise name is required'),
  description: Yup.string().nullable(),
  sets: Yup.number().integer().min(0).nullable(),
  reps: Yup.number().integer().min(0).nullable(),
  weight: Yup.number().min(0).nullable(),
  duration: Yup.number().integer().min(0).nullable(),
  distance: Yup.number().min(0).nullable(),
  restTime: Yup.number().integer().min(0).nullable(),
  notes: Yup.string().nullable(),
});

// Meal form validation schema
export const mealSchema = Yup.object({
  name: Yup.string().required('Meal name is required'),
  date: Yup.date().required('Date is required'),
  mealType: Yup.string().oneOf(['breakfast', 'lunch', 'dinner', 'snack']).required('Meal type is required'),
  calories: Yup.number().min(0).nullable(),
  protein: Yup.number().min(0).nullable(),
  carbs: Yup.number().min(0).nullable(),
  fat: Yup.number().min(0).nullable(),
  description: Yup.string().nullable(),
  notes: Yup.string().nullable(),
});

// Fitness goal form validation schema
export const goalSchema = Yup.object({
  name: Yup.string().required('Goal name is required'),
  description: Yup.string().nullable(),
  goalType: Yup.string().oneOf(['weight', 'strength', 'endurance', 'nutrition', 'other']).required('Goal type is required'),
  targetValue: Yup.number().required('Target value is required'),
  currentValue: Yup.number().nullable(),
  unit: Yup.string().nullable(),
  startDate: Yup.date().required('Start date is required'),
  targetDate: Yup.date().min(Yup.ref('startDate'), 'Target date must be after start date').nullable(),
  isCompleted: Yup.boolean(),
});
