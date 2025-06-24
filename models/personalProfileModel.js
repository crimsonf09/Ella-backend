import mongoose from "mongoose";

const personalProfileSchema = new mongoose.Schema({
    PPId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: false },
    personalProfileName: { type: String, required: true },
    content: { type: String, required: true },
    created: {
        type: Date,
        default: Date.now
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    share:{type: Boolean, default: false},
});    
personalProfileSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.created;
        delete ret.lastUsed;
        return ret;
    }
});
const PersonalProfileModel = mongoose.model('PersonalProfile', personalProfileSchema);
export default PersonalProfileModel;