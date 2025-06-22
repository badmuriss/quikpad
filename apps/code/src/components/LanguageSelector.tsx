
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languageDetection';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="px-3 py-2 rounded-md bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <option key={language.id} value={language.id}>
          {language.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
