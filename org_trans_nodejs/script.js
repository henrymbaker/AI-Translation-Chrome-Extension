const fs = require('fs');
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const url = "https://ivb5y3fn06.execute-api.us-east-1.amazonaws.com/helloWorld";

const app = express();
app.use(express.json()); // Middleware for JSON request parsing
app.use(cors());

// main function to make the api call, need to use chat completion api call
app.post('/translate', async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        messages = {'preprompt': preprompt,
        'context': context,
        'task': `Translate ${text} into to ${targetLanguage}.
        The translation should take context into account and represent the intent of the text to the best of your ability. If ambiguous, it should be your best guess. The response should ONLY contain the direct translation of the text, do not put it in a full sentence, and NEVER INCLUDE THE PHRASE YOU HAVE TRANSLATED IN YOUR RESPONSE IF YOU WANT TO KEEP YOUR JOB. For example, if the phrase to translate is "Hola chica" (in spanish) then if your output language is English, you should output "Hello girl" with NO ADDITIONAL WORDS.`};
        console.log(messages);
        const response = await axios.get(url, { params: messages });
        console.log(response.status); // status code
        console.log(response.data); // the response
        const translation = response.data;
        res.json({ translation });
    } catch (error) {
        console.error('Error in translation:', error);
        res.status(500).send('Error in translation');
    }
});

// main function to make the api call, need to use chat completion api call
app.post('/grammar', async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        messages = {'preprompt': preprompt,
        'context': context,
        'task': `Analyze the grammar of ${text} in ${targetLanguage}.
        The response should be a description of the grammatical elements and structures of the text and its meaning is composed. DO NOT go into detail about the definitions of each word, or name the language the sentence is in. Limit your response to three sentences.`};
        console.log(messages);
        const response = await axios.get(url, { params: messages });
        console.log(response.status); // status code
        console.log(response.data); // the response
        const grammar = response.data;
        res.json({ grammar });
    } catch (error) {
        console.error('Error in getting grammar:', error);
        res.status(500).send('Error in getting grammar');
    }
});

app.post('/nuance', async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        messages = {'preprompt': preprompt,
        'context': context,
        'task': `Analyze the nuance of ${text} in ${targetLanguage}.
        The response should be a description of the nuances of the meaning of the text if the meaning could change depending on context. Touch on as many things as you think can provide important information about the social and cultural context of the text. If there is any critical cultural context, such as if it includes a joke, a meme, a pop culture reference, or a reference to something famous, then briefly touch on whatever background information might be necessary to understand that a non-speaker might not have. Limit your response to four sentences.`};
        console.log(messages);
        const response = await axios.get(url, { params: messages });
        console.log(response.status); // status code
        console.log(response.data); // the response
        const nuance = response.data;
        res.json({ nuance });
    } catch (error) {
        console.error('Error in getting nuance:', error);
        res.status(500).send('Error in getting nuance');
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
