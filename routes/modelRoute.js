import express from 'express';
import { modelResponse } from '../controllers/modelController.js';

const router = express.Router();

router.post('/', modelResponse);

export default router;
