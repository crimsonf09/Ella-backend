import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const groq = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default groq;
