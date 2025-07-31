require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'miraculous-ladybug-secret-2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Database (if needed)
  DATABASE_URL: process.env.DATABASE_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  
  // Redis (for caching)
  REDIS_URL: process.env.REDIS_URL,
  
  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10MB',
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15, // minutes
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
  
  // Miraculous Configuration
  MIRACULOUS_VERSION: '1.0.0',
  CREATOR: 'Mr Ntando Ofc',
  LADYBUG_MOTTO: 'Miraculous Ladybug APIs - Saving the day, one request at a time! 🐞',
  
  // Feature Flags
  ENABLE_AI: process.env.ENABLE_AI !== 'false',
  ENABLE_YOUTUBE: process.env.ENABLE_YOUTUBE !== 'false',
  ENABLE_WEATHER: process.env.ENABLE_WEATHER !== 'false',
  ENABLE_TRANSLATION: process.env.ENABLE_TRANSLATION !== 'false',
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  SESSION_SECRET: process.env.SESSION_SECRET || 'tikki-plagg-secret',
  
  // External Services
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'ladybug-bot.log'
};
