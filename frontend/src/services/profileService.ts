import api from './api';
import { formatISO } from 'date-fns';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  role: string;
  isActive: boolean;
}

export interface ProfileUpdateData {
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | Date | null;
  height?: number;
  weight?: number;
  email?: string;
}

/**
 * Get user profile
 * @returns Promise with user profile data
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * Update user profile
 * @param profileData Updated profile data
 * @returns Promise with updated profile
 */
export const updateUserProfile = async (profileData: ProfileUpdateData): Promise<UserProfile> => {
  const formattedData = {
    ...profileData,
    dateOfBirth: profileData.dateOfBirth instanceof Date 
      ? formatISO(profileData.dateOfBirth) 
      : profileData.dateOfBirth
  };
  
  const response = await api.put('/users/profile', formattedData);
  return response.data;
};

/**
 * Delete user account
 * @returns Promise
 */
export const deleteUserAccount = async (): Promise<void> => {
  await api.delete('/users/profile');
};
