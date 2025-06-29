import { Request, Response } from 'express';
import Review from '../models/Review';

// Get all reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Add a new review
export const addReview = async (req: Request, res: Response) => {
  try {
    const { name, role, content, rating, avatar } = req.body;
    const review = new Review({ name, role, content, rating, avatar });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add review' });
  }
};
