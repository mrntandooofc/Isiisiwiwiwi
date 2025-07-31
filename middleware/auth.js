const jwt = require('jsonwebtoken');

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      miraculous_message: 'You need a miraculous to access this! 🐞'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'miraculous-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        miraculous_message: 'Your miraculous has lost its power! 💫'
      });
    }

    req.user = user;
    next();
  });
};

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      miraculous_message: 'Show me your miraculous credentials! 🗝️'
    });
  }

  // In production, validate against database
  const validApiKeys = [
    'ladybug-api-key-2024',
    'chat-noir-secret-key',
    'miraculous-master-key'
  ];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      miraculous_message: 'This key doesn\'t belong to any miraculous holder! 🚫'
    });
  }

  req.apiKey = apiKey;
  next();
};

// Role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        miraculous_message: 'You must be a miraculous holder to access this! 🦸‍♀️'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        miraculous_message: 'Your miraculous doesn\'t have enough power for this! ⚡'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authenticateApiKey,
  requireRole
};
