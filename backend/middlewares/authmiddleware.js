const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
      }

      req.user = user; // Attach decoded user (id, role)
      next();
    });

  } catch (err) {
    console.error('JWT middleware error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateToken;
