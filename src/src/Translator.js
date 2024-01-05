// TranslatorContainer.js
import React, { useState } from 'react';
// import Title from './Title';
// import TextInput from './TextInput';
// import TranslateButton from './TranslateButton';
// import TranslationOutput from './TranslationOutput';

export default function TranslatorContainer() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  const handleTranslate = async () => {
    // Translation logic
  };

  return (
    <div className="App-body">
      <div className='App-translator-container'>
        <Title />
        <TextInput value={text} onChange={(e) => setText(e.target.value)} />
        <TranslateButton onClick={handleTranslate} />
        <TranslationOutput value={translation} />
      </div>
    </div>
  );
}
