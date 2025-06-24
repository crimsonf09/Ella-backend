import PersonalProfile from '../models/PersonalProfile.js';
import { v4 as uuidv4 } from 'uuid';

const createPersonalProfile = async (email,personalProfile) => {
    const {personalProfileName, content} = personalProfile;
    const newPersonalProfile = new PersonalProfile({
        PPId: uuidv4(),
        email,
        personalProfileName,
        content,
        share:false,
    });
    return await newPersonalProfile.save();
};
const getAllPPIdByEmail = async (email) => {
    return await PersonalProfile.find({ email })
        .sort({ created: -1 })
        .select('personalProfileName PPId -_id');
};
const getPersonalProfileById = async (email, PPId) => {
    return await PersonalProfile.findOne({ PPId, email });
};
const updatePersonalProfile = async (PPId, updates) => {
    const { personalProfileName, content } = updates;

    if (!PPId || !personalProfileName || !content) {
        throw new Error('PPId, personalProfileName, and content are required');
    }

    const updateData = {
        personalProfileName,
        content,
        lastUsed: new Date(), // Update lastUsed timestamp
    };

    const updatedProfile = await PersonalProfile.findOneAndUpdate(
        { PPId },               // Search by PPId
        updateData,            // Fields to update
        { new: true }          // Return the updated doc
    );

    if (!updatedProfile) {
        throw new Error('PersonalProfile not found');
    }

    return updatedProfile;
};
const deletePersonalProfile = async (PPId) => {
    const result = await PersonalProfile.deleteOne({ PPId });
    if (result.deletedCount === 0) {
        throw new Error('PersonalProfile not found');
    }
    return { message: 'PersonalProfile deleted successfully' };
};
export default {
    createPersonalProfile,
    getAllPPIdByEmail,
    getPersonalProfileById,
    updatePersonalProfile,
    deletePersonalProfile
}