const rateLimit = require('express-rate-limit');

// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    miraculous_message: 'Even Ladybug needs to rest! Please slow down. 🐞',
    retry_after: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limit for resource-intensive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per hour
  message: {
    error: 'Rate limit exceeded for this operation',
    miraculous_message: 'This power requires time to recharge, like a miraculous! ⚡',
    retry_after: '1 hour'
  }
});

// AI/OpenAI specific rate limit
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    error: 'AI rate limit exceeded',
    miraculous_message: 'Tikki needs a cookie break! Please wait before asking again. 🍪',
    retry_after: '1 minute'
  }
});

// YouTube download rate limit
const youtubeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 downloads per 10 minutes
  message: {
    error: 'Download rate limit exceeded',
    miraculous_message: 'Too many downloads! Even Chat Noir can\'t handle this much music! 🎵',
    retry_after: '10 minutes'
  }
});

module.exports = {
  generalLimiter,
  strictLimiter,
  aiLimiter,
  youtubeLimiter
};
