import React, { useCallback, useEffect, useState } from 'react';
import { Editor } from 'prism-react-editor';
import { BasicSetup } from 'prism-react-editor/setups';

// Importações necessárias para o layout
import 'prism-react-editor/layout.css';
import 'prism-react-editor/search.css';

// Importações de linguagens
import 'prism-react-editor/prism/languages/common';
import { loadTheme } from 'prism-react-editor/themes';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onLanguageDetected?: (language: string) => void;
  theme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  theme = 'github-dark',
}) => {
  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);
  
  const [themeCss, setCss] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;

    const validTheme = theme === 'github-dark' ? 'github-dark' : 'github-light';

    loadTheme(validTheme).then(css => {
      if (!cancelled) {
        setCss(css || null);
      }
    }).catch(error => {
      console.error('Error loading theme:', error);
      if (!cancelled) {
        setCss(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    themeCss && (
      <main className="grow overflow-auto github">
        <style>{themeCss}</style>
        <Editor
          value={value}
          language={language || 'text'}
          tabSize={2}
          insertSpaces={true}
          lineNumbers={true}
          onUpdate={handleChange}
          wordWrap={true}
          style={{
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
            fontSize: '14px',
            lineHeight: '1.6',
            height: '100%',
            width: '100%',
            margin: 'auto',
            padding: '20px',
          }}
        >
          {editor => <BasicSetup editor={editor} />}
        </Editor>
      </main>
    )
  );
};

export default CodeEditor;