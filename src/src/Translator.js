// TranslatorContainer.js
import React, { useState } from 'react';
import Title from './Title';
import TextInput from './TextInput';
import Button from './Button';
import TranslationOutput from './TranslationOutput';

export default function TranslatorContainer() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await fetch('http://localhost:3001/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage: 'Spanish' })
      });
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App-body">
      <div className='App-translator-container'>
        <Title />
        <TextInput value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={handleTranslate} />
        <TranslationOutput value={translation} />
      </div>
    </div>
  );
}
