export const protect = (req, res, next) => {
    let token = req.cookies?.token;

    // Allow token from Authorization header as fallback
    console.log("Token from cookie:", req.cookies?.token);
    console.log("Authorization header:", req.headers.authorization);

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
