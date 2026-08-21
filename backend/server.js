import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import studentRoutes from "./routes/student.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    // In production, FRONTEND_URI will https://my-app.vercel.app
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // For cookie-based authentication
  }),
);

app.use(express.json());
app.use(cookieParser());

/*app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log("Database connection failure", error);
    res.status(500).json({ message: "Database connection failure" });
  }
});*/

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
