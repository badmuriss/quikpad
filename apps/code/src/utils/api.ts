
import { nanoid } from 'nanoid';
import type { Code } from '../types';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3001";

export async function generateUniqueId(): Promise<string> {
  let id = nanoid(7);
  let isUnique = false;
  
  while (!isUnique) {
    try {
      const response = await fetch(`${API_ENDPOINT}/codes/${id}`);
      if (response.status === 404) {
        isUnique = true;
      } else {
        id = nanoid(7);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      // If there's an error fetching, we'll assume the ID is unique
      isUnique = true;
    }
  }
  
  return id;
}

export async function getCode(id: string): Promise<Code | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/codes/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    const data = await response.json();
    return { id: id, content: data.content, language: data.language };
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export async function createCode(id: string, content: string = "", language: string = "javascript"): Promise<Code | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/codes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        language,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create code');
    }
    
    return { id: id, content, language };
  } catch (error) {
    console.error('Error creating code:', error);
    return null;
  }
}

export async function updateCode(id: string, content: string, language?: string): Promise<void> {
  if (!id) {
    console.error('Cannot update note: ID is missing');
  }
  
  try {    
    const response = await fetch(`${API_ENDPOINT}/codes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        language,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error updating note:', error);
  }
}
