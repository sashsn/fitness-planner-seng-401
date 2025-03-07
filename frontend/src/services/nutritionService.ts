import api from './api';
import { formatISO } from 'date-fns';

export interface Meal {
  id?: string;
  name: string;
  date: string | Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  description?: string;
  notes?: string;
}

export interface NutritionSummary {
  summary: {
    totalDays: number;
    totalMeals: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    dailyAverageCalories: number;
    dailyAverageProtein: number;
    dailyAverageCarbs: number;
    dailyAverageFat: number;
  };
  dailyBreakdown: Array<{
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
  }>;
}

/**
 * Get all meals for the current user
 * @returns Promise with array of meals
 */
export const getUserMeals = async (): Promise<Meal[]> => {
  const response = await api.get('/nutrition/meals');
  return response.data;
};

/**
 * Get a specific meal by ID
 * @param id Meal ID
 * @returns Promise with meal data
 */
export const getMealById = async (id: string): Promise<Meal> => {
  const response = await api.get(`/nutrition/meals/${id}`);
  return response.data;
};

/**
 * Create a new meal entry
 * @param mealData Meal data
 * @returns Promise with created meal
 */
export const createMeal = async (mealData: Meal): Promise<Meal> => {
  const formattedData = {
    ...mealData,
    date: mealData.date instanceof Date 
      ? formatISO(mealData.date) 
      : mealData.date
  };
  
  const response = await api.post('/nutrition/meals', formattedData);
  return response.data;
};

/**
 * Update a meal entry
 * @param id Meal ID
 * @param mealData Updated meal data
 * @returns Promise with updated meal
 */
export const updateMeal = async (id: string, mealData: Meal): Promise<Meal> => {
  const formattedData = {
    ...mealData,
    date: mealData.date instanceof Date 
      ? formatISO(mealData.date) 
      : mealData.date
  };
  
  const response = await api.put(`/nutrition/meals/${id}`, formattedData);
  return response.data;
};

/**
 * Delete a meal entry
 * @param id Meal ID
 * @returns Promise
 */
export const deleteMeal = async (id: string): Promise<void> => {
  await api.delete(`/nutrition/meals/${id}`);
};

/**
 * Get nutrition summary for a date range
 * @param startDate Optional start date
 * @param endDate Optional end date
 * @returns Promise with nutrition summary
 */
export const getNutritionSummary = async (
  startDate?: string,
  endDate?: string
): Promise<NutritionSummary> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/nutrition/summary?${params.toString()}`);
  return response.data;
};
