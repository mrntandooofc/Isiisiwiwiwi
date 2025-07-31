const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    miraculous_message: 'Even Ladybug needs to rest! Please wait before making more requests. 🐞'
  }
});
app.use('/api/', limiter);

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/image', require('./routes/image'));
app.use('/api/tts', require('./routes/tts'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/news', require('./routes/news'));
app.use('/api/utils', require('./routes/utils'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Miraculous! All systems operational! 🐞',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    creator: 'Mr Ntando Ofc',
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    miraculous_message: 'Oops! Even Ladybug makes mistakes sometimes. Please try again! 🐞'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    miraculous_message: 'This path is more lost than Chat Noir without his ring! 🐱'
  });
});

app.listen(PORT, () => {
  console.log(`🐞 Ladybug Bot APIs running on port ${PORT}`);
  console.log(`🎭 Created by Mr Ntando Ofc`);
  console.log(`🌟 Miraculous APIs are ready to save the day!`);
});
