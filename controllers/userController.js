import * as userService from '../services/userService.js';
import createToken from '../utils/tokenUtils.js';

const register = async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await userService.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        const token = createToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const removeUser = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.deleteUser(email);
        res.status(200).json({ message: 'User deleted', result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userService.changePassword(email, newPassword);
        res.status(200).json({ message: 'Password updated', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export {
    register, login,
    getUsers,
    removeUser,
    updatePassword
};