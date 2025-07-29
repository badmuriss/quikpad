import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();


let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (!client || !db) {
    const currentUri = process.env.MONGO_URI! || "mongodb://root:password@localhost:27017";
    const currentDbName = process.env.MONGO_DB! || "quikpad";
    client = new MongoClient(currentUri);
    await client.connect();
    db = client.db(currentDbName);
  }
  return db;
}