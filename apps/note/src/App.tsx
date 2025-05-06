// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotePage from './pages/NotePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<NotePage />} />
        <Route path="/" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;