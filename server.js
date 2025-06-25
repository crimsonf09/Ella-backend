import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { modelResponse } from './controllers/modelController.js';
import userRoutes from './routes/userRoutes.js'; 
import personalProfileRoutes from './routes/personalProfileRoute.js';
import taskProfileRoutes from './routes/taskProfileRoute.js';
import messageRoutes from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => { console.log('✅ MongoDB connected') })
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('✅ Server is running! Use POST /generatelocal or /generate');
});

app.post('/generatelocal', async (req, res) => {
  const { prompt } = req.body;
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
    res.json(data);
  } catch (err) {
    console.error('❌ Local API Error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Remote Groq API
app.post('/generate', modelResponse);

// ✅ Now your User routes work perfectly
app.use('/api', userRoutes);
app.use('/api/personalProfile', personalProfileRoutes); 
app.use('/api/taskProfile', taskProfileRoutes);
app.use('/api/message', messageRoutes);
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
