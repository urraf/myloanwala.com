import mongoose from "mongoose";

// Cache the connection across hot reloads / requests
const g = globalThis as unknown as { _mongoose?: Promise<typeof mongoose> };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");
  if (!g._mongoose) {
    g._mongoose = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }).catch((err) => {
      g._mongoose = undefined;
      throw err;
    });
  }
  return g._mongoose;
}
