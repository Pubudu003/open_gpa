import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { cleanEnv, port, str } from "envalid"; // for env validation

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";

// Load and validate environment variables
dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port({ default: 5000 }), // Validate PORT with default
    MONGO_URI: str(), // Validate MONGO_URI
})

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Graceful shutdown
const server = app.listen(PORT, async () => {
    try {
        await connectDB(); // Connect to DB before starting the server
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        console.error("Failed to connect to the database:", err);
        process.exit(1); // Exit if the DB connection fails
    }
})

