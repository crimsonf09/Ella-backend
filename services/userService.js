import bcrypt from 'bcryptjs';   
import User from '../models/userModel.js'; // ✅ Ensure correct path and filename (User.js)

// Register User
const registerUser = async (userData) => {
    const { email, firstname, middlename, lastname, nickname, department, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({  
        email,
        firstname,
        middlename,
        lastname,
        nickname,
        department,
        password: hashedPassword
    });

    return await newUser.save();
};

// Login User
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Wrong password');
    }

    return user;
};

// Get all Users
const getAllUsers = async () => {
    return await User.find({});
};

// Delete User
const deleteUser = async (email, password) => {
    console.log(password)
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Wrong password');
    }

    const result = await User.deleteOne({ email });
    return result;
};
const getUserProfile = async (email) => {
    const user = await User.find({email});
    if(!user) {
        throw new Error('User not found');
    }
    return user;
}

export {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser,
    getUserProfile
}
