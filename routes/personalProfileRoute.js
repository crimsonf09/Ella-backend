import express from 'express';
import * as PersonalProfileController from '../controllers/personalProfileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createPersonalProfile',protect, PersonalProfileController.createPersonalProfile);
router.get('/getAllPersonalProfile',protect, PersonalProfileController.getAllPersonalProfiles);
router.get('/getPersonalProfile',protect, PersonalProfileController.getPersonalProfileById);
router.put('/updatePersonalProfile', protect, PersonalProfileController.updatePersonalProfile);
router.delete('/deletePersonalProfile',protect, PersonalProfileController.removePersonalProfile);

export default router; 