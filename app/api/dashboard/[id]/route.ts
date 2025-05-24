import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // Await params to resolve the Promise

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
        const item = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to retrieve item' }, { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { id: string }}) {
    try {
        const { id } = await params; // Await params to resolve the Promise
        const body = await request.json();
        const { title, details, summary, category } = body;

        if (!title || !details || !summary || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
            { $set: { title, details, summary, category } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'No document updated' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string }}) {
    try {
        const { id } = await params; // Await params to resolve the Promise
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

        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'No document deleted' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}