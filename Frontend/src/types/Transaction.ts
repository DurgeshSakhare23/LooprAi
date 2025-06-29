// src/types/Transaction.ts
export interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_profile: string;
  user_id: string;
  user: string;
}
