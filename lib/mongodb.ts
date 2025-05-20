// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// This caches the connection to avoid multiple connections, critical for Next.js API routes and Server Components.
if (process.env.NODE_ENV === 'development') {
  // Preserve connection across hot reloads in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // New connection in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;