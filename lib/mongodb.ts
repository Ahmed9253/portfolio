import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}
