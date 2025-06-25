import TaskProfileModel from '../models/taskProfileModel.js';
import { v4 as uuidv4 } from 'uuid';

export const createTaskProfile = async (email, taskProfile) => {
    const { taskProfileName, content } = taskProfile;

    const newTaskProfile = new TaskProfileModel({
        TPId: uuidv4(),
        email,
        taskProfileName,
        content,
        conclusion:"in short",
        embedding:[0,9,90,9],
        share: false,
    });
    return await newTaskProfile.save();
}
export const getAllTPIdByEmail = async (email) => {
    return await TaskProfileModel.find({ email })
        .sort({ created: -1 })
        .select('taskProfileName TPId -_id');
}
export const getTaskProfileById = async (email, TPId) => {
    return await TaskProfileModel.findOne({ TPId, email });
}
export const updateTaskProfile = async (email, updates) => {
    const { TPId, taskProfileName, content } = updates;
    if (!email || !TPId || !taskProfileName || !content) {
        throw new Error('TPId, taskProfileName, content and conclusion are required');
    }
//update conclusion



    const updateData = {
        taskProfileName,
        content,
        conclusion:"new conclusion",
        lastUsed: new Date(),
    };

    const updatedProfile = await TaskProfileModel.findOneAndUpdate(
        { TPId, email },
        updateData,            // Fields to update
        { new: true }          // Return the updated doc
    );

    if (!updatedProfile) {
        throw new Error('TaskProfile not found');
    }

    return updatedProfile;
}
const deleteTaskProfile = async (email, TPId) => {
    const result = await TaskProfileModel.deleteOne({ email, TPId });
    if (result.deletedCount === 0) {
        throw new Error('TaskProfile not found');
    }  
    return { message: 'TaskProfile deleted successfully' };
}
export default {
    createTaskProfile,
    getAllTPIdByEmail,
    getTaskProfileById,
    updateTaskProfile,
    deleteTaskProfile
}