import { getDb } from '../src/mongoClient.js';
import { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MongoClient Functions', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
    process.env.MONGO_DB = 'test_quikpad';
  }, 30000);

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);
  describe('getDb', () => {
    it('should return a database instance', async () => {
      const db = await getDb();
      expect(db).toBeInstanceOf(Db);
      expect(db.databaseName).toBe('test_quikpad');
    });

    it('should return the same instance on subsequent calls', async () => {
      const db1 = await getDb();
      const db2 = await getDb();
      expect(db1).toBe(db2);
    });

    it('should be able to perform database operations', async () => {
      const db = await getDb();
      const testCollection = db.collection('test_connection');
      
      // Test insert
      const insertResult = await testCollection.insertOne({
        test: 'data',
        timestamp: new Date()
      });
      expect(insertResult.acknowledged).toBe(true);

      // Test find
      const foundDoc = await testCollection.findOne({ test: 'data' });
      expect(foundDoc).toBeTruthy();
      expect(foundDoc?.test).toBe('data');

      // Clean up
      await testCollection.deleteMany({});
    });

    it('should connect to the correct database URI', async () => {
      const db = await getDb();
      expect(process.env.MONGO_URI).toMatch(/mongodb:\/\//);
      expect(db.databaseName).toBe(process.env.MONGO_DB);
    });
  });
});