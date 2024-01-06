document.getElementById('translate-button').addEventListener('click', async () => {
  const textToTranslate = document.getElementById('input-textholder').value;
  const targetLanguage = 'Spanish'; // You can modify this to allow user selection

  try {
      const response = await fetch('http://localhost:3002/translate', {
          method: 'POST',
          headers: {  
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textToTranslate, targetLanguage, context: 'Context of word is unknown.'}),
      });

      if (!response.ok) {
          throw new Error('Translation request failed');
      }

      const result = await response.json();
      document.getElementById('output-textholder').innerText = result.translation;
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('output').innerText = 'Error in translation';
  }
});

document.addEventListener("DOMContentLoaded", function() {
    var collapsible = document.getElementsByClassName("collapsible-button");

    for (var i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                this.textContent = ">" + this.textContent.slice(1);
            } else {
                content.style.display = "block";
                this.textContent = "v" + this.textContent.slice(1);
            }
        });
    }
});