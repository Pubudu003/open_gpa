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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:" + PORT);
});

