import { Groq } from 'groq-sdk';
import MessageModel from '../models/messageModel.js';
import { getTaskProfileById } from './taskProfileService.js';
import { getPersonalProfileById } from './personalProfileService.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const sendMessagetoGroq = async (
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
const generatePrompt = async (email, question, PPId, TPIds, user) => {
    let taskProfileText = "";

    if (TPIds) {
        const tpIdArray = Array.isArray(TPIds) ? TPIds : [TPIds];
        for (const TPId of tpIdArray) {
            if (TPId) {
                try {
                    const taskProfile = await getTaskProfileById(email, TPId);
                    if (taskProfile) {
                        taskProfileText += `${taskProfile.taskProfileName}: ${taskProfile.content}\n`;
                    }
                } catch (err) {
                    console.warn(`Failed to retrieve task profile with ID ${TPId}:`, err);
                }
            }
        }
    }

    let personalProfileText = "";
    if (PPId) {
        try {
            const result = await getPersonalProfileById(email, PPId);
            if (result) {
                personalProfileText = result;
            }
        } catch (err) {
            console.warn(`Failed to retrieve personal profile with ID ${PPId}:`, err);
        }
    }

    const systemPrompt = fs.readFileSync('./prompt/generalPrompt.txt', 'utf-8');

    const userPrompt = `Based on the following inputs, generate an Effective Prompt as per the System Prompt guidelines:
User Profile: ${personalProfileText || 'N/A'}

Task Context Profile: ${taskProfileText || 'N/A'}

Question: ${question}`;

    const prompt = await sendMessagetoGroq(userPrompt, systemPrompt, false);

    const newMessage = new MessageModel({
        MId: uuidv4(),
        email,
        question,
        type: 'a',
        PPId: PPId || null,
        TPIds: TPIds || [],
        prompt,
        model: 'lama',
        timestamp: new Date(),
    });

    return await newMessage.save();
};
export default {
    generatePrompt
};