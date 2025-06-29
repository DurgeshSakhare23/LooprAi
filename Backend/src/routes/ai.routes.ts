import axios from 'axios';
import express from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Transactions from '../models/Transactions';

const router = express.Router();

/**
 * @swagger
 * /ai/ask:
 *   post:
 *     summary: Ask AI a financial question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 */

// POST /api/ai/ask
router.post('/ask', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ message: 'Question is required' });
      return;
    }

    // Fetch user data
    const user = await User.findById(userId);
    // Get only the 10 most recent transactions
    const transactions = await Transactions.find({ user: userId }).sort({ date: -1 }).limit(12);

    // Summarize or format data for the prompt
    let summary = '';
    if (user) {
      summary = `User: ${user.email}\nAll transaction amounts are in Indian Rupees (\u20B9/INR).\nShowing up to 10 most recent transactions.\nTransaction History:\n` +
        transactions.map(t => `- ${t.category} \u20B9${t.amount} on ${t.date.toISOString().split('T')[0]}`).join('\n');
    } else {
      summary = 'User data unavailable.';
    }

    // Prepare system prompt for chart output
    const systemPrompt = `You are a financial data analysis assistant.\n\nAll amounts are in Indian Rupees (\u20B9/INR).\nWhen the user asks for a chart, respond ONLY with a JSON object like:\n{\"type\":\"bar\",\"labels\":[\"A\",\"B\"],\"data\":[10,20],\"title\":\"Sample Chart\"}\nIf the user asks for a pie chart, use {\"type\":\"pie\", ...}.\nIf the user does not ask for a chart, answer normally as text.`;

    // Prepare prompt
    const prompt = `${summary}\n\nUser question: ${question}`;

    // Call Groq API (server-side, keep key secret!)
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 512,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ answer: groqRes.data.choices[0].message.content.trim() });
  } catch (err: any) {
    if (err.response) {
      // Log Groq API error details
      console.error('Groq API error:', err.response.status, err.response.data);
      res.status(500).json({ message: err.response.data || 'AI error', status: err.response.status });
    } else {
      // Log generic error
      console.error('AI route error:', err.message);
      res.status(500).json({ message: err.message || 'AI error' });
    }
  }
});

export default router;