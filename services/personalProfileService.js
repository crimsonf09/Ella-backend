import PersonalProfile from '../models/personalProfileModel.js';
import { v4 as uuidv4 } from 'uuid';

export const createPersonalProfile = async (email,personalProfile) => {
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
export const getAllPPIdByEmail = async (email) => {
    return await PersonalProfile.find({ email })
        .sort({ created: -1 })
        .select('personalProfileName PPId -_id');
};
export const getPersonalProfileById = async (email, PPId) => {
    return await PersonalProfile.findOne({ PPId, email });
};
export const updatePersonalProfile = async (email, updates) => {
    const {PPId, personalProfileName, content} = updates;
    if (!email||!PPId || !personalProfileName || !content) {
        throw new Error('PPId, personalProfileName, and content are required');
    }

    const updateData = {
        personalProfileName,
        content,
        lastUsed: new Date(), // Update lastUsed timestamp
    };

    const updatedProfile = await PersonalProfile.findOneAndUpdate(
        { PPId,email },           
        updateData,            // Fields to update
        { new: true }          // Return the updated doc
    );

    if (!updatedProfile) {
        throw new Error('PersonalProfile not found');
    }

    return updatedProfile;
};
export const deletePersonalProfile = async (email,PPId) => {
    const result = await PersonalProfile.deleteOne({ email,PPId });
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