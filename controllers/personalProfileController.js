import PersonalProfileService from "../services/personalProfileService.js";

export const createPersonalProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const personalProfile = req.body;
        const newProfile = await PersonalProfileService.createPersonalProfile(email, personalProfile);
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getAllPersonalProfiles = async (req, res) => {
    try {
        console.log('getAllPp')
        const email = req.user.email;
        console.log("pprofile cont",email)
        const profiles = await PersonalProfileService.getAllPPIdByEmail(email);
        res.status(200).json(profiles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// FIXED: Use req.query for GET
export const getPersonalProfileById = async (req, res) => {
    try {
        const email = req.user.email;
        const { PPId } = req.query; // <-- FIX HERE
        const profile = await PersonalProfileService.getPersonalProfileById(email, PPId);
        if (!profile) {
            return res.status(404).json({ error: 'Personal Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

export const updatePersonalProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const updates = req.body; 
        const updatedProfile = await PersonalProfileService.updatePersonalProfile(email, updates);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const removePersonalProfile = async (req, res) => {
    try{
        const email = req.user.email;
        const { PPId } = req.body;
        const result = await PersonalProfileService.deletePersonalProfile(email, PPId);
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({ error: error.message }); 
    }
}

export default {
    createPersonalProfile,
    getAllPersonalProfiles,
    getPersonalProfileById,
    updatePersonalProfile,
    removePersonalProfile
}