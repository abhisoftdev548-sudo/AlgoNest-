import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

/** Connect once at process start. Fatal on failure — never serve without a DB. */
export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 20,
      minPoolSize: 2,
      retryWrites: true,
    });
    // eslint-disable-next-line no-console
    console.info(`[db] connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] connection failed:', error.message);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    // eslint-disable-next-line no-console
    console.info('[db] disconnected');
  }
}
