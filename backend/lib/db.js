import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const env = process.env.NODE_ENV || "development";

    const uri =
      env === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    if (!uri) {
      console.log("No MONGO_URI found in environment variables");
    }

    console.log("Using MongoDB URI:", uri);

    if (mongoose.connection.readyState !== 1) {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.log("Error connecting to the DB:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
