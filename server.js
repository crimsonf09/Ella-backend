// server.js
const express = require('express');
const cors = require('cors');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use POST /generate to interact with Ollama.');
});

// POST /generate
app.post('/generate', async (req, res) => {
  const {prompt} = req.body
    console.log(prompt);
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
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
