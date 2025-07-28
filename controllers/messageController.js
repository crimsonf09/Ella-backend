import messageService from '../services/messageService.js';

export const generatePrompt = async(req, res) => {
    try {
        const { PPId, TPIds,role,question,type,messageClass} = req.body;
        console.log(req.body)
        const email = req.user.email;
        const message = await messageService.generatePrompt(email, question,PPId, TPIds, role,type,messageClass );
        res.status(201).json(message.prompt);
    } catch (error) {
        console.error('Error generating prompt:', error.message);
        res.status(400).json({ error: error.message });
    }
};
export const generatePromptSuggestion = async(req, res) => {
    try {
        const { PPId, TPIds,role,question,type,messageClass} = req.body;
        console.log(req.body)
        const email = req.user.email;
        const message = await messageService.generatePromptSuggestion(email, question,PPId, TPIds, role,type,messageClass );
        const payload = {
            score: message.score,
            suggestions: message.suggestions
        };
        console.log('Generated prompt suggestion:', payload);
        res.status(201).json(payload);
    }catch (error) {
        console.error('Error generating prompt suggestion:', error.message);
        res.status(400).json({ error: error.message });
    }
}
export default{
    generatePrompt
}