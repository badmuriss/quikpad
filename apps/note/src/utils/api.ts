// src/utils/api.ts
import { nanoid } from 'nanoid';
import { Note } from '../types';

const API_ENDPOINT = 'http://localhost:3001';

export async function generateUniqueId(): Promise<string> {
  let id = nanoid(7);
  let isUnique = false;
  
  while (!isUnique) {
    try {
      const response = await fetch(`${API_ENDPOINT}/notes/${id}`);
      if (response.status === 404) {
        isUnique = true;
      } else {
        id = nanoid(7);
      }
    } catch (error) {
      // If there's an error fetching, we'll assume the ID is unique
      isUnique = true;
    }
  }
  
  return id;
}

export async function getNote(id: string): Promise<Note | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/notes/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export async function createNote(id: string): Promise<Note | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: '',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
}

export async function updateNote(id: string, content: string): Promise<Note | null> {
  if (!id) {
    console.error('Cannot update note: ID is missing');
    return null;
  }
  
  try {
    console.log(`Updating note ${id} with content length: ${content.length}`);
    
    const response = await fetch(`${API_ENDPOINT}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Update response:', data);
    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
}