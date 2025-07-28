import express from 'express';
import * as MessageController from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generatePrompt',protect, MessageController.generatePrompt);
router.post('/promptSuggestion', protect, MessageController.generatePromptSuggestion);
export default router;