import mongoose, { type Connection, type Model } from "mongoose";

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  }
  return uri;
}

// For the website: open a connection, run `fn`, then close it.
// Cloudflare Workers can't reuse a connection opened during an earlier visit
// (the next visit hangs), so every request gets its own short-lived connection.
// Usage: const cls = await withDB((db) => db.model(ClassModel).findOne());
export async function withDB<T>(
  fn: (db: { model: <M>(model: Model<M>) => Model<M> }) => Promise<T>,
): Promise<T> {
  const conn = await mongoose
    .createConnection(getUri(), {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 10_000,
    })
    .asPromise();
  try {
    return await fn({ model: (m) => bindModel(conn, m) });
  } finally {
    await conn.close();
  }
}

// Models in models/ are defined once; this attaches one to this request's connection.
function bindModel<M>(conn: Connection, model: Model<M>): Model<M> {
  return (conn.models[model.modelName] ??
    conn.model(model.modelName, model.schema)) as Model<M>;
}

// For Node scripts (npm run seed): one shared connection for the whole run.
// Don't use this in pages or API routes; it hangs on Cloudflare (see withDB).
const cache = globalThis as unknown as {
  mongoosePromise?: Promise<typeof mongoose>;
};

export function connectDB() {
  cache.mongoosePromise ??= mongoose.connect(getUri()).catch((error) => {
    cache.mongoosePromise = undefined; // allow a retry on the next call
    throw error;
  });
  return cache.mongoosePromise;
}
