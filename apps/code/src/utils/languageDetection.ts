
import type { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', prismId: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', prismId: 'typescript' },
  { id: 'python', name: 'Python', extension: '.py', prismId: 'python' },
  { id: 'java', name: 'Java', extension: '.java', prismId: 'java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', prismId: 'cpp' },
  { id: 'c', name: 'C', extension: '.c', prismId: 'c' },
  { id: 'csharp', name: 'C#', extension: '.cs', prismId: 'csharp' },
  { id: 'go', name: 'Go', extension: '.go', prismId: 'go' },
  { id: 'rust', name: 'Rust', extension: '.rs', prismId: 'rust' },
  { id: 'php', name: 'PHP', extension: '.php', prismId: 'php' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', prismId: 'ruby' },
  { id: 'swift', name: 'Swift', extension: '.swift', prismId: 'swift' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', prismId: 'kotlin' },
  { id: 'html', name: 'HTML', extension: '.html', prismId: 'markup' },
  { id: 'css', name: 'CSS', extension: '.css', prismId: 'css' },
  { id: 'scss', name: 'SCSS', extension: '.scss', prismId: 'scss' },
  { id: 'json', name: 'JSON', extension: '.json', prismId: 'json' },
  { id: 'xml', name: 'XML', extension: '.xml', prismId: 'xml' },
  { id: 'yaml', name: 'YAML', extension: '.yaml', prismId: 'yaml' },
  { id: 'markdown', name: 'Markdown', extension: '.md', prismId: 'markdown' },
  { id: 'sql', name: 'SQL', extension: '.sql', prismId: 'sql' },
  { id: 'bash', name: 'Bash', extension: '.sh', prismId: 'bash' },
  { id: 'powershell', name: 'PowerShell', extension: '.ps1', prismId: 'powershell' },
  { id: 'plaintext', name: 'Plain Text', extension: '.txt', prismId: 'plaintext' },
];

export function getLanguageById(id: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id);
}

export function getPrismLanguage(languageId: string): string {
  const language = getLanguageById(languageId);
  return language?.prismId || 'plaintext';
}
