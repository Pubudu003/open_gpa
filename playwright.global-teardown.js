import dotenv from "dotenv";
import { disconnectDB } from "./backend/lib/db.js";

const globalTeardown = async () => {
  dotenv.config();
  await disconnectDB();
  console.log("Disconnected from MongoDB TEST");
};

export default globalTeardown;
