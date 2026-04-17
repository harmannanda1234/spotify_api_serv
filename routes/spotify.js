const express = require('express');
const querystring = require('querystring');
require('dotenv').config(); // ✅ IMPORTANT

const sprouter = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3030/token/callback';


// 🔹 Step 1: Login
sprouter.get('/getClientlogin', (req, res) => {
  const scope = 'user-top-read user-read-private user-read-email';
  const state = Math.random().toString(36).substring(2, 15); // simple state

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});


// 🔹 Step 2: Callback
sprouter.get('/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.status(400).json({ error: 'User denied access' });
  }

  if (!code) {
    return res.status(400).json({ error: 'No code received' });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
      }),
    });

    const data = await response.json();

    console.log("TOKEN RESPONSE:", code);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Callback failed' });
  }
});

module.exports = sprouter;