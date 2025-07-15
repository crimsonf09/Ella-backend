import TaskProfileService from '../services/taskProfileService.js';

export const createTaskProfile = async (req, res) => {
    try{
        const email = req.user.email;
        const taskProfile = req.body;
        const newProfile = await TaskProfileService.createTaskProfile(email, taskProfile);
        res.status(201).json(newProfile);
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getAllTaskProfiles = async (req, res) => {
    try {
        const email = req.user.email;
        const profiles = await TaskProfileService.getAllTPIdByEmail(email);
        res.status(200).json(profiles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// FIX: Use req.query.TPId for GET
export const getTaskProfileById = async (req, res) => {
    try {
        const email = req.user.email;
        const { TPId } = req.query; // <--- FIXED HERE
        const profile = await TaskProfileService.getTaskProfileById(email, TPId);
        if (!profile) {
            return res.status(404).json({ error: 'Task Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

export const updateTaskProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const updates = req.body; 
        const updatedProfile = await TaskProfileService.updateTaskProfile(email, updates);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const removeTaskProfile = async (req, res) => {
    try{
        const email = req.user.email;
        const { TPId } = req.body;
        const result = await TaskProfileService.deleteTaskProfile(email, TPId);
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({ error: error.message }); 
    }
}

export default {
    createTaskProfile,
    getAllTaskProfiles,
    getTaskProfileById,
    updateTaskProfile,
    removeTaskProfile
}