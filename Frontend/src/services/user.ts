import api from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  profilePicture?: string;
  financialGoal?: number;
  createdAt?: string;
}

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const res = await api.get('/auth/profile');
    return res.data;
  } catch (error) {
    return null;
  }
};
