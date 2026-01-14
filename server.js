import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import workshopRoutes from "./routes/workshops.js";

dotenv.config();

const app = express();

// ------------------------
// MIDDLEWARES
// ------------------------
app.use(cors());
app.use(express.json());

// ------------------------
// ROUTES
// ------------------------
app.use("/api/workshops", workshopRoutes);

// ------------------------
// MONGODB CONNECTION
// ------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ------------------------
// SERVER
// ------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Arsura Workshop API running on port ${PORT}`);
});
