import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
const generateAccessToken = (user) => {
    console.log("accesstoken");
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}
const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
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

        const payload = { email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // ✅ Set tokens in custom headers
        res.setHeader('access-token', accessToken);
        res.setHeader('refresh-token', refreshToken);
        console.log(accessToken)
        // ✅ Optional: still return a body (for redundancy)
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const refreshToken = (req, res) => {
    const token = req.headers['refresh-token']

    console.log('refreshToken:', token);

    if (!token) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        const payload = { email: user.email }
        const accessToken = generateAccessToken({ payload });
        res.setHeader('access-token',accessToken)
        return res.status(200).json({message:'access-token sent'})
    });
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
const logout = async (req, res) => {
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    res.sendStatus(204)
}
export {
    register,
    login,
    refreshToken,
    getUsers,
    removeUser,
    updatePassword,
    getProfile,
    logout
};
