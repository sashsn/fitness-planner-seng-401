import api from './api';
import { formatISO } from 'date-fns';

export interface FitnessGoal {
  id?: string;
  name: string;
  description?: string;
  goalType: 'weight' | 'strength' | 'endurance' | 'nutrition' | 'other';
  targetValue: number;
  currentValue?: number;
  unit?: string;
  startDate: string | Date;
  targetDate?: string | Date | null;
  isCompleted: boolean;
}

export interface GoalProgress {
  currentValue: number;
  progressPercentage?: number;
  remainingDays?: number;
}

/**
 * Get all fitness goals for the current user
 * @returns Promise with array of fitness goals
 */
export const getUserGoals = async (): Promise<FitnessGoal[]> => {
  const response = await api.get('/goals');
  return response.data;
};

/**
 * Get a specific fitness goal by ID
 * @param id Goal ID
 * @returns Promise with goal data
 */
export const getGoalById = async (id: string): Promise<FitnessGoal> => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

/**
 * Create a new fitness goal
 * @param goalData Goal data
 * @returns Promise with created goal
 */
export const createGoal = async (goalData: FitnessGoal): Promise<FitnessGoal> => {
  const formattedData = {
    ...goalData,
    startDate: goalData.startDate instanceof Date 
      ? formatISO(goalData.startDate) 
      : goalData.startDate,
    targetDate: goalData.targetDate instanceof Date 
      ? formatISO(goalData.targetDate) 
      : goalData.targetDate
  };
  
  const response = await api.post('/goals', formattedData);
  return response.data;
};

/**
 * Update a fitness goal
 * @param id Goal ID
 * @param goalData Updated goal data
 * @returns Promise with updated goal
 */
export const updateGoal = async (id: string, goalData: FitnessGoal): Promise<FitnessGoal> => {
  const formattedData = {
    ...goalData,
    startDate: goalData.startDate instanceof Date 
      ? formatISO(goalData.startDate) 
      : goalData.startDate,
    targetDate: goalData.targetDate instanceof Date 
      ? formatISO(goalData.targetDate) 
      : goalData.targetDate
  };
  
  const response = await api.put(`/goals/${id}`, formattedData);
  return response.data;
};

/**
 * Delete a fitness goal
 * @param id Goal ID
 * @returns Promise
 */
export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

/**
 * Update goal progress
 * @param id Goal ID
 * @param progress Progress data
 * @returns Promise with updated goal
 */
export const updateGoalProgress = async (
  id: string,
  progress: GoalProgress
): Promise<FitnessGoal & { progressPercentage: number; remainingDays?: number }> => {
  const response = await api.patch(`/goals/${id}/progress`, progress);
  return response.data;
};
