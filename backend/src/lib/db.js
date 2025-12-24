import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://chatuser:rrwkE6cF7iEwnfHv@cluster0.d9myoro.mongodb.net/chatapp?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
