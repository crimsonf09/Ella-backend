import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // 1. Try reading token from cookie
  let token = req.cookies?.token;

  // Log for debugging
  console.log('🔐 Token from cookie:', token);
  console.log('🔐 Authorization header:', req.headers.authorization);

  // 2. Fallback: try reading token from Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 3. If still no token, reject the request
  if (!token) {
    console.warn('⛔ No token found in cookie or Authorization header');
    return res.status(401).json({ error: 'Token missing' });
  }

  // 4. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    console.log('✅ Token verified for user:', req.user.email);
    next();
  } catch (err) {
    console.error('⛔ Invalid or expired token:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
