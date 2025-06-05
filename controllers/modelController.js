import { sendLlamaPrompt } from '../services/modelService.js';

const validatePrompt = (prompt) => {
  return true; // Replace with real validation if needed
};

export const modelResponse = async (req, res) => {
  const { profile, Question, user } = req.body;
  console.log(profile, Question, user, systemPrompt)
  const prompt = `Give me the most effective prompt
${profile}
Question: ${Question}
user: ${user}`;
const systemPrompt = "this is nong Touch na"

  console.log("Generated prompt:\n", prompt);

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
