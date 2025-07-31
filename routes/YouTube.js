const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// YouTube to MP3
router.post('/mp3', async (req, res) => {
  try {
    const { url, quality = 'highestaudio' } = req.body;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({
        error: 'Invalid YouTube URL',
        miraculous_tip: 'Make sure your URL is as perfect as Ladybug\'s yo-yo! 🐞'
      });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const filename = `${title}_${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, '../temp', filename);

    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
    }

    const stream = ytdl(url, {
      quality: quality,
      filter: 'audioonly'
    });

    ffmpeg(stream)
      .audioBitrate(320)
      .save(outputPath)
      .on('end', () => {
        res.json({
          status: 'success',
          title: info.videoDetails.title,
          duration: info.videoDetails.lengthSeconds,
          quality: '320kbps',
          download_url: `/api/download/${filename}`,
          file_size: 'Processing...',
          miraculous_quality: 'Crystal clear like Ladybug\'s voice! 🎵'
        });

        // Clean up file after 1 hour
        setTimeout(() => {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        }, 3600000);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({
          error: 'Conversion failed',
          miraculous_message: 'Even Chat Noir\'s cataclysm couldn\'t break this audio! 🐱'
        });
      });

  } catch (error) {
    console.error('YouTube MP3 Error:', error);
    res.status(500).json({
      error: 'YouTube service error',
      miraculous_message: 'The video is hiding better than Hawk Moth! 🦋'
    });
  }
});

// YouTube to MP4
router.post('/mp4', async (req, res) => {
  try {
    const { url, quality = 'highest' } = req.body;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({
        error: 'Invalid YouTube URL',
        miraculous_tip: 'Check that URL like Ladybug checks for akumas! 🐞'
      });
    }

    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    
    if (formats.length === 0) {
      return res.status(400).json({
        error: 'No suitable video format found',
        miraculous_message: 'This video is more elusive than Hawk Moth! 🦋'
      });
    }

    res.json({
      status: 'success',
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      available_qualities: formats.map(f => f.qualityLabel).filter(Boolean),
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      download_info: 'Use /download-mp4 endpoint with format selection',
      miraculous_quality: 'Ready for transformation! 🎬'
    });

  } catch (error) {
    console.error('YouTube MP4 Error:', error);
    res.status(500).json({
      error: 'YouTube service error',
      miraculous_message: 'This video is protected by miraculous magic! 🐞'
    });
  }
});

// Get video info
router.get('/info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({
        error: 'Invalid YouTube URL'
      });
    }

    const info = await ytdl.getInfo(url);
    
    res.json({
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      duration: info.videoDetails.lengthSeconds,
      views: info.videoDetails.viewCount,
      author: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      upload_date: info.videoDetails.uploadDate,
      miraculous_rating: '⭐⭐⭐⭐⭐'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get video info'
    });
  }
});

module.exports = router;
