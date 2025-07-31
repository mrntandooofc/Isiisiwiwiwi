const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get weather by city
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Weather service not configured',
        miraculous_message: 'The weather kwami is sleeping! 🌤️'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weather = response.data;
    
    // Miraculous weather conditions
    const miraculousConditions = {
      'clear sky': 'Perfect for Ladybug patrol! ☀️',
      'few clouds': 'Ideal for rooftop jumping! ⛅',
      'scattered clouds': 'Great visibility for spotting akumas! 🌤️',
      'broken clouds': 'Chat Noir weather - mysterious! ☁️',
      'shower rain': 'Umbrella weather - watch for akumas! 🌧️',
      'rain': 'Stormy like an akuma attack! ⛈️',
      'thunderstorm': 'Hawk Moth weather alert! ⚡',
      'snow': 'Frozen like Frozer! ❄️',
      'mist': 'Mysterious like the peacock miraculous! 🌫️'
    };

    res.json({
      city: weather.name,
      country: weather.sys.country,
      temperature: `${Math.round(weather.main.temp)}°C`,
      feels_like: `${Math.round(weather.main.feels_like)}°C`,
      condition: weather.weather[0].description,
      humidity: `${weather.main.humidity}%`,
      wind_speed: `${weather.wind.speed} m/s`,
      pressure: `${weather.main.pressure} hPa`,
      visibility: `${weather.visibility / 1000} km`,
      miraculous_forecast: miraculousConditions[weather.weather[0].description] || 'Weather fit for a superhero! 🐞',
      akuma_alert_level: weather.main.temp > 30 ? 'High' : weather.main.temp < 0 ? 'Medium' : 'Low',
      ladybug_rating: '⭐'.repeat(Math.min(5, Math.max(1, Math.round(weather.main.temp / 6)))),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather Error:', error);
    
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'City not found',
        miraculous_message: 'This city is more hidden than the Miracle Box! 🗃️'
      });
    } else {
      res.status(500).json({
        error: 'Weather service unavailable',
        miraculous_message: 'The weather kwami is having a bad day! 🌪️'
      });
    }
  }
});

// Get weather forecast
router.get('/:city/forecast', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecast = response.data.list.slice(0, 5).map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      time: new Date(item.dt * 1000).toLocaleTimeString(),
      temperature: `${Math.round(item.main.temp)}°C`,
      condition: item.weather[0].description,
      humidity: `${item.main.humidity}%`
    }));

    res.json({
      city: response.data.city.name,
      forecast: forecast,
      miraculous_prediction: 'The future looks bright for superhero activities! 🌟'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Forecast service unavailable',
      miraculous_message: 'Even Bunnyx can\'t predict this weather! 🐰'
    });
  }
});

module.exports = router;
