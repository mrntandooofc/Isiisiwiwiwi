const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const router = express.Router();

// Generate QR Code
router.post('/qr/generate', async (req, res) => {
  try {
    const { 
      text, 
      size = 256, 
      format = 'png', 
      error_correction = 'M',
      margin = 4 
    } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        miraculous_tip: 'Give me something to encode, like a miraculous message! 🐞'
      });
    }

    const options = {
      width: parseInt(size),
      margin: parseInt(margin),
      errorCorrectionLevel: error_correction,
      type: format,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    const qrCodeDataURL = await QRCode.toDataURL(text, options);

    res.json({
      status: 'generated',
      text: text,
      qr_code_data: qrCodeDataURL,
      size: `${size}x${size}`,
      format: format,
      error_correction: error_correction,
      miraculous_encoding: 'QR Code blessed by Tikki\'s precision! 📱',
      spots_included: 'For extra luck! 🐞',
      scan_tip: 'Scan with any QR code reader!'
    });

  } catch (error) {
    console.error('QR Generation Error:', error);
    res.status(500).json({
      error: 'QR code generation failed',
      miraculous_message: 'This code is more complex than the Miracle Box! 📦'
    });
  }
});

// Generate UUID
router.get('/uuid', (req, res) => {
  try {
    const { version = 4, count = 1 } = req.query;
    const maxCount = Math.min(parseInt(count) || 1, 100);
    
    const uuids = [];
    for (let i = 0; i < maxCount; i++) {
      uuids.push(uuidv4());
    }

    res.json({
      uuids: uuids,
      count: maxCount,
      version: version,
      format: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
      miraculous_uniqueness: 'Each UUID is as unique as a miraculous! ✨',
      tikki_blessed: true,
      use_cases: [
        'Database primary keys',
        'Session identifiers',
        'File naming',
        'API request tracking',
        'Miraculous holder IDs'
      ]
    });

  } catch (error) {
    res.status(500).json({
      error: 'UUID generation failed',
      miraculous_message: 'Even the horse miraculous can\'t teleport this ID! 🐴'
    });
  }
});

// Generate secure password
router.post('/password/generate', (req, res) => {
  try {
    const { 
      length = 16, 
      include_uppercase = true,
      include_lowercase = true,
      include_numbers = true,
      include_symbols = true,
      exclude_ambiguous = false
    } = req.body;

    const passwordLength = Math.min(Math.max(parseInt(length), 8), 128);
    
    let charset = '';
    if (include_lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (include_uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (include_numbers) charset += '0123456789';
    if (include_symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (exclude_ambiguous) {
      charset = charset.replace(/[0O1lI]/g, '');
    }

    if (!charset) {
      return res.status(400).json({
        error: 'At least one character type must be included',
        miraculous_tip: 'A password needs some variety, like Ladybug\'s powers! 🐞'
      });
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Calculate password strength
    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;

    const strengthLevels = {
      0: 'Very Weak',
      25: 'Weak',
      50: 'Fair',
      75: 'Good',
      90: 'Strong',
      100: 'Very Strong'
    };

    const strengthLevel = Object.keys(strengthLevels)
      .reverse()
      .find(level => strength >= parseInt(level));

    res.json({
      password: password,
      length: passwordLength,
      strength: strengthLevels[strengthLevel],
      strength_score: `${strength}/100`,
      character_types: {
        uppercase: include_uppercase,
        lowercase: include_lowercase,
        numbers: include_numbers,
        symbols: include_symbols
      },
      miraculous_security: 'Protected by Ladybug\'s lucky charm! 🍀',
      ladybug_approved: strength >= 75,
      security_tips: [
        'Never share your password',
        'Use unique passwords for each account',
        'Enable two-factor authentication',
        'Store passwords securely'
      ]
    });

  } catch (error) {
    res.status(500).json({
      error: 'Password generation failed',
      miraculous_message: 'Even Chat Noir\'s claws couldn\'t scratch this password! 🐱'
    });
  }
});

// Hash password
router.post('/password/hash', async (req, res) => {
  try {
    const { password, rounds = 12 } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password is required',
        miraculous_tip: 'Provide a password to hash! 🔐'
      });
    }

    const saltRounds = Math.min(Math.max(parseInt(rounds), 10), 15);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    res.json({
      original_length: password.length,
      hashed_password: hashedPassword,
      salt_rounds: saltRounds,
      hash_algorithm: 'bcrypt',
      miraculous_encryption: 
