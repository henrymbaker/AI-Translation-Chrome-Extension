function convertOutput(inputString) {
    // paragraphs
    inputString = inputString.split('\n').filter(line => line.trim() !== '')
            .map(line => `<p>${line.trim()}</p>`).join('');

    return inputString;
  }

function setVisClass(elementId, setTo) {
    var element = document.getElementById(elementId);
    ["active", "error"].forEach((str, index) => {
        if (setTo === str) {
            element.classList.add(str);
        } else {
            element.classList.remove(str)
        }
    });
}

document.getElementById('input-textholder').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default action of Enter key
      document.getElementById('translate-button').click(); // Simulates a click on the translate button
    }
  });
  
document.getElementById('translate-button').addEventListener('click', async () => {
    const textToTranslate = document.getElementById('input-textholder').value;
    const targetLanguage = 'English'; // You can modify this to allow user selection

    // reset text output fields
    document.getElementById('output-textholder').innerText = 'Translation will appear here...';
    document.getElementById('grammar-content').innerText = 'Grammar info will appear here...';
    document.getElementById('nuance-content').innerText = 'Nuance info will appear here...';
    setVisClass('grammar-collapsible', null);
    setVisClass('nuance-collapsible', null);

    try {
        const response = await fetch('http://localhost:3002/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textToTranslate, targetLanguage, context: 'Context of word is unknown.' }),
        });

        if (!response.ok) {
            throw new Error('Translation request failed');
        }

        const result = await response.json();
        document.getElementById('output-textholder').innerText = result.translation;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output-textholder').innerText = 'Error in translation';
    }

    try {
        const response = await fetch('http://localhost:3002/grammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textToTranslate, targetLanguage, context: 'Context of word is unknown.' }),
        });

        if (!response.ok) {
            throw new Error('Grammar request failed');
        }

        const result = await response.json();
        document.getElementById('grammar-content').innerText = result.grammar;
        setVisClass('grammar-collapsible', 'active');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('grammar-content').innerText = 'Error in grammar';
        setVisClass('grammar-collapsible', 'error');
    }

    try {
        const response = await fetch('http://localhost:3002/nuance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textToTranslate, targetLanguage, context: 'Context of word is unknown.' }),
        });

        if (!response.ok) {
            throw new Error('Nuance request failed');
        }

        const result = await response.json();
        document.getElementById('nuance-content').innerText = result.nuance;
        setVisClass('nuance-collapsible', 'active');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('nuance-content').innerText = 'Error in nuance';
        setVisClass('nuance-collapsible', 'error');
    }



});

    var collapsible = document.getElementsByClassName("collapsible-button");
    console.log("clicked")
    for (var i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener("click", function () {
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
