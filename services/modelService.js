import { Groq } from 'groq-sdk';
import groqConfig from '../config/groq.js'; // Optional if not used

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Or: groqConfig.apiKey
});

export const sendLlamaPrompt = async (
  userPrompt,
  systemPrompt = 'You are a helpful assistant.',
  stream = false
) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  console.log('User prompt:', userPrompt);

  try {
    if (stream) {
      const streamRes = await groqClient.chat.completions.create({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        messages,
      });

      let fullText = '';
      for await (const chunk of streamRes) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
        }
      }

      return fullText;
    } else {
      const res = await groqClient.chat.completions.create({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        messages,
      });

      return res.choices[0].message.content;
    }
  } catch (err) {
    console.error('Error calling Groq API:', err);
    throw err;
  }
};
