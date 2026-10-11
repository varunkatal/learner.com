import mongoose from "mongoose";

// Reuse one connection across requests and hot reloads instead of opening a new one each time.
const cache = globalThis as unknown as {
  mongoosePromise?: Promise<typeof mongoose>;
};

export function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  }
  cache.mongoosePromise ??= mongoose.connect(uri).catch((error) => {
    cache.mongoosePromise = undefined; // allow a retry on the next call
    throw error;
  });
  return cache.mongoosePromise;
}
