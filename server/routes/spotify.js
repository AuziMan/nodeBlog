const express = require('express');
const router = express.Router();
const { getTopTracks, getNowPlaying } = require('../config/spotify'); // Adjust the path accordingly

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


// router.get('/nowPlaying', async (req, res) => {
//   try {
//     const response = await getNowPlaying();
//     //console.log('Raw Response:', response);  // Log raw response

//     // Check response status
//     if (!response || response.status === 204 || response.status > 400) {
//       return res.status(200).json({ isPlaying: false });
//     }

//     // Parse JSON only if the response is okay
//     const song = await response.json();

//     // Check if the song object has the expected structure
//     if (!song || !song.item) {
//       return res.status(200).json({ isPlaying: false });
//     }

//     const isPlaying = song.is_playing;
//     const title = song.item.name;
//     const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
//     const album = song.item.album.name;
//     const albumImageUrl = song.item.album.images[0].url;
//     const songUrl = song.item.external_urls.spotify;

//     res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

//     return res.status(200).json({
//       album,
//       albumImageUrl,
//       artist,
//       isPlaying,
//       songUrl,
//       title,
//     });
//   } catch (error) {
//     console.error('Error fetching now playing track:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



module.exports = router;
