document.getElementById('translate-button').addEventListener('click', async () => {
  const textToTranslate = document.getElementById('text-to-translate').value;
  const targetLanguage = 'Spanish'; // You can modify this to allow user selection

  try {
      const response = await fetch('http://localhost:3001/translate', {
          method: 'POST',
          headers: {  
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textToTranslate, targetLanguage }),
      });

      if (!response.ok) {
          throw new Error('Translation request failed');
      }

      const result = await response.json();
      document.getElementById('translation-result').innerText = result.translation;
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('translation-result').innerText = 'Error in translation';
  }
});
