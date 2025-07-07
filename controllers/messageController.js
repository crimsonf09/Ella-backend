import messageService from '../services/messageService.js';

export const generatePrompt = async(req, res) => {
    try {
        const { PPId, TPIds,role,question } = req.body;
        const email = req.user.email;
        const message = await messageService.generatePrompt(email, question,PPId, TPIds, role );
        res.status(201).json(message.prompt);
    } catch (error) {
        console.error('Error generating prompt:', error.message);
        res.status(400).json({ error: error.message });
    }
};
export default{
    generatePrompt
}