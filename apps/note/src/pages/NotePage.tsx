// src/pages/NotePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SimpleEditor } from '../../@/components/tiptap-templates/simple/simple-editor';
import { Note } from '../types';
import { generateUniqueId, getNote, createNote } from '../utils/api';
import { nanoid } from 'nanoid';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initializeNote() {
      setIsLoading(true);
      
      // Add a maximum timeout for the whole initialization process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Initialization timeout')), 5000); // 5 second timeout
      });

      try {
        const initResult = await Promise.race([
          (async (): Promise<'navigated' | 'completed'> => {
            if (!id) {
              // Try to generate a new ID, but fallback to nanoid if API times out
              try {
                const newId = await Promise.race([
                  generateUniqueId(),
                  new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                navigate(`/${newId}`, { replace: true });
                return 'navigated';
              } catch {
                // Use nanoid directly as fallback
                const fallbackId = nanoid(7);
                navigate(`/${fallbackId}`, { replace: true });
                return 'navigated';
              }
            }

            let noteData: Note;
            try {
              // Add timeout to getNote call
              const fetchedNote = await Promise.race([
                getNote(id),
                new Promise<Note | null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
              ]);
              
              if (!fetchedNote) {
                // Add timeout to createNote call
                const createdNote = await Promise.race([
                  createNote(id),
                  new Promise<Note | null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                if (!createdNote) {
                  throw new Error('Failed to create note');
                }
                noteData = { ...createdNote, content: '<h1>Your new Note</h1>' };
              } else {
                noteData = fetchedNote;
              }
            } catch {
              // API failed, create a fallback note that will work offline
              noteData = {
                id: id,
                content: '<h1>Your new Note</h1><p>Note: API connection failed. Changes will not be saved automatically.</p>',
                updatedAt: new Date().toISOString()
              };
            }
            
            setNote(noteData);
            return 'completed';
          })(),
          timeoutPromise
        ]);
        
        // If we navigated, the useEffect will run again, so don't continue
        if (initResult === 'navigated') {
          return;
        }
      } catch {
        // This should rarely happen now, but keeping as final fallback
        const fallbackNote = {
          id: id || nanoid(7),
          content: '<h1>Your new Note</h1><p>Note: Failed to connect to server. Changes will not be saved.</p>',
          updatedAt: new Date().toISOString()
        };
        setNote(fallbackNote);
      } finally {
        setIsLoading(false);
      }
    }

    initializeNote();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117]">
        <div className="text-gray-400">Loading note...</div>
      </div>
    );
  }

  // Always show the editor, even if note is null (shouldn't happen with new logic)
  return <SimpleEditor {...(note || {
    id: nanoid(7),
    content: '<h1>Your new Note</h1>',
    updatedAt: new Date().toISOString()
  })}/>
};

export default NotePage;