import mongoose from 'mongoose';

const taskProfileSchema = new mongoose.Schema({
    TPId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: false },
    taskProfileName: { type: String, required: true },
    content: { type: String, required: true },
    conclusion: { type: String, required: true },
    embedding: [Number],
    created: {
        type: Date,
        default: Date.now
    },lastUsed: {
        type: Date,
        default: Date.now
    },
    share: { type: Boolean, default: false },
});
taskProfileSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        return ret;
    }
});
const TaskProfileModel = mongoose.model('TaskProfile', taskProfileSchema);
export default TaskProfileModel;
