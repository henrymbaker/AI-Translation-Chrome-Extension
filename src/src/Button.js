// this is the button component
import React from 'react';
import './App.css';

// TranslateButton.js
export default function TranslateButton({ onClick }) {
  return (
    <button onClick={onClick} className="App-translate-button">Translate</button>
  );
}

