const express = require('express');
const translate = require('google-translate-api-x');
const router = express.Router();

// Translate text
router.post('/', async (req, res) => {
  try {
    const { text, from = 'auto', to = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        miraculous_tip: 'Give me something to translate, like Chat Noir\'s puns! 🐱'
      });
    }

    const result = await translate(text, { from, to });

    // Miraculous language names
    const miraculousLanguages = {
      'en': 'English (Ladybug\'s language)',
      'fr': 'French (Chat Noir\'s language)',
      'es': 'Spanish (Miraculous España)',
      'de': 'German (Miraculous Deutschland)',
      'it': 'Italian (Miraculous Italia)',
      'pt': 'Portuguese (Miraculous Brasil)',
      'ru': 'Russian (Miraculous Россия)',
      'ja': 'Japanese (Miraculous 日本)',
      'ko': 'Korean (Miraculous 한국)',
      'zh': 'Chinese (Miraculous 中国)'
    };

    res.json({
      original_text: text,
      translated_text: result.text,
      source_language: miraculousLanguages[result.from.language.iso] || result.from.language.iso,
      target_language: miraculousLanguages[to] || to,
      confidence: result.from.text.autoCorrected ? 0.85 : 0.95,
      miraculous_accuracy: 'Translated with Ladybug\'s precision! 🎯',
      chat_noir_comment: to === 'fr' ? 'Purrfect French! 🐱' : 'Magnifique translation! ✨',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({
      error: 'Translation service unavailable',
      miraculous_message: 'Even the horse miraculous can\'t teleport this translation! 🐴'
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = {
    'auto': 'Auto-detect (Miraculous Magic)',
    'en': 'English (Ladybug)',
    'fr': 'French (Chat Noir)',
    'es': 'Spanish (Miraculous España)',
    'de': 'German (Miraculous Deutschland)',
    'it': 'Italian (Miraculous Italia)',
    'pt': 'Portuguese (Miraculous Brasil)',
    'ru': 'Russian (Miraculous Россия)',
    'ja': 'Japanese (Miraculous 日本)',
    'ko': 'Korean (Miraculous 한국)',
    'zh-cn': 'Chinese Simplified (Miraculous 中国)',
    'ar': 'Arabic (Miraculous العربية)',
    'hi': 'Hindi (Miraculous हिंदी)',
    'th': 'Thai (Miraculous ไทย)',
    'vi': 'Vietnamese (Miraculous Việt Nam)',
    'tr': 'Turkish (Miraculous Türkiye)',
    'pl': 'Polish (Miraculous Polska)',
    'nl': 'Dutch (Miraculous Nederland)',
    'sv': 'Swedish (Miraculous Sverige)',
    'da': 'Danish (Miraculous Danmark)',
    'no': 'Norwegian (Miraculous Norge)',
    'fi': 'Finnish (Miraculous Suomi)'
  };

  res.json({
    supported_languages: languages,
    total_languages: Object.keys(languages).length,
    miraculous_message: 'Ladybug speaks all languages! 🌍',
    tikki_wisdom: 'Communication brings people together! 💫'
  });
});

// Detect language
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required for detection'
      });
    }

    const result = await translate(text, { to: 'en' });

    res.json({
      text: text,
      detected_language: result.from.language.iso,
      confidence: result.from.text.didYouMean ? 0.7 : 0.9,
      miraculous_detection: 'Language detected with Ladybug\'s keen senses! 🔍'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Language detection failed',
      miraculous_message: 'This language is more mysterious than the peacock miraculous! 🦚'
    });
  }
});

module.exports = router;
