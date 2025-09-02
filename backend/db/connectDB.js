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
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connection to MongoDB");
        process.exit(1);
    }
};