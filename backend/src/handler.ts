import { Request, Response } from 'express';
import { getDb } from './mongoClient';
import * as dotenv from 'dotenv';
dotenv.config();

const notesCollection = process.env.NOTES_COLLECTION!;
const codesCollection = process.env.CODES_COLLECTION!;

export async function handleRequest(req: Request, res: Response, basePath: string) {
  try {
    const db = await getDb();
    const id = req.params.id;
    const isNoteRequest = basePath === '/notes/';
    const collectionName = isNoteRequest ? notesCollection : codesCollection;
    const collection = db.collection(collectionName);

    if (!id) {
      return res.status(400).json({ message: 'Missing ID parameter' });
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (30 * 24 * 60 * 60);

    if (req.method === 'GET') {
      const doc = await collection.findOne({ id });
      if (!doc) {
        return res.status(404).json({ message: 'Not Found' });
      }
      const responseBody: any = { content: doc.content, updatedAt: doc.updatedAt };
      if (!isNoteRequest && doc.language) responseBody.language = doc.language;
      return res.status(200).json(responseBody);
    } else if (req.method === 'PUT') {
      const { content, language } = req.body;
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'Invalid content format' });
      }
      const docToSave: any = {
        id,
        content,
        updatedAt: now,
        expiresAt,
      };
      if (!isNoteRequest && typeof language === 'string') {
        docToSave.language = language;
      }
      await collection.updateOne(
        { id },
        { $set: docToSave },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Saved successfully', updatedAt: now });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
    return false;
  }
}