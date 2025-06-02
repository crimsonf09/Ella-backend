import { sendLlamaPrompt } from '../services/modelService.js';
const validatePrompt = (prompt) => {
    return true;
}
export const modelResponse = async (req, res) => {
  const { prompt, systemPrompt } = req.body;
  console.log("control",prompt)
  const stream = req.body.stream || false;
    console.log(req.Body);
  if (!validatePrompt(prompt)) {
    return res.status(400).json({ error: 'Invalid or empty prompt.' });
  }

  try {
    const result = await sendLlamaPrompt(prompt, systemPrompt, stream);
    res.json({ reply: result });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'Failed to get response from Groq.' });
  }
};