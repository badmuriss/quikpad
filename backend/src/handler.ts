import { Request, Response } from 'express';
import { getDb } from './mongoClient.js';
import * as dotenv from 'dotenv';
dotenv.config();



export async function handleRequest(req: Request, res: Response, basePath: string) {
  try {
    const db = await getDb();
    const id = req.params.id;
    const isNoteRequest = basePath === '/notes/';
    const currentNotesCollection = process.env.NOTES_COLLECTION || "quikNotes";
    const currentCodesCollection = process.env.CODES_COLLECTION || "quikCodes";
    const collectionName = isNoteRequest ? currentNotesCollection : currentCodesCollection;
    const collection = db.collection(collectionName);

    if (!id) {
      return res.status(400).json({ message: 'Missing ID parameter' });
    }

    const now = new Date();
    const expiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 dias

    if (req.method === 'GET') {
      const doc = await collection.findOne({ id });
      if (!doc) {
        return res.status(404).json({ message: 'Not Found' });
      }
      const responseBody: any = { 
        content: doc.content, 
        updatedAt: doc.updatedAt 
      };
      if (!isNoteRequest && doc.language) responseBody.language = doc.language;
      return res.status(200).json(responseBody);
    } else if (req.method === 'PUT') {
      const { content, language } = req.body;
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'Invalid content format' });
      }
      
      const MAX_CONTENT_SIZE = 100 * 1024; // 100kb
      if (content.length > MAX_CONTENT_SIZE) {
        return res.status(413).json({ 
          message: 'Content too large', 
          maxSize: MAX_CONTENT_SIZE,
          currentSize: content.length 
        });
      }
      
      const docToSave: any = {
        id,
        content,
        updatedAt: now,
        expiresAt
      };
      
      if (!isNoteRequest && typeof language === 'string') {
        docToSave.language = language;
      }
      
      await collection.updateOne(
        { id },
        { $set: docToSave },
        { upsert: true }
      );
      
      return res.status(200).json({ 
        message: 'Saved successfully', 
        updatedAt: now 
      });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
    return false;
  }
}
