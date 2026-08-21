import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    const env = process.env.NODE_ENV || "development";

    const uri =
      env === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    if (!uri) {
      console.log("No MONGO_URI found in environment variables");
    }

    const conn = await mongoose.connect(uri, {
      connectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to the DB:", error.message);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
