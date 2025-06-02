// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { modelResponse } from './controllers/modelController.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use POST /generatelocal or /generate');
});

// Local Ollama route
app.post('/generatelocal', async (req, res) => {
  const { prompt } = req.body;
  console.log('[Local] Prompt:', prompt);
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    console.log('[Local] Response:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ Local API Error:', err);
    res.status(500).json({ error: 'Failed to generate response from local Ollama' });
  }
});

// Remote Groq API
app.post('/generate', modelResponse);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
