import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email }; // pass whole user info
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message); // helpful debug
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
