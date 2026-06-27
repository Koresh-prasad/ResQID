import mongoose from 'mongoose';

export const dbState = {
  mode: 'memory',
  connected: false,
  error: ''
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
    dbState.connected = true;
    dbState.error = '';
    console.log(`Connected to MongoDB Atlas database: ${mongoose.connection.name}`);
  } catch (error) {
    dbState.mode = 'memory';
    dbState.connected = false;
    dbState.error = error.message;
    console.error(`MongoDB connection failed: ${error.message}`);
    console.warn('Falling back to in-memory demo storage.');
  }
}
