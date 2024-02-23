import mongoose, { Mongoose } from 'mongoose';

const { MONGODB_CONNECTION_STRING } = process.env;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cachedConnection: MongooseConnection = (global as any).mongoose;

if (!cachedConnection) {
  cachedConnection = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cachedConnection.conn) return cachedConnection.conn;

  if (!MONGODB_CONNECTION_STRING) {
    throw new Error('MONGODB_CONNECTION_STRING not found in .env.local');
  }

  cachedConnection.promise =
    cachedConnection.promise ||
    mongoose.connect(MONGODB_CONNECTION_STRING, {
      dbName: 'AImage',
      bufferCommands: false
    });

  cachedConnection.conn = await cachedConnection.promise;

  return cachedConnection.conn;
}
