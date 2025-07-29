
import { useState, useEffect, useRef } from 'react';
import { generateUniqueId, getCode, updateCode } from './utils/api';
import CodeEditor from './components/CodeEditor';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import { ShareButton } from './components/ShareButton';
import './styles/share-button.scss';
import { debounce } from 'lodash';
import { nanoid } from 'nanoid';

function App() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [noteId, setNoteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const contentRef = useRef(content);
  const editorRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setTheme(isDark ? 'github-dark' : 'github-light');
    
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      setTheme(currentTheme === 'dark' ? 'github-dark' : 'github-light');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setTheme(isDarkMode ? 'github-dark' : 'github-light');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Initialize note from URL or create new one
  useEffect(() => {
    const initializeNote = async () => {
      setIsLoading(true);
      
      // Add a maximum timeout for the whole initialization process
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Initialization timeout')), 5000); // 5 second timeout
      });

      try {
        await Promise.race([
          (async () => {
            // Check if there's a note ID in the URL
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            const urlNoteId = pathParts[0];

            if (urlNoteId) {
              // Try to load existing note with timeout
              try {
                const existingNote = await Promise.race([
                  getCode(urlNoteId),
                  new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                
                if (existingNote) {
                  setNoteId(urlNoteId);
                  setContent(existingNote.content);
                  if (existingNote.language) {
                    setLanguage(existingNote.language);
                  }
                } else {
                  // Note doesn't exist, create new one with timeout
                  await Promise.race([
                    updateCode(urlNoteId, "", "javascript"),
                    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                  ]);
                  setNoteId(urlNoteId);
                  setContent('// API connection failed. Changes will not be saved automatically.\n\n');
                }
              } catch {
                // API failed, create offline note
                setNoteId(urlNoteId);
                setContent('// API connection failed. Changes will not be saved automatically.\n\n');
                setLanguage('javascript');
              }
            } else {
              // Create new note with timeout
              try {
                const newId = await Promise.race([
                  generateUniqueId(),
                  new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                
                await Promise.race([
                  updateCode(newId, "", "javascript"),
                  new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                
                window.history.replaceState({}, '', `/${newId}`);
                setNoteId(newId);
                setContent('');
                setLanguage('javascript');
              } catch {
                // Use nanoid directly as fallback
                const fallbackId = nanoid(7);
                setNoteId(fallbackId);
                setContent('// Failed to connect to server. Changes will not be saved.\n\n');
                setLanguage('javascript');
                window.history.replaceState({}, '', `/${fallbackId}`);
              }
            }
          })(),
          timeoutPromise
        ]);
      } catch {
        // Final fallback
        const fallbackId = nanoid(7);
        setNoteId(fallbackId);
        setContent('// Failed to connect to server. Changes will not be saved.\n\n');
        setLanguage('javascript');
        window.history.replaceState({}, '', `/${fallbackId}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNote();
  }, []);

  const saveNoteDebounced = useRef(
    debounce(async (noteId: string, content: string, language: string | undefined) => {
      if (!noteId) return;
      
      try {
        setIsSaving(true);
        setSaveError(false);
        await updateCode(noteId, content, language);
      } catch (error) {
        console.error('Error saving note:', error);
        setSaveError(true);
      } finally {
        setTimeout(() => {
          setIsSaving(false);
        }, 400);
      }
    }, 2000)
  ).current;
    
  const handleContentChange = (newContent: string) => {
    contentRef.current = newContent;
    saveNoteDebounced(noteId, newContent, language);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading QuikCode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>ID: {noteId}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="save-status min-w-20 flex items-center me-3">
            {isSaving && (
              <span className="flex items-center space-x-2 text-purple-500 text-sm">
                <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </span>
            )}
            {saveError && (
              <span className="flex items-center space-x-1 text-red-500 text-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Error</span>
              </span>
            )}
          </div>
          <LanguageSelector
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
          <ThemeToggle />
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <div 
          ref={editorRef} 
          className="h-full bg-white dark:bg-[#0d1117]"
          id="prism-editor-container"
        >
          <CodeEditor
            value={content}
            language={language}
            onChange={handleContentChange}
            theme={theme}
          />
        </div>
      </main>

      {/* Share Button */}
      <ShareButton
        content={content}
        noteId={noteId}
        language={language}
        editorElement={editorRef.current}
      />
    </div>
  );
}

export default App;