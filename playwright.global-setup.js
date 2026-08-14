import dotenv from "dotenv";
import { connectDB } from "./backend/lib/db.js";

const globalSetup = async () => {
  dotenv.config();
  process.env.NODE_ENV = "test";
  await connectDB();
  console.log("Connected to MongoDB TEST");
};

export default globalSetup;
