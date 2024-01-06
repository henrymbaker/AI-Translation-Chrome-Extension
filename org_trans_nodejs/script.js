// require('dotenv').config({ debug: process.env.DEBUG });
const fs = require('fs');
const express = require('express');
// const { OpenAIApi, Configuration } = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware for JSON request parsing
app.use(cors());

const OpenAI = require('openai');

// const configuration = new OpenAI.Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAI.OpenAIApi(configuration);
// const openai = new OpenAI(process.env.OPENAI_API_KEY);
const openai = new OpenAI();

// main function to make the api call, need to use chat completion api call
app.post('/translate', async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or use the latest available model
            messages: [
                {role: "system", content: preprompt},
                {role: "system", content: context},
                {role: "system", content: `Translate ${text} into to ${targetLanguage}.
                The translation should take context into account and represent the intent of the text to the best of your ability. If ambiguous, it should be your best guess. The response should ONLY contain the translation of the text.`},
            ],
        });
        // console.log(response)
        const translation = response.choices[0].message.content;
        console.log('Translation:', translation);
        res.json({ translation });
    } catch (error) {
        console.error('Error in translation:', error);
        res.status(500).send('Error in translation');
    }
});

app.post('/grammar', async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or use the latest available model
            messages: [
                {role: "system", content: preprompt},
                {role: "system", content: context},
                {role: "system", content: `Analyze the grammar of ${text} in ${targetLanguage}.
                The response should be a description of the grammatical elements and structures of the text and its meaning is composed. DO NOT go into detail about the definitions of each word, or name the language the sentence is in. Limit your response to succinct and essential information.`},
            ],
        });
        // console.log(response)
        const grammar = response.choices[0].message.content;
        console.log('Grammar:', grammar);
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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or use the latest available model
            messages: [
                {role: "system", content: preprompt},
                {role: "system", content: context},
                {role: "system", content: `Analyze the nuance of ${text} in ${targetLanguage}.
                The response should be a description of the nuances of the meaning of the text. Touch on as many things as you think can provide important information about the social and cultural context of the text, while also keeping the response concise. Some potential areas can include the referents of the text (especially if they're made ambiguous by pronouns or pro-dropping), the context in which you might find such a sentence, eg in a formal setting, in dialogue, on social media, etc, grammatical clues that are lost in translation (numbers, genders, cases/tenses/aspects), non-grammatical details about the social setting and social positions/roles of the participant(s), non-literal communication such as evoked feelings or vibes. If there is any critical cultural context, such as if it includes a joke, a meme, a pop culture reference, or a reference to something famous, then briefly touch on whatever background information might be necessary to understand that a non-speaker might not have. Only do this if there is important cultural context, otherwise don't mention it at all.`},
            ],
        });
        // console.log(response)
        const nuance = response.choices[0].message.content;
        console.log('Nuance:', nuance);
        res.json({ nuance });
    } catch (error) {
        console.error('Error in getting grammar:', error);
        res.status(500).send('Error in getting grammar');
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
