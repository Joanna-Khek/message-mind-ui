// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Augment the globalThis type to include _mongoClientPromise
declare global {
  interface GlobalThis {
    _mongoClientPromise?: Promise<MongoClient> | undefined;
  }
}

// Use a type assertion to ensure TypeScript recognizes globalThis correctly
const globalThisWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const uri = process.env.MONGODB_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// MongoDB connection options
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsAllowInvalidCertificates: true,
};

// This caches the connection to avoid multiple connections, critical for Next.js API routes and Server Components.
// Singleton connection pattern for Next.js
if (process.env.NODE_ENV === 'development') {
  // In development, use globalThis to preserve connection across hot reloads
  if (!globalThisWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThisWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error('MongoDB connection failed:', err);
      throw err;
    });
  }
  clientPromise = globalThisWithMongo._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error('MongoDB connection failed:', err);
    throw err;
  });
}

export default clientPromise;