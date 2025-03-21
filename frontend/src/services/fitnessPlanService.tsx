// src/services/fitnessPlanService.ts
import axios from 'axios';
import { getAuthToken } from './authService';

export interface FitnessPlan {
  id: string;
  userId: string;
  planDetails: any;
  createdAt: string;
  updatedAt: string;
}

const getUserId = (): string | null => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || null;
  };

export const fetchFitnessPlans = async (): Promise<FitnessPlan[]> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found. Please log in.");

  try {
    // GET /api/fitnessPlan should return all plans for the current user
    const response = await axios.get(`/api/fitnessPlan/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching fitness plans:', error);
    throw error;
  }
};

export const deleteFitnessPlan = async (planId: string): Promise<void> => {
  try {
    await axios.delete(`/api/fitnessPlan/${planId}`);
  } catch (error: any) {
    console.error('Error deleting fitness plan:', error);
    throw error;
  }
};


export const fetchFitnessPlanById = async (planId: string): Promise<FitnessPlan> => {
    try {
      const token = getAuthToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`/api/fitnessPlan/getPlanById/${planId}`, config);
      console.log("returned plan: ", response);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching fitness plan by id:', error);
      throw error;
    }
  };