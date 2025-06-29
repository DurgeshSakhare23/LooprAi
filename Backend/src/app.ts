// backend/src/index.ts
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
import aiRoutes from "./routes/ai.routes";
import reviewRoutes from "./routes/review.routes";
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://looprai-2.onrender.com', // or use an array for multiple origins
  credentials: true
}));
// Increase JSON body size limit to 10mb for large payloads (e.g., base64 images)
app.use(express.json({ limit: '10mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not set in .env");
}

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

