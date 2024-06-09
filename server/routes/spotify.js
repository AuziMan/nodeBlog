const express = require('express');
const router = express.Router();
const { getTopTracks } = require('../config/spotify'); // Adjust the path accordingly

/**
 * GET /songs
 * Songs Page
 */
router.get('/songs', async (req, res) => {
  try {
    const topTracks = await getTopTracks();
    res.render('songs', { topTracks });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
