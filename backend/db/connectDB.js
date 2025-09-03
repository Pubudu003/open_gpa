import mongoose from "mongoose";
import AsyncRetry from "async-retry";

export const connectDB = async () => {
  // Set mongoose to use strict query mode
  mongoose.set("strictQuery", true);

  // Define connection options
  const connectionOptions = {
    userNewUrlParser: true, // Ensure compatibility with new MongoDB drivers
    userUnifiedTopology: true, // Use new topology engine
    serverSelectionTimeoutMS: 5000, // Timeout for server selection (5 seconds)
    connectTimeoutMS: 10000, // Timeout for initial connection ( 10 seconds )
  };

  try {
    await AsyncRetry(
      async () => {
        const conn = await mongoose.connect(env.MONGO_URI, connectionOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
      },
      {
        retries: 3, // Retry up to 3 times
        factor: 2, // Exponential backoff
        minTimeout: 1000, // Start with 1s delay
        maxTimeout: 5000, // Cap delay at 5s
        onRetry: (err) => {
          console.warn(`Connection attempt failed, retrying... Error: ${err}`);
        }
      }
    );
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`, error.stack);
    throw new Error("Database connection failed"); // Throw new error here instead of process.exit
  }

  // Set up connection event listeners
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: error.message`, err.stack);
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });

};