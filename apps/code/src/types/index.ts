
export interface Code {
  id: string;
  content: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Language {
  id: string;
  name: string;
  extension: string;
  prismId: string;
}

export interface ExportOptions {
  includeLineNumbers: boolean;
  theme: 'light' | 'dark';
  format: 'png' | 'jpeg';
}
