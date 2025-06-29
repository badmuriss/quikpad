
import React, { useState } from 'react';
import '../styles/share-button.scss';

interface ShareButtonProps {
  content: string;
  noteId: string;
  language: string;
  editorElement?: HTMLElement | null;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  content, 
  noteId, 
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareableLink = `${window.location.origin}/${noteId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const exportToFile = (format: 'txt' | 'code') => {
    try {
      setIsExporting(true);
      
      const extension = format === 'txt' ? 'txt' : getFileExtension(language);
      const mimeType = format === 'txt' ? 'text/plain' : 'text/plain';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quikcode-${noteId}.${extension}`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (err) {
      console.error("Export failed:", err);
      alert(`Failed to export: ${err}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      markdown: 'md',
      sql: 'sql',
      bash: 'sh',
      powershell: 'ps1',
      plaintext: 'txt',
    };
    return extensions[lang] || 'txt';
  };

  return (
    <div className="share-button-container">
      <button 
        className="share-button"
        onClick={() => setIsOpen(true)}
        aria-label="Share"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
      
      {isOpen && (
        <div className="share-modal-overlay">
          <div className="share-modal" onClick={e => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Code</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className="share-options">
              <div className="share-link-option">
                <p>Share Link</p>
                <div className="link-container">
                  <input value={shareableLink} readOnly className="link-input" />
                  <button onClick={copyLink} className="copy-button">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="share-export-options">
                <button onClick={copyCode} className="export-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="m5 15-4-4 4-4"></path>
                  </svg>
                  Copy Code
                </button>
                
                <button 
                  onClick={() => exportToFile('code')} 
                  className="export-button"
                  disabled={isExporting}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                  Save as {language.toUpperCase()}
                </button>

                <button 
                  onClick={() => exportToFile('txt')} 
                  className="export-button"
                  disabled={isExporting}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  Save as TXT
                </button>
                {/* <button 
                  onClick={exportAsImage} 
                  className="export-button"
                  disabled={isExporting || !editorElement}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                  Export as Image
                </button> */}
              </div>
              
              {isExporting && (
                <div className="export-status">
                  <div className="spinner"></div>
                  <span>Exporting...</span>
                </div>
              )}
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </div>
  );
};
