
import { useState, useEffect, useRef } from 'react';
import { generateUniqueId, getCode, updateCode } from './utils/api';
import CodeEditor from './components/CodeEditor';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import { ShareButton } from './components/ShareButton';
import './styles/share-button.scss';
import { debounce } from 'lodash';

function App() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [noteId, setNoteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(content);
  const editorRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setTheme(isDark ? 'github-dark' : 'github-light');
    
    // Adicione um event listener para o evento de armazenamento
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      setTheme(currentTheme === 'dark' ? 'github-dark' : 'github-light');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Também observe mudanças na classe do documentElement
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
      try {
        // Check if there's a note ID in the URL
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const urlNoteId = pathParts[0];

        if (urlNoteId) {
          // Try to load existing note
          const existingNote = await getCode(urlNoteId);
          if (existingNote) {
            setNoteId(urlNoteId); // Use the ID from URL directly
            setContent(existingNote.content);
            if (existingNote.language) {
              setLanguage(existingNote.language);
            }
          } else {
            // Note doesn't exist, create new one with this ID
            await updateCode(urlNoteId, "javascript");
            setNoteId(urlNoteId); // Make sure to set the ID here
          }
        } else {
          // Create new note
          const newId = await generateUniqueId();
          await updateCode(newId, "");
          window.history.replaceState({}, '', `/${newId}`);
          setNoteId(newId);
        }
      } catch (error) {
        console.error('Error initializing note:', error);
        // Fallback: generate a local ID if API fails
        const fallbackId = await generateUniqueId();
        setNoteId(fallbackId);
        setContent('');
        setLanguage('javascript');
        window.history.replaceState({}, '', `/${fallbackId}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNote();
  }, []);

// Função para salvar a nota com debounce
  const saveNoteDebounced = useRef(
    debounce(async (noteId: string, content: string, language: string | undefined) => {
      if (!noteId) return;
      
      try {
        setIsSaving(true);
        await updateCode(noteId, content, language);
      } catch (error) {
        console.error('Error saving note:', error);
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
          {isSaving && (
              <span className="flex items-center space-x-1 text-purple-500">
                <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </span>
            )}
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