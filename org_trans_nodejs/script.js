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
    const { text, targetLanguage } = req.body;
    const preprompt = fs.readFileSync('./preprompt.txt', 'utf8');
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or use the latest available model
            messages: [
                {role: "system", content: preprompt},
                {role: "system", 
            content: `Translate ${text} to ${targetLanguage}`}  
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
