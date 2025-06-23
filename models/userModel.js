import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';   

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    middlename: { type: String, required: false },
    lastname: { type: String, required: true },
    nickname: { type: String, required: false },
    created: {
        type: Date,
        default: Date.now
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    department: { type: String, required: true },
    password: { type: String, required: true },
})
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret._id;
        delete ret.created;
        delete ret.lastUsed;
        return ret;
    }
});
const UserModel = mongoose.model('User', userSchema);

export default UserModel