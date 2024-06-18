const { response } = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// Get access Token
const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};



// Get Top tracks
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

const getTopTracks = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();
  console.log('Spotify Response Successful'); // Log the response data
  return data;
};




// Get Now Playing from spotify

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const getNowPlaying = async () => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        //console.log(data);
        return {
          data,
          isPlaying: true,
        }
        
      } else {
          return { isPlaying: false };      
        }
    } else if (response.status === 204) {
      // No content playing
      return { isPlaying: false };
    } else {
      throw new Error(`HTTP status ${response.status} (${response.statusText})`);
    }
  } catch (error) {
    console.error('Error fetching now playing track:', error);
    throw error; // Propagate the error to handle it further up the call stack
  }
};


module.exports = {
  getNowPlaying,
  getTopTracks
};
