import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    MId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: false },
    PPId: [{ type: String, required: false, unique: false }], 
    TPIds: [{type: String, required:false}],
    timestamp:{
        type: Date,
        default: Date.now
    },
    question:{ type: String, required: true },
    type: { type: String, required: true },
    classification: { type: String, required: true },
    prompt: { type: String, required: true },
    model:{ type: String, required: true },
});
messageSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        return ret;
    }
});
const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
