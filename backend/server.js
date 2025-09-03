import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; // for secure HTTP headers
import morgan from "morgan"; // for request logging
import { cleanEnv, port, str } from "envalid"; // for env validation

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";

// Load and validate environment variables
dotenv.config();
const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }), // Validate PORT with default
  MONGO_URI: str(), // Validate MONGO_URI
});

const app = express();
const PORT = env.PORT;

// Middleware
app.use(helmet()); // Set secure HTTP headers
app.use(
  cors({
    origin: env.isProduction
      ? ["https//my-frontend-app.com"] // Allow only production frontend URL
      : [env.FRONTEND_URL], // Allow localhost for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true, // If need to send cookies
  })
);
app.use(morgan("dev")); // Log HTTP requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Graceful shutdown
const server = app.listen(PORT, async () => {
  try {
    await connectDB(); // Connect to DB before starting the server
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit if the DB connection fails
  }
});

// Handle server errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully..");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully..");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
