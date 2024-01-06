document.getElementById('translate-button').addEventListener('click', async () => {
    const textToTranslate = document.getElementById('input-textholder').value;
    const targetLanguage = 'English'; // You can modify this to allow user selection

    // reset text output fields
    document.getElementById('output-textholder').innerText = 'Translation will appear here...';
    document.getElementById('grammar-content').innerText = 'Grammar info will appear here...';
    document.getElementById('nuance-content').innerText = 'Nuance info will appear here...';

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

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('grammar-content').innerText = 'Error in grammar';
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

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('nuance-content').innerText = 'Error in nuance';
    }



});

document.addEventListener("DOMContentLoaded", function () {
    var collapsible = document.getElementsByClassName("collapsible-button");

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
});