import express from 'express';
import {
  uploadTransactions,
  getTransactions,
  exportCSV
} from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Upload transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions uploaded
 *   get:
 *     summary: Get transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 * /transactions/export:
 *   post:
 *     summary: Export transactions as CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV exported
 * /transactions/all:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user transactions
 */

router.post('/', authMiddleware, uploadTransactions);
router.get('/', authMiddleware, getTransactions);
router.post('/export', authMiddleware, exportCSV);

// Get all transactions for the logged-in user
router.get('/all', authMiddleware, async (req, res): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const transactions = await require('../models/Transactions').default.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: (error as Error).message });
  }
});

export default router;