const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get cryptocurrency prices
router.get('/prices', async (req, res) => {
  try {
    const { symbols = 'bitcoin,ethereum,cardano,polkadot,chainlink' } = req.query;
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );

    const prices = response.data;
    const miraculousCoins = {};

    Object.keys(prices).forEach(coin => {
      const data = prices[coin];
      const change = data.usd_24h_change || 0;
      
      miraculousCoins[coin] = {
        price: `$${data.usd.toLocaleString()}`,
        change_24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        market_cap: data.usd_market_cap ? `$${(data.usd_market_cap / 1000000000).toFixed(2)}B` : 'N/A',
        miraculous_status: change > 5 ? 'Lucky Charm! 🍀' : change < -5 ? 'Cataclysm! 💥' : 'Stable as Ladybug! 🐞',
        chat_noir_rating: change > 0 ? 'Purrfect! 😸' : 'Cat-astrophic! 😿'
      };
    });

    // Add some miraculous coins
    miraculousCoins.ladybug_coin = {
      price: '$12.34',
      change_24h: '+15.7%',
      market_cap: '$1.2B',
      miraculous_status: 'Miraculous Bull Run! 🚀',
      chat_noir_rating: 'Absolutely claw-some! 🐱'
    };

    miraculousCoins.tikki_token = {
      price: '$0.567',
      change_24h: '+8.9%',
      market_cap: '$89M',
      miraculous_status: 'Tikki approved! ✨',
      chat_noir_rating: 'Sweet like cookies! 🍪'
    };

    res.json({
      prices: miraculousCoins,
      last_updated: new Date().toISOString(),
      miraculous_market_analysis: 'The crypto market is as unpredictable as akuma attacks! 📈',
      ladybug_advice: 'Always do your research before investing! 🔍',
      chat_noir_wisdom: 'Don\'t put all your coins in one basket! 🧺'
    });

  } catch (error) {
    console.error('Crypto Error:', error);
    res.status(500).json({
      error: 'Crypto service unavailable',
      miraculous_message: 'The crypto kwami is taking a break! 💎'
    });
  }
});

// Get specific coin details
router.get('/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );

    const coin = response.data;
    
    res.json({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: `$${coin.market_data.current_price.usd.toLocaleString()}`,
      market_cap: `$${(coin.market_data.market_cap.usd / 1000000000).toFixed(2)}B`,
      total_volume: `$${(coin.market_data.total_volume.usd / 1000000).toFixed(2)}M`,
      price_change_24h: `${coin.market_data.price_change_percentage_24h.toFixed(2)}%`,
      price_change_7d: `${coin.market_data.price_change_percentage_7d.toFixed(2)}%`,
      all_time_high: `$${coin.market_data.ath.usd.toLocaleString()}`,
      description: coin.description.en.split('.')[0] + '.',
      miraculous_rating: '⭐'.repeat(Math.min(5, Math.max(1, Math.round(coin.market_data.market_cap_rank / 200)))),
      ladybug_analysis: 'This coin shows promise, but remember - with great power comes great responsibility! 🐞'
    });

  } catch (error) {
    res.status(404).json({
      error: 'Coin not found',
      miraculous_message: 'This coin is more elusive than Hawk Moth! 🦋'
    });
  }
});

// Crypto news
router.get('/news', async (req, res) => {
  try {
    // Mock crypto news (you can integrate with real news APIs)
    const news = [
      {
        title: 'Bitcoin Reaches New Heights Like Ladybug on Eiffel Tower',
        summary: 'Bitcoin soars to new levels, showing miraculous strength in the market.',
        source: 'Miraculous Crypto News',
        timestamp: new Date().toISOString(),
        miraculous_impact: 'Positive like a Lucky Charm! 🍀'
      },
      {
        title: 'Ethereum Updates Bring Chat Noir Level Agility',
        summary: 'New Ethereum improvements make transactions faster than Chat Noir\'s reflexes.',
        source: 'Crypto Miraculous',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        miraculous_impact: 'Agile as a cat! 🐱'
      },
      {
        title: 'DeFi Protocols Show Tikki-Level Reliability',
        summary: 'Decentralized finance continues to prove its stability and trustworthiness.',
        source: 'Miraculous Finance',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        miraculous_impact: 'Reliable as Tikki\'s wisdom! ✨'
      }
    ];

    res.json({
      news: news,
      total_articles: news.length,
      miraculous_insight: 'Stay informed to make miraculous investment decisions! 📰'
    });

  } catch (error) {
    res.status(500).json({
      error: 'News service unavailable',
      miraculous_message: 'Even the news is hiding from Hawk Moth! 📰'
    });
  }
});

module.exports = router;
