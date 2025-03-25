// src/App.tsx
import React from 'react';
import Popup from './components/Popup';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App h-full w-full">
      <Popup />
    </div>
  );
};

export default App;