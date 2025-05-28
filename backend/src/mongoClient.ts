import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB!;

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (!client || !db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}