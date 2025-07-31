const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ladybug AI Chat
router.post('/chat', async (req, res) => {
  try {
    const { message, conversation_id } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        miraculous_tip: 'Tell Ladybug what you need help with! 🐞'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Ladybug AI, a helpful assistant created by Mr Ntando Ofc for the Ladybug Bot. 
          You have the wisdom of Ladybug and the playfulness of Chat Noir. Always be helpful, positive, 
          and include miraculous references in your responses. End responses with a relevant emoji.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    res.json({
      response: completion.choices[0].message.content,
      conversation_id: conversation_id || `lb_${Date.now()}`,
      tokens_used: completion.usage.total_tokens,
      model: "ladybug-gpt-3.5-miraculous",
      timestamp: new Date().toISOString(),
      miraculous_wisdom: "Remember, every problem has a solution! 🐞"
    });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      miraculous_message: 'Even Tikki needs a break sometimes! Please try again. 🐞'
    });
  }
});

// AI Image Analysis
router.post('/analyze-image', async (req, res) => {
  try {
    const { image_url, prompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Analyze this image with Ladybug's keen eye for detail." },
            { type: "image_url", image_url: { url: image_url } }
          ]
        }
      ],
      max_tokens: 300
    });

    res.json({
      analysis: response.choices[0].message.content,
      confidence: 0.95,
      miraculous_insight: "Ladybug's vision reveals all secrets! 🔍"
    });

  } catch (error) {
    res.status(500).json({
      error: 'Image analysis failed',
      miraculous_message: 'The image is too mysterious even for Ladybug! 🐞'
    });
  }
});

module.exports = router;
