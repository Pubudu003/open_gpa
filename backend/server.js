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
  JWT_SECRET: str(),
  FRONTEND_URL: str(),
  NODE_ENV: str({ choices: ["development", "production"] }),
  SENDGRID_API_KEY: str({ default: "" }),
  RATE_LIMIT_WINDOW_MS: num({ default: 15 * 60 * 1000 }), // 15 minutes
  RATE_LIMIT_MAX: num({ default: 10 }),
  //EMAIL_HOST: str({ default: "smtp.gmail.com" }),
  //EMAIL_PORT: port({ default: 587 }),
  //EMAIL_USER: str({ default: "" }),
  //EMAIL_PASS: str({ default: "" }),
});

const app = express();
const PORT = env.PORT;

// Middleware
app.use(helmet()); // Set secure HTTP headers
app.use(
  cors({
    origin: env.NODE_ENV === "production"
      ? ["https//my-frontend-app.com"] // Allow only production frontend URL
      : [env.FRONTEND_URL], // Allow localhost for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true, // If need to send cookies
  })
);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev")); // Log HTTP requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

// Graceful shutdown
const startServer = async () => {
  try {
    await connectDB(); // Connect to DB before starting the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} in ${env.NODE_ENV} mode`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();