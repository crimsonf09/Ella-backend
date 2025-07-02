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

app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: 'chrome-extension://fmpgpklehfmplhdnnbmopamhkgpliibf'
//   credentials: true
// }));
const allowedOrigins = [
  'https://dacasia-chat.hakuneo.com',
  'chrome-extension://fmpgpklehfmplhdnnbmopamhkgpliibf'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  exposedHeaders: ['access-token','refresh-token']
}));


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => { console.log('✅ MongoDB connected') })
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('✅ Server is running! Use POST /generatelocal or /generate');
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
