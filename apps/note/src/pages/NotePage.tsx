// src/pages/NotePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SimpleEditor } from '../../@/components/tiptap-templates/simple/simple-editor';
import { Note } from '../types';
import { generateUniqueId, getNote, createNote } from '../utils/api';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeNote() {
      setIsLoading(true);
      try {
        if (!id) {
          const newId = await generateUniqueId();
          navigate(`/${newId}`, { replace: true });
          return;
        }

        let noteData = await getNote(id);
        
        if (!noteData) {
          noteData = await createNote(id);
          if (!noteData) {
            throw new Error('Failed to create note');
          }
        }
        
        setNote(noteData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117]">
        <div className="text-gray-400">Note not found</div>
      </div>
    );
  }

  return <SimpleEditor {...note}/>
};

export default NotePage;