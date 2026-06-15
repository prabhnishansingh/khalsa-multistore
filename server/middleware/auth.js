const jwt = require('jsonwebtoken');

const JWT_SECRET = 'KHALSA_JWT_SECRET_2024';

/**
 * JWT authentication middleware.
 * Extracts the token from the Authorization header (Bearer <token>),
 * verifies it, and attaches the decoded user to req.user.
 * Returns 401 if the token is missing or invalid.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
module.exports.JWT_SECRET = JWT_SECRET;
