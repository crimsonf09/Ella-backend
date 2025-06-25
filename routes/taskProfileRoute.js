import express from 'express';
import * as TaskProfileController from '../controllers/taskProfileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createTaskProfile', protect, TaskProfileController.createTaskProfile);
router.get('/getAllTaskProfile', protect, TaskProfileController.getAllTaskProfiles);
router.get('/getTaskProfile', protect, TaskProfileController.getTaskProfileById);
router.put('/updateTaskProfile', protect, TaskProfileController.updateTaskProfile); 
router.delete('/deleteTaskProfile', protect, TaskProfileController.removeTaskProfile);

export default router;