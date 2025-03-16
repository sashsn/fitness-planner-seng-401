import api from './api';
import { formatISO } from 'date-fns';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number;
  bmiCategory?: string;
  age?: number;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | Date | null;
  height?: number | null;
  weight?: number | null;
  username?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Get user profile
 * @returns Promise with user profile data
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/users/profile');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    throw new Error(error.message || 'Failed to load profile data');
  }
};

/**
 * Update user profile
 * @param data Profile data to update
 * @returns Promise with updated user profile
 */
export const updateProfile = async (data: ProfileUpdateData): Promise<UserProfile> => {
  // Format date for backend if present
  const formattedData = {
    ...data,
    dateOfBirth: data.dateOfBirth instanceof Date 
      ? data.dateOfBirth.toISOString().split('T')[0] 
      : data.dateOfBirth
  };
  
  try {
    const response = await api.put('/users/profile', formattedData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Change user password
 * @param data Password change data
 * @returns Promise with success message
 */
export const changePassword = async (data: PasswordChangeData): Promise<string> => {
  try {
    const response = await api.post('/users/change-password', data);
    return response.data.message;
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Delete user account
 * @returns Promise with success message
 */
export const deleteAccount = async (): Promise<string> => {
  try {
    const response = await api.delete('/users/account');
    return response.data.message;
  } catch (error: any) {
    console.error('Error deleting account:', error);
    throw new Error(error.message || 'Failed to delete account');
  }
};

/**
 * Calculate BMI from height and weight
 * @param height Height in cm
 * @param weight Weight in kg
 * @returns BMI value
 */
export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
};

/**
 * Get BMI category
 * @param bmi BMI value
 * @returns BMI category description
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
};
