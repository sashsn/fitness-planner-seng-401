/**
 * Additional type declarations for the workout module
 */

// Define the structure of the AI-generated workout plan
interface WorkoutPlanMetadata {
  name: string;
  goal: string;
  fitnessLevel: string;
  durationWeeks: number;
  createdAt: string;
}

interface WorkoutPlanOverview {
  description: string;
  weeklyStructure: string;
  recommendedEquipment: string[];
  estimatedTimePerSession: string;
}

interface WorkoutExercise {
  name: string;
  category: string;
  targetMuscles: string[];
  sets: number;
  reps: number;
  weight: string;
  restBetweenSets: number;
  notes?: string;
  alternatives?: string[];
}

interface WarmupCooldown {
  duration: number;
  description: string;
}

interface WorkoutDay {
  dayOfWeek: string;
  workoutType?: string;
  focus?: string;
  duration?: number;
  exercises?: WorkoutExercise[];
  warmup?: WarmupCooldown;
  cooldown?: WarmupCooldown;
  isRestDay?: boolean;
  recommendations?: string;
}

interface WorkoutPlanWeek {
  week: number;
  days: WorkoutDay[];
}

interface WorkoutPlanNutrition {
  generalGuidelines: string;
  dailyProteinGoal: string;
  mealTimingRecommendation: string;
}

interface WeeklyAdjustment {
  week: number;
  adjustments: string;
}

interface WorkoutPlanProgression {
  weeklyAdjustments: WeeklyAdjustment[];
}

interface WorkoutPlanData {
  metadata: WorkoutPlanMetadata;
  overview: WorkoutPlanOverview;
  schedule: WorkoutPlanWeek[];
  nutrition: WorkoutPlanNutrition;
  progressionPlan: WorkoutPlanProgression;
  additionalNotes?: string;
}

interface GeneratedWorkoutPlan {
  workoutPlan: WorkoutPlanData;
}

// Extend existing types to include AI-generated content
declare module '../../services/workoutService' {
  interface Workout {
    generatedPlan?: GeneratedWorkoutPlan;
    workoutType: string;
  }
}
