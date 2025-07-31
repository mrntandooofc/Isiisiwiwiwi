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
      miraculous_encryption: 'Secured with Ladybug\'s unbreakable protection! 🛡️',
      tikki_approved: true,
      security_level: 'Miraculous Grade',
      hash_time: '~100ms'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Password hashing failed',
      miraculous_message: 'Even Cataclysm couldn\'t destroy this encryption! 💥'
    });
  }
});

// Verify password hash
router.post('/password/verify', async (req, res) => {
  try {
    const { password, hash } = req.body;

    if (!password || !hash) {
      return res.status(400).json({
        error: 'Both password and hash are required',
        miraculous_tip: 'I need both the password and hash to verify! 🔍'
      });
    }

    const isValid = await bcrypt.compare(password, hash);

    res.json({
      password_matches: isValid,
      verification_status: isValid ? 'SUCCESS' : 'FAILED',
      miraculous_verdict: isValid ? 'Password verified by Ladybug! ✅' : 'Access denied by Chat Noir! ❌',
      security_check: isValid ? 'PASSED' : 'FAILED',
      tikki_says: isValid ? 'Welcome back!' : 'That\'s not the right password!',
      verification_time: '~50ms'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Password verification failed',
      miraculous_message: 'The verification kwami is sleeping! 😴'
    });
  }
});

// URL shortener
router.post('/url/shorten', (req, res) => {
  try {
    const { url, custom_alias } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        miraculous_tip: 'Give me a URL to make miraculous and short! 🔗'
      });
    }

    // Simple URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({
        error: 'Invalid URL format',
        miraculous_tip: 'URL should start with http:// or https:// 🌐'
      });
    }

    const shortCode = custom_alias || Math.random().toString(36).substring(2, 8);
    const shortUrl = `https://lb.bot/${shortCode}`;

    res.json({
      original_url: url,
      short_url: shortUrl,
      short_code: shortCode,
      clicks: 0,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      miraculous_compression: 'URL shrunk with Multimouse power! 🐭',
      qr_code_available: true,
      analytics_enabled: true
    });

  } catch (error) {
    res.status(500).json({
      error: 'URL shortening failed',
      miraculous_message: 'This URL is longer than Chat Noir\'s staff! 🐱'
    });
  }
});

// Base64 encode/decode
router.post('/base64/encode', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        miraculous_tip: 'Give me some text to encode! 📝'
      });
    }

    const encoded = Buffer.from(text, 'utf8').toString('base64');

    res.json({
      original_text: text,
      encoded_text: encoded,
      encoding: 'base64',
      original_length: text.length,
      encoded_length: encoded.length,
      miraculous_transformation: 'Text transformed by Tikki\'s magic! ✨',
      reversible: true
    });

  } catch (error) {
    res.status(500).json({
      error: 'Base64 encoding failed',
      miraculous_message: 'This text is more complex than the Miracle Box code! 📦'
    });
  }
});

router.post('/base64/decode', (req, res) => {
  try {
    const { encoded_text } = req.body;

    if (!encoded_text) {
      return res.status(400).json({
        error: 'Encoded text is required',
        miraculous_tip: 'Give me some base64 text to decode! 🔓'
      });
    }

    const decoded = Buffer.from(encoded_text, 'base64').toString('utf8');

    res.json({
      encoded_text: encoded_text,
      decoded_text: decoded,
      encoding: 'base64',
      encoded_length: encoded_text.length,
      decoded_length: decoded.length,
      miraculous_revelation: 'Secret message revealed by Ladybug! 🔍',
      successfully_decoded: true
    });

  } catch (error) {
    res.status(400).json({
      error: 'Invalid base64 string',
      miraculous_message: 'This code is more scrambled than Chat Noir\'s brain! 🧠'
    });
  }
});

// Color palette generator
router.get('/colors/palette', (req, res) => {
  try {
    const { theme = 'miraculous', count = 5 } = req.query;
    const colorCount = Math.min(Math.max(parseInt(count), 1), 20);

    const themes = {
      miraculous: {
        name: 'Miraculous Ladybug',
        colors: ['#FF1744', '#000000', '#FFD600', '#2196F3', '#4CAF50'],
        description: 'Official Miraculous Ladybug color scheme'
      },
      ladybug: {
        name: 'Ladybug Red',
        colors: ['#FF1744', '#D50000', '#FF5722', '#E91E63', '#F44336'],
        description: 'Various shades of Ladybug red'
      },
      chat_noir: {
        name: 'Chat Noir Black',
        colors: ['#000000', '#212121', '#424242', '#616161', '#757575'],
        description: 'Chat Noir inspired dark colors'
      },
      paris: {
        name: 'Paris Sunset',
        colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2'],
        description: 'Colors of Paris at sunset'
      },
      kwami: {
        name: 'Kwami Magic',
        colors: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'],
        description: 'Magical kwami colors'
      }
    };

    const selectedTheme = themes[theme] || themes.miraculous;
    let palette = [...selectedTheme.colors];

    // Generate additional colors if needed
    while (palette.length < colorCount) {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      palette.push(randomColor);
    }

    palette = palette.slice(0, colorCount);

    res.json({
      theme: selectedTheme.name,
      description: selectedTheme.description,
      colors: palette.map((color, index) => ({
        hex: color,
        rgb: hexToRgb(color),
        name: `Color ${index + 1}`,
        miraculous_name: getMiraculousColorName(color)
      })),
      count: palette.length,
      miraculous_inspiration: 'Colors blessed by the kwamis! 🎨',
      perfect_for: ['Web design', 'Art projects', 'Miraculous fan art', 'UI themes']
    });

  } catch (error) {
    res.status(500).json({
      error: 'Color palette generation failed',
      miraculous_message: 'The rainbow kwami is taking a break! 🌈'
    });
  }
});

// Helper functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getMiraculousColorName(hex) {
  const colorNames = {
    '#FF1744': 'Ladybug Red',
    '#000000': 'Chat Noir Black',
    '#FFD600': 'Tikki Gold',
    '#2196F3': 'Plagg Blue',
    '#4CAF50': 'Lucky Green',
    '#9C27B0': 'Hawk Moth Purple',
    '#FF5722': 'Akuma Orange',
    '#E91E63': 'Miraculous Pink'
  };
  return colorNames[hex.toUpperCase()] || 'Miraculous Color';
}

// Random joke generator
router.get('/joke', (req, res) => {
  try {
    const { category = 'miraculous' } = req.query;

    const jokes = {
      miraculous: [
        {
          setup: "Why doesn't Chat Noir ever get lost?",
          punchline: "Because he always lands on his feet!",
          rating: "Purrfect! 😸"
        },
        {
          setup: "What's Ladybug's favorite type of music?",
          punchline: "Spot-ify playlists!",
          rating: "Miraculous! 🐞"
        },
        {
          setup: "Why is Plagg always hungry?",
          punchline: "Because destruction takes a lot of energy!",
          rating: "Cheesy! 🧀"
        },
        {
          setup: "What does Hawk Moth use to style his hair?",
          punchline: "Akuma-gel!",
          rating: "Villainously funny! 🦋"
        },
        {
          setup: "Why is Tikki so good at giving advice?",
          punchline: "She's been around for thousands of years!",
          rating: "Wise and witty! ✨"
        }
      ],
      general: [
        {
          setup: "Why don't scientists trust atoms?",
          punchline: "Because they make up everything!",
          rating: "Classic! 😄"
        },
        {
          setup: "What do you call a fake noodle?",
          punchline: "An impasta!",
          rating: "Pasta-bly funny! 🍝"
        }
      ]
    };

    const selectedJokes = jokes[category] || jokes.miraculous;
    const randomJoke = selectedJokes[Math.floor(Math.random() * selectedJokes.length)];

    res.json({
      category: category,
      setup: randomJoke.setup,
      punchline: randomJoke.punchline,
      rating: randomJoke.rating,
      miraculous_humor: 'Joke approved by Chat Noir! 😸',
      dad_joke_level: Math.floor(Math.random() * 10) + 1,
      tikki_giggles: true
    });

  } catch (error) {
    res.status(500).json({
      error: 'Joke generation failed',
      miraculous_message: 'Even Chat Noir\'s puns are better than this error! 😿'
    });
  }
});

module.exports = router;
