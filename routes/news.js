const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get latest news
router.get('/latest', async (req, res) => {
  try {
    const { category = 'general', country = 'us' } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      // Return mock news if no API key
      const mockNews = [
        {
          title: 'Ladybug and Chat Noir Save Paris Again!',
          description: 'The miraculous duo thwarts another akuma attack in the heart of Paris.',
          source: 'Miraculous News Network',
          url: 'https://miraculous.news/ladybug-saves-paris',
          published_at: new Date().toISOString(),
          miraculous_rating: '⭐⭐⭐⭐⭐'
        },
        {
          title: 'New Miraculous Holder Spotted in London',
          description: 'Witnesses report seeing a new superhero with butterfly-like powers.',
          source: 'Global Miraculous Report',
          url: 'https://miraculous.news/new-holder-london',
          published_at: new Date(Date.now() - 3600000).toISOString(),
          miraculous_rating: '⭐⭐⭐⭐'
        },
        {
          title: 'Hawk Moth\'s Latest Scheme Foiled by Quick Thinking',
          description: 'Citizens of Paris can rest easy as our heroes prevent another catastrophe.',
          source: 'Paris Daily Miraculous',
          url: 'https://miraculous.news/hawk-moth-foiled',
          published_at: new Date(Date.now() - 7200000).toISOString(),
          miraculous_rating: '⭐⭐⭐⭐⭐'
        },
        {
          title: 'Master Fu\'s Wisdom: New Miraculous Training Methods',
          description: 'Ancient techniques revealed for the next generation of miraculous holders.',
          source: 'Miraculous Academy',
          url: 'https://miraculous.news/master-fu-wisdom',
          published_at: new Date(Date.now() - 10800000).toISOString(),
          miraculous_rating: '⭐⭐⭐⭐'
        },
        {
          title: 'Tikki and Plagg: The Science Behind Kwami Powers',
          description: 'Researchers attempt to understand the miraculous energy source.',
          source: 'Miraculous Science Journal',
          url: 'https://miraculous.news/kwami-science',
          published_at: new Date(Date.now() - 14400000).toISOString(),
          miraculous_rating: '⭐⭐⭐'
        }
      ];

      return res.json({
        articles: mockNews,
        total_results: mockNews.length,
        category: category,
        miraculous_message: 'All the latest miraculous news! 📰',
        akuma_incidents_today: 0,
        ladybug_status: 'All clear! Paris is safe! 🐞'
      });
    }

    // Real news API call
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
    );

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      image_url: article.urlToImage,
      published_at: article.publishedAt,
      miraculous_rating: '⭐'.repeat(Math.floor(Math.random() * 5) + 1)
    }));

    res.json({
      articles: articles,
      total_results: response.data.totalResults,
      category: category,
      country: country,
      miraculous_message: 'Fresh news delivered by Ladybug\'s speed! 🐞',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('News Error:', error);
    res.status(500).json({
      error: 'News service unavailable',
      miraculous_message: 'Even the news kwami needs a break sometimes! 📰'
    });
  }
});

// Search news
router.get('/search', async (req, res) => {
  try {
    const { q, sortBy = 'publishedAt' } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!q) {
      return res.status(400).json({
        error: 'Search query is required',
        miraculous_tip: 'Tell me what news you\'re looking for! 🔍'
      });
    }

    if (!apiKey) {
      // Mock search results
      const mockResults = [
        {
          title: `Miraculous Search: ${q}`,
          description: `Latest updates about ${q} in the miraculous world.`,
          source: 'Miraculous Search Engine',
          url: `https://miraculous.news/search/${q}`,
          published_at: new Date().toISOString(),
          miraculous_relevance: 'Highly relevant! 🎯'
        }
      ];

      return res.json({
        articles: mockResults,
        query: q,
        total_results: mockResults.length,
        miraculous_message: 'Search completed with Ladybug\'s precision! 🔍'
      });
    }

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${q}&sortBy=${sortBy}&apiKey=${apiKey}`
    );

    const articles = response.data.articles.slice(0, 20).map(article => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      image_url: article.urlToImage,
      published_at: article.publishedAt,
      miraculous_relevance: Math.random() > 0.5 ? 'Highly relevant! 🎯' : 'Somewhat relevant 📰'
    }));

    res.json({
      articles: articles,
      query: q,
      total_results: response.data.totalResults,
      sort_by: sortBy,
      miraculous_message: `Found ${articles.length} miraculous articles! 🔍`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Search service unavailable',
      miraculous_message: 'The search kwami is hiding! 🔍'
    });
  }
});

// Get news by source
router.get('/source/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.json({
        articles: [
          {
            title: `Latest from ${source}`,
            description: `Top stories from ${source} in the miraculous universe.`,
            source: source,
            url: `https://miraculous.news/source/${source}`,
            published_at: new Date().toISOString(),
            miraculous_authenticity: 'Verified by Ladybug! ✅'
          }
        ],
        source: source,
        miraculous_message: `News from ${source} delivered! 📰`
      });
    }

    const response = await axios.get(
      `https://newsapi.org/v2/everything?sources=${source}&apiKey=${apiKey}`
    );

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image_url: article.urlToImage,
      published_at: article.publishedAt,
      miraculous_authenticity: 'Verified by Ladybug! ✅'
    }));

    res.json({
      articles: articles,
      source: source,
      total_results: response.data.totalResults,
      miraculous_message: `All articles from ${source}! 📰`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Source news unavailable',
      miraculous_message: 'This news source is more elusive than Hawk Moth! 📰'
    });
  }
});

module.exports = router;
