import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// @ts-ignore
import { speechService } from './services/speechService';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// OpenAI chat endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { query, systemPrompt, image } = req.body;

    let messages = [
      {
        role: "system",
        content: systemPrompt || "You are a helpful museum guide at the Neues Museum in Berlin."
      }
    ];

    if (image) {
      // If there's an image, use GPT-4 Vision API
      messages.push({
        role: "user",
        content: [
          { type: "text", text: query },
          { type: "image_url", image_url: { url: image } }
        ]
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 500,
      });

      res.json({ response: response.choices[0].message.content });
    } else {
      // Text-only query
      messages.push({
        role: "user",
        content: query
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 500,
      });

      res.json({ response: response.choices[0].message.content });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Chat endpoint with audio response
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    const responseMessage = completion.choices[0].message.content;
    
    // Generate speech from the text response
    await speechService.textToSpeech(responseMessage, res);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Text-only response endpoint
app.post('/api/chat/text', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});