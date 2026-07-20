const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      // Attach decoded user info to the request object
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Token validation error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token has expired' });
      }
      
      return res.status(401).json({ message: 'Not authorized, token is invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
