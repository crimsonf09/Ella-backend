import { sendLlamaPrompt } from '../services/modelService.js';
import fs from 'fs';

const validatePrompt = (prompt) => {
  return true;
};

export const modelResponse = async (req, res) => {
  const { profile, Question, user } = req.body;
  const systemPrompt = fs.readFileSync('./prompt/generalPrompt.txt', 'utf-8');
  const prompt = `Based on the following inputs, generate an Effective Prompt as per the System Prompt guidelines:
User Profile: ${user}

Task Context Profile: ${profile}

Question: ${Question}`;

  console.log("send to groq:\n", prompt);

  if (!validatePrompt(prompt)) {
    return res.status(400).json({ error: 'Invalid or empty prompt.' });
  }

  try {
    const result = await sendLlamaPrompt(prompt, systemPrompt);
    res.json({ reply: result });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'Failed to get response from Groq.' });
  }
};
