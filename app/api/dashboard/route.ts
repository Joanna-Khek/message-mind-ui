import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
      const collectionName = process.env.DB_COLLECTION_NAME;
      const dbName = process.env.DB_APP_NAME;
      if (!dbName) {
        throw new Error('DB_NAME is not defined in .env.local');
      }
      if (!collectionName) {
        throw new Error('DB_COLLECTION_NAME is not defined in .env.local');
      }
  
      const client = await clientPromise;
      const db = client.db(dbName);
      // Extract messages with category
      const data = await db.collection(collectionName).find({ category: { $exists: true }}).toArray();

      return NextResponse.json(data);
    } catch  {
      return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 });
    }
  }
  
export async function PATCH(request: Request) {
  try {
    const { id, completed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
    }

    const collectionName = process.env.DB_COLLECTION_NAME;
    const dbName = process.env.DB_APP_NAME;
    if (!dbName) {
      throw new Error('DB_NAME is not defined in .env.local');
    }
    if (!collectionName) {
      throw new Error('DB_COLLECTION_NAME is not defined in .env.local');
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: completed } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No document updated' }, { status: 404 });
    }

    return NextResponse.json({ message: `Marked as ${completed ? 'completed' : 'incomplete'}` });
  } catch {
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}