import { getDb } from './mongoClient';
import * as dotenv from 'dotenv';
dotenv.config();

export async function setupTTLIndexes() {
  try {
    const db = await getDb();
    
    const notesCollection = process.env.NOTES_COLLECTION || "quikNotes";
    const codesCollection = process.env.CODES_COLLECTION || "quikCotes";

    // Verificar se os índices já existem
    const notesIndexes = await db.collection(notesCollection).indexes();
    const codesIndexes = await db.collection(codesCollection).indexes();

    const hasNotesIndex = notesIndexes.some(index => index.key?.expiresAt);
    const hasCodesIndex = codesIndexes.some(index => index.key?.expiresAt);

    if (!hasNotesIndex) {
      await db.collection(notesCollection).createIndex(
        { expiresAt: 1 }, 
        { expireAfterSeconds: 0 }
      );
      console.log(`TTL index created for ${notesCollection}`);
    }

    if (!hasCodesIndex) {
      await db.collection(codesCollection).createIndex(
        { expiresAt: 1 }, 
        { expireAfterSeconds: 0 }
      );
      console.log(`TTL index created for ${codesCollection}`);
    }

    console.log('TTL indexes setup completed');
  } catch (error) {
    console.error('Error setting up TTL indexes:', error);
  }
}