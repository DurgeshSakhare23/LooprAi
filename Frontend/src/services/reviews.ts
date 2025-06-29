import api from './api';

export interface Review {
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt?: string;
}

export const fetchReviews = async (): Promise<Review[]> => {
  const res = await api.get('/reviews');
  return res.data;
};

export const addReview = async (review: Omit<Review, '_id' | 'createdAt'>): Promise<Review> => {
  const res = await api.post('/reviews', review);
  return res.data;
};
