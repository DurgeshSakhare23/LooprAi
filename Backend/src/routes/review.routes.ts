import { Router } from 'express';
import { getReviews, addReview } from '../controllers/review.controller';

const router = Router();

// GET /api/reviews
router.get('/', getReviews);

// POST /api/reviews
router.post('/', addReview);

export default router;
