import { Request, Response, RequestHandler } from 'express';
import Transaction from '../models/Transactions';
import { createCSV } from '../utils/csvGenerator';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const uploadTransactions: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const transactions = req.body;

    if (!Array.isArray(transactions)) {
      res.status(400).json({ message: "Invalid format, expected array" });
      return;
    }

    const formattedData = transactions.map((t) => ({
      date: t.date,
      amount: t.amount,
      category: t.category,
      status: t.status || 'pending', // default if missing
      user_profile: t.user_profile || '', // default if missing
      user_id: userId,
      user: userId,
    }));

    await Transaction.insertMany(formattedData);

    res.status(201).json({ message: "Transactions uploaded successfully" });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Failed to upload transactions" });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      status,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = req.query;

    const userId = (req as AuthenticatedRequest).user?.userId;
    const query: any = { user: userId };

    if (category) query.category = category;
    if (status) query.status = status;

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount as string);
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const exportCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fields, transactionIds } = req.body;

    if (!fields || !Array.isArray(fields)) {
      res.status(400).json({ message: 'Fields must be an array' });
      return;
    }

    let transactions;
    if (transactionIds && Array.isArray(transactionIds) && transactionIds.length > 0) {
      transactions = await Transaction.find({ _id: { $in: transactionIds } });
    } else {
      transactions = await Transaction.find();
    }
    // Convert Mongoose documents to plain objects and ensure all Date/ObjectId fields are strings
    const plainTransactions = transactions.map(txn => {
      const obj = txn.toObject() as Record<string, unknown>;
      const result: Record<string, string | number | boolean | null> = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value instanceof Date) {
          result[key] = value.toISOString();
        } else if (typeof value === 'object' && value && typeof (value as any).toString === 'function') {
          // Convert ObjectId and similar types to string
          result[key] = value.toString();
        } else if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null
        ) {
          result[key] = value;
        } else {
          result[key] = value ? value.toString() : '';
        }
      });
      return result;
    });
    const filePath = await createCSV(plainTransactions, fields);
    res.download(filePath);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};