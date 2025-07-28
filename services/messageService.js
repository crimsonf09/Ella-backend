import { Groq } from 'groq-sdk';
import MessageModel from '../models/messageModel.js';
import { getTaskProfileById } from './taskProfileService.js';
import { getPersonalProfileById } from './personalProfileService.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const getUserAndTaskProfileTexts = async (email, PPId, TPIds) => {
    let personalProfileText = '';
    let taskProfileText = '';

    // Get personal profile
    if (PPId) {
        try {
            const result = await getPersonalProfileById(email, PPId);
            if (result) {
                personalProfileText = result;
            } else {
                console.warn('Personal profile returned null/undefined');
            }
        } catch (err) {
            console.error(`Failed to retrieve personal profile ${PPId}:`, err.message);
        }
    }

    // Get task profiles
    if (TPIds) {
        const tpIdArray = Array.isArray(TPIds) ? TPIds : [TPIds];

        for (const TPId of tpIdArray) {
            if (TPId) {
                try {
                    const taskProfile = await getTaskProfileById(email, TPId);
                    if (taskProfile) {
                        taskProfileText += `${taskProfile.taskProfileName}: ${taskProfile.content}\n`;
                    } else {
                        console.warn(`Task profile ${TPId} returned null/undefined`);
                    }
                } catch (err) {
                    console.error(`Failed to retrieve task profile ${TPId}:`, err.message);
                }
            }
        }
    }

    return { personalProfileText, taskProfileText };
};

const sendMessagetoGroq = async (
    userPrompt,
    systemPrompt,
    stream = false
) => {
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];

    console.log('Sending to Groq - User prompt length:', userPrompt.length);
    console.log('Sending to Groq - System prompt length:', systemPrompt.length);

    try {
        if (stream) {
            const streamRes = await groqClient.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                temperature: 1,
                max_tokens: 2048,
                top_p: 1,
                stream: true,
                messages,
            });

            console.log('Groq stream response received');
            let fullText = '';
            for await (const chunk of streamRes) {
                const delta = chunk.choices?.[0]?.delta?.content;
                if (delta) {
                    fullText += delta;
                }
            }

            console.log('Groq stream completed, response length:', fullText.length);
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

            const response = res.choices[0].message.content;
            console.log('Groq response received, length:', response.length);
            return response;
        }
    } catch (err) {
        console.error('Error calling Groq API:', err.message);
        console.error('Groq API Error Details:', err.response?.data || err);
        throw new Error(`Groq API failed: ${err.message}`);
    }
};

const classification = async (question) => {
    try {
        console.log('Starting classification for question:', question);

        const res = await fetch(process.env.CLASSIFICATION_URI + '/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: question
            })
        });

        console.log('Classification API response status:', res.status);

        if (!res.ok) {
            throw new Error(`Classification API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Classification response data:', JSON.stringify(data, null, 2));

        const classLabels = [
            "research_insight",
            "strategy_planning",
            "goal_breakdown",
            "creative_idea_generation",
            "judgment_decision",
            "judgment_hr_decision",
            "idea_validation",
            "paraphrase",
            "candidate_screening"
        ];

        const predArray = data.predicted_array;

        if (!Array.isArray(predArray)) {
            throw new Error('Invalid response: predicted_array is not an array');
        }

        let classLabel = 'general';
        let maxProb = 0;

        console.log('Prediction array:', predArray);

        for (let i = 0; i < predArray.length; i++) {
            if (predArray[i] > maxProb && predArray[i] > 0.15) {
                maxProb = predArray[i];
                classLabel = classLabels[i];
            }
        }

        console.log(`Classification result: ${classLabel} (confidence: ${maxProb.toFixed(3)})`);
        return classLabel;

    } catch (error) {
        console.error('Classification error:', error.message);
        console.warn('Using fallback classification: general');
        return 'general';
    }
}; const generatePrompt = async (email, question, PPId, TPIds, user, type, messageClass) => {
    let systemPrompt = '';
    let userPrompt = '';
    let finalMessageClass = messageClass;

    console.log(`=== Starting generatePrompt ===`);
    console.log(`Type: ${type}`);
    console.log(`Initial messageClass: ${messageClass}`);
    console.log(`Email: ${email}`);
    console.log(`Question: ${question}`);

    try {
        if (type === 'Rewrite & Correct Mode') {

            const greenPromptPath = './prompt/green.txt';
            if (!fs.existsSync(greenPromptPath)) {
                throw new Error(`Green prompt file not found: ${greenPromptPath}`);
            }

            systemPrompt = fs.readFileSync(greenPromptPath, 'utf-8');
            userPrompt = question;

        } else if (type === 'Contextual Expansion Mode' || type === 'Full Prompt Generator Mode') {

            // Handle auto classification
            if (messageClass === 'auto') {
                try {
                    finalMessageClass = await classification(question);
                    console.log('Auto classification completed:', finalMessageClass);
                } catch (error) {
                    console.error('Auto classification failed:', error.message);
                    finalMessageClass = 'general';
                }
            }

            // **Use getUserAndTaskProfileTexts here**
            const { personalProfileText, taskProfileText } = await getUserAndTaskProfileTexts(email, PPId, TPIds);

            console.log('Final messageClass for prompt building:', finalMessageClass);

            // Build system prompt
            try {
                let color = 'blue';
                if (type === 'Full Prompt Generator Mode') {
                    color = 'magenta';
                }
                const generalRulePath = `./prompt/${color}/general_rule.txt`;
                if (!fs.existsSync(generalRulePath)) {
                    throw new Error(`General rule file not found: ${generalRulePath}`);
                }

                systemPrompt = fs.readFileSync(generalRulePath, 'utf-8');

                if (finalMessageClass !== "general") {
                    const classPromptPath = `./prompt/blue/${finalMessageClass}.txt`;
                    console.log(`Looking for class-specific prompt: ${classPromptPath}`);

                    if (fs.existsSync(classPromptPath)) {
                        const classPrompt = fs.readFileSync(classPromptPath, 'utf-8');
                        systemPrompt += '\n\n' + classPrompt;
                        console.log(`Added class-specific prompt for: ${finalMessageClass}`);
                    } else {
                        console.warn(`Class-specific prompt file not found: ${classPromptPath}`);
                        console.warn('Continuing with general prompt only');
                    }
                } else {
                    console.log('Using general prompt only');
                }
            } catch (error) {
                console.error('Error reading prompt files:', error.message);
                throw new Error(`Failed to load system prompts: ${error.message}`);
            }

            // Build user prompt
            userPrompt = `User Profile: ${personalProfileText || 'N/A'}

Task Context Profile: ${taskProfileText || 'N/A'}

Question: ${question}`;


        } else if (type === "Full Prompt Generator Mode") {
            // TODO: Implement full prompt generator logic
            systemPrompt = "You are a helpful AI assistant specialized in generating comprehensive prompts.";
            userPrompt = `Please generate a comprehensive prompt for: ${question}`;

        } else {
            console.warn(`Unknown type: ${type}, using default prompts`);
            systemPrompt = "You are a helpful AI assistant.";
            userPrompt = question;
            finalMessageClass = 'general';
        }

        console.log('=== Sending to Groq ===');
        console.log(`System prompt length: ${systemPrompt}`);
        console.log(`User prompt length: ${userPrompt}`);

        // Send to Groq
        const prompt = await sendMessagetoGroq(userPrompt, systemPrompt, false);

        if (!prompt || prompt.trim().length === 0) {
            throw new Error('Groq returned empty or null response');
        }

        // Prepare TPIds for database
        const dbTPIds = Array.isArray(TPIds) ? TPIds : (TPIds ? [TPIds] : []);

        // Save to database
        const newMessage = new MessageModel({
            MId: uuidv4(),
            email,
            question,
            type,
            classification: finalMessageClass,
            PPId: PPId || null,
            TPIds: dbTPIds,
            prompt,
            model: 'llama', // Fixed typo
            timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        return savedMessage;

    } catch (error) {
        console.error('Error message  generate prompt:', error.message);
        console.error('Stack trace:', error.stack);

        // Re-throw with more context
        throw new Error(`Prompt generation failed: ${error.message}`);
    }
};

const generatePromptSuggestion = async (email, question, PPId, TPIds, user, type, messageClass) => {
    const systemPrompt = fs.readFileSync('./prompt/contextSuggestion.txt', 'utf-8');

    const { personalProfileText, taskProfileText } = await getUserAndTaskProfileTexts(email, PPId, TPIds);

    const userPrompt = `User Profile: ${personalProfileText || 'N/A'}

Task Context Profile: ${taskProfileText || 'N/A'}

Question: ${question}`;

    const output = await sendMessagetoGroq(userPrompt, systemPrompt, false);
//     const output = `called suggestion score: "0.2"
// context suggestion:
//  - not working
//  - not working`
    // console.log('called suggestion', output)
    // Parse score
    const scoreMatch = output.match(/score:"([0-9]*\.?[0-9]+)"/);
    const score = scoreMatch && !isNaN(parseFloat(scoreMatch[1]))
        ? parseFloat(scoreMatch[1])
        : 0;
    // Parse suggestions
    const suggestionsMatch = output.match(/context suggestion:\n((?:\s*-\s.*\n?)*)/);
    const suggestions = suggestionsMatch ? suggestionsMatch[1].trim() : "-";

    return { score, suggestions };
};
// Utility function to check if all required prompt files exist
const checkPromptFiles = () => {
    console.log('=== Checking Prompt Files ===');

    const files = [
        './prompt/green.txt',
        './prompt/blue/general_rule.txt'
    ];

    const classLabels = [
        "research_insight",
        "strategy_planning",
        "goal_breakdown",
        "creative_idea_generation",
        "judgment_decision",
        "judgment_hr_decision",
        "idea_validation",
        "paraphrase",
        "candidate_screening"
    ];

    // Add class-specific files
    classLabels.forEach(label => {
        files.push(`./prompt/blue/${label}.txt`);
    });

    files.forEach(file => {
        const exists = fs.existsSync(file);
        console.log(`${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });
};

export default {
    generatePrompt,
    classification,
    sendMessagetoGroq,
    checkPromptFiles,
    generatePromptSuggestion
};