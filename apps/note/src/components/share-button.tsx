// ShareButton.tsx
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import './share-button.scss'
import TurndownService from 'turndown';

interface ShareButtonProps {
  editor: Editor | null;
  noteId: string | number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ editor, noteId }) => {
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



const exportToHtml = () => {
  try {
    setIsExporting(true);
    
    if (!editor) throw new Error('Editor not found');

    let htmlContent = editor.getHTML();
   
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note-${noteId}.html`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (err) {
    console.error("HTML export failed:", err);
    alert(`Failed to export as HTML: ${err}`);
  } finally {
    setIsExporting(false);
  }
};

const exportToMarkdown = () => {
  try {
    setIsExporting(true);
    
    if (!editor) throw new Error('Editor not found');

    let htmlContent = editor.getHTML();
    
    const turndownService = new TurndownService({
      headingStyle: 'atx',       
      hr: '---',                 
      bulletListMarker: '-',     
      codeBlockStyle: 'fenced',  
      emDelimiter: '_'          
    });
    
    turndownService.addRule('codeBlocks', {
      filter: ['pre'],
      replacement: function(content) {
        return '```\n' + content + '\n```';
      }
    });
    
    const markdownContent = turndownService.turndown(htmlContent);
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note-${noteId}.md`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (err) {
    console.error("Markdown export failed:", err);
    alert(`Failed to export as Markdown: ${err}`);
  } finally {
    setIsExporting(false);
  }
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
              <h3>Share Document</h3>
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
                <button 
                  onClick={exportToHtml} 
                  className="export-button"
                  disabled={isExporting}
                >
                  <i className="bi bi-filetype-html"></i>
                  Save as HTML
                </button>
                
                <button 
                  onClick={exportToMarkdown} 
                  className="export-button"
                  disabled={isExporting}
                >
                  <i className="bi bi-filetype-md"></i>
                  Save as Markdown
                </button>
              </div>
              
              {isExporting && (
                <div className="export-status">
                  <div className="spinner"></div>
                  <span>Exporting document...</span>
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