import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh',userController.refreshToken);
router.get('/users', protect, userController.getUsers);
router.get('/profile',protect, userController.getProfile);
router.delete('/delete', protect, userController.removeUser);
router.put('/change-password', protect, userController.updatePassword);

export default router; 