import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Option 1: From custom header (preferred for full header-based design)
  const accessToken = req.headers['access-token'];
  const refreshTokenHeader = req.headers['refresh-token']; // optional

  // Optionally, allow fallback to Authorization Bearer header (for compatibility)
  // const bearerHeader = req.headers.authorization;
  // const fallbackToken = bearerHeader?.startsWith('Bearer ') ? bearerHeader.split(' ')[1] : null;
  // const token = accessToken || fallbackToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized: No access token provided' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // e.g., { email }

    if (refreshTokenHeader) {
      req.refreshToken = refreshTokenHeader;
    }

    next();
  } catch (err) {
    console.log('Invalid access token:', accessToken);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};
