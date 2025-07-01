import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshTokenHeader = req.headers['x-refresh-token']; // optional

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No access token provided' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { email, ... }
    
    // Optional: store refreshToken in req if you want to use it later
    if (refreshTokenHeader) {
      req.refreshToken = refreshTokenHeader;
    }

    next();
  } catch (err) {
    console.log('Invalid access token:', accessToken);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};
