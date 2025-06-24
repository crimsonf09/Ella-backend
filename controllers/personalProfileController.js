import PersonalProfileService from "../services/personalProfileService";

const createNewPersonalProfile = async (req, res) => {
    try {
        const { email } = req.user; // Get email from authenticated user
        const personalProfile = req.body; // Get profile data from request body
        const newProfile = await PersonalProfileService.createPersonalProfile(email, personalProfile);
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}