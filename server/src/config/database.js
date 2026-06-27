import mongoose from 'mongoose';

export const dbState = {
  mode: 'memory'
};

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI not set. Using in-memory demo storage.');
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    });
    dbState.mode = 'mongo';
    console.log(`Connected to MongoDB Atlas database: ${mongoose.connection.name}`);
  } catch (error) {
    dbState.mode = 'memory';
    console.error(`MongoDB connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.warn('Falling back to in-memory demo storage for local development.');
  }
}
