import { Groq } from 'groq-sdk';
import groqConfig from '../config/groq.js';


const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
export const sendLlamaPrompt = async (userPrompt, systemPrompt = 'You are a helpful assistant.', stream = false) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
  console.log(messages)
  try {
    if (stream) {
      const streamRes = await groqClient.chat.completions.create({
        model: 'llama3-70b-8192',
        messages,
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
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
        model: 'llama3-70b-8192',
        messages,
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false
      });

      return res.choices[0].message.content;
    }
  } catch (err) {
    console.error('Error calling Groq API:', err);
    throw err; 
  }
};
