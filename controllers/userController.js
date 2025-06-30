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
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = createToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // required for SameSite=None
            sameSite: 'None', // because extension is cross-origin
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        });

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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
        const { password } = req.body;
        const email = req.user.email;
        console.log(email, password);

        const result = await userService.deleteUser(email, password);

        // Clear cookie with same options as when set
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
        });

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

const getProfile = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.user || !req.user.email) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const profile = await userService.getUserProfile(req.user.email);

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    register,
    login,
    getUsers,
    removeUser,
    updatePassword,
    getProfile
};
