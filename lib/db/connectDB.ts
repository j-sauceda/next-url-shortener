import bcrypt from "bcrypt";
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const URI = process.env.MONGO_URI!;
    const db = await mongoose.connect(URI, {
      dbName: "url_shortener",
      maxPoolSize: 10,
    });

    if (db.connection.readyState === 1) {
      isConnected = true;
      console.log("Successfully connected to MongoDB!");
    }
  } catch (err) {
    console.error("MongoDB error: ${err}");
  }
};

export default connectDB;
