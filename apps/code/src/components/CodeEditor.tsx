import React, { useCallback, useEffect } from 'react';
import { Editor } from 'prism-react-editor';
import { BasicSetup } from 'prism-react-editor/setups';

// Importações necessárias para o layout
import 'prism-react-editor/layout.css';
import 'prism-react-editor/search.css';

// Importações de linguagens
import 'prism-react-editor/prism/languages/common';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onLanguageDetected?: (language: string) => void;
  theme?: 'light' | 'dark';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  theme = 'light',
}) => {
  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);
  
  return (
    <div 
      className={`h-full w-full overflow-hidden ${theme}`}
    >
      <Editor
        value={value}
        language={language || 'text'}
        tabSize={2}
        insertSpaces={true}
        lineNumbers={true}
        onUpdate={handleChange}
        style={{
          fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
          fontSize: '14px',
          lineHeight: '1.6',
          height: '100%',
          width: '100%',
          padding: '20px',
        }}
      >
        {editor => <BasicSetup editor={editor} />}
      </Editor>
    </div>
  );
};

export default CodeEditor;