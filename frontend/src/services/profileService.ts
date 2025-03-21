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

const getUserId = (): string | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.id || null;
};


/**
 * Retrieves the current user's profile.
 * Endpoint: GET /api/users/profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found. Please log in.");

    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Updates the current user's profile.
 * Endpoint: PUT /api/users/profile
 */
export const updateUserProfile = async (profileData: ProfileUpdateData): Promise<UserProfile> => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found. Please log in.");

    const formattedData = {
      ...profileData,
      dateOfBirth: profileData.dateOfBirth instanceof Date 
        ? formatISO(profileData.dateOfBirth) 
        : profileData.dateOfBirth,
    };
    const response = await api.put(`/users/profile/${userId}`, formattedData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};



