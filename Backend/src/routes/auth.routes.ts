import express from 'express';
import { login, register, getProfile } from '../controllers/auth.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';
import User from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User registered
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     responses:
 *       200:
 *         description: User logged in
 */

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, async (req, res): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { email, password, profilePicture, financialGoal } = req.body;
    const update: any = {};
    if (email) update.email = email;
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    if (profilePicture !== undefined) update.profilePicture = profilePicture;
    if (financialGoal !== undefined) update.financialGoal = financialGoal;
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
