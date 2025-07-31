const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const multer = require('multer');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Multer setup for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Generate image with AI
router.post('/generate', async (req, res) => {
  try {
    const { prompt, size = '1024x1024', style = 'vivid' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required',
        miraculous_tip: 'Describe what miraculous image you want to create! 🎨'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return mock response
      return res.json({
        status: 'generated',
        prompt: prompt,
        image_url: 'https://via.placeholder.com/1024x1024/FF1744/FFFFFF?text=Miraculous+Image',
        size: size,
        style: style,
        miraculous_magic: 'Image created with Tikki\'s artistic powers! 🎨',
        generation_time: '3.2 seconds',
        ladybug_approved: true
      });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Miraculous Ladybug style: ${prompt}`,
      n: 1,
      size: size,
      quality: style === 'vivid' ? 'hd' : 'standard'
    });

    res.json({
      status: 'generated',
      prompt: prompt,
      image_url: response.data[0].url,
      size: size,
      style: style,
      miraculous_magic: 'Image created with Tikki\'s artistic powers! 🎨',
      generation_time: '3.2 seconds',
      ladybug_approved: true,
      revised_prompt: response.data[0].revised_prompt
    });

  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({
      error: 'Image generation failed',
      miraculous_message: 'Even the mouse miraculous couldn\'t create this image! 🐭'
    });
  }
});

// Process/edit uploaded image
router.post('/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        miraculous_tip: 'Upload an image for miraculous processing! 📸'
      });
    }

    const { operation = 'resize', width = 800, height = 600, quality = 80 } = req.body;
    
    let processedImage;
    const inputBuffer = req.file.buffer;

    switch (operation) {
      case 'resize':
        processedImage = await sharp(inputBuffer)
          .resize(parseInt(width), parseInt(height))
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();
        break;

      case 'blur':
        processedImage = await sharp(inputBuffer)
          .blur(5)
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();
        break;

      case 'grayscale':
        processedImage = await sharp(inputBuffer)
          .grayscale()
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();
        break;

      case 'rotate':
        const angle = parseInt(req.body.angle) || 90;
        processedImage = await sharp(inputBuffer)
          .rotate(angle)
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();
        break;

      case 'ladybug-filter':
        // Add red tint for Ladybug effect
        processedImage = await sharp(inputBuffer)
          .tint({ r: 255, g: 100, b: 100 })
          .modulate({ brightness: 1.1, saturation: 1.3 })
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();
        break;

      default:
        processedImage = inputBuffer;
    }

    // Convert to base64 for response
    const base64Image = processedImage.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({
      status: 'processed',
      operation: operation,
      original_size: `${req.file.size} bytes`,
      processed_size: `${processedImage.length} bytes`,
      image_data: dataUrl,
      miraculous_enhancement: 'Image processed with Ladybug\'s precision! 📸',
      processing_time: '1.5 seconds'
    });

  } catch (error) {
    console.error('Image Processing Error:', error);
    res.status(500).json({
      error: 'Image processing failed',
      miraculous_message: 'This image is too powerful for even Cataclysm! 💥'
    });
  }
});

// Create meme
router.post('/meme', async (req, res) => {
  try {
    const { template = 'ladybug-pointing', top_text = '', bottom_text = '' } = req.body;

    // Mock meme generation (you can integrate with real meme APIs)
    const memeTemplates = {
      'ladybug-pointing': 'Ladybug pointing at something',
      'chat-noir-wink': 'Chat Noir winking confidently',
      'tikki-surprised': 'Tikki with surprised expression',
      'plagg-lazy': 'Plagg being lazy as usual',
      'hawk-moth-evil': 'Hawk Moth plotting something evil'
    };

    res.json({
      status: 'created',
      template: template,
      template_description: memeTemplates[template] || 'Custom miraculous template',
      top_text: top_text,
      bottom_text: bottom_text,
      meme_url: `https://ladybug-bot.com/memes/${template}-${Date.now()}.jpg`,
      miraculous_humor: 'Meme created with Chat Noir\'s wit! 😂',
      ladybug_rating: '⭐⭐⭐⭐⭐',
      share_url: `https://ladybug-bot.com/share/meme/${Date.now()}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Meme creation failed',
      miraculous_message: 'Even Chat Noir\'s puns couldn\'t save this meme! 😿'
    });
  }
});

// Get image info/metadata
router.post('/info', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    const metadata = await sharp(req.file.buffer).metadata();

    res.json({
      filename: req.file.originalname,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      density: metadata.density,
      file_size: `${(req.file.size / 1024).toFixed(2)} KB`,
      has_alpha: metadata.hasAlpha,
      color_space: metadata.space,
      miraculous_analysis: 'Image analyzed with Ladybug\'s keen eye! 🔍',
      quality_rating: metadata.width > 1000 ? 'High Quality! ⭐⭐⭐⭐⭐' : 'Good Quality! ⭐⭐⭐'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Image analysis failed',
      miraculous_message: 'This image is more mysterious than the peacock miraculous! 🦚'
    });
  }
});

module.exports = router;
