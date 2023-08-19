import asyncHandler from 'express-async-handler';
import querystring from 'querystring';
import axios from 'axios';

import generateRandomString from '../utils/generateRandomString';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req: any, res: any) => {
  console.log()
  const { name, email, token } = req.body;

  const userExists = await prisma.user.findFirst({
    where: { email: email }
  });

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  }
  else {
    await prisma.$connect();

    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          spotifyOAuthToken: token,
        },
      });

      console.log('New user created:', newUser);
      res.status(201).json(newUser);
    }
    catch (err) {
      console.error('User could not be created:', err);
      res.status(500).json({ error: 'User creation failed' });
    }
    finally {
      prisma.$disconnect();
    }
  }
});

const loginUser = asyncHandler(async (req: any, res: any) => {
  var client_id = process.env.CLIENT_ID;
  var redirect_uri = process.env.BASE_URL + '/spotify/callback';
  console.log(redirect_uri)
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';
  req.session.state = state;

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

const callback = asyncHandler(async (req: any, res: any) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var expected_state = req.session.state;
  var redirect_uri = process.env.BASE_URL + '/spotify/callback';
  var client_id = process.env.CLIENT_ID;
  var client_secret = process.env.CLIENT_SECRET;


  if (state === null || state !== expected_state) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    delete req.session.state;
    const authHeader = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      data: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    axios(authOptions)
      .then((response: any) => {
        if (response.status === 200) {

          const { access_token, refresh_token } = response.data;
          req.session.access_token = access_token;
          req.session.refresh_token = refresh_token;

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': `Bearer ${access_token}` },
            json: true
          };

          // use the access token to access the Spotify Web API
          axios.get(options.url, { headers: options.headers })
            .then(apiRes => {
              console.log(apiRes.data);
            })
            .catch(apiErr => {
              console.error('Spotify API Error:', apiErr)
            });

          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
  }
});

const getRefreshToken = asyncHandler(async (req: any, res: any) => {
  var client_id = process.env.CLIENT_ID;
  var client_secret = process.env.CLIENT_SECRET;
  var refresh_token = req.query.refresh_token;
  const authHeader = 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    headers: { 'Authorization': authHeader },
    data: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  axios(authOptions)
    .then((response: any) => {
      if (response.status === 200) {
        var access_token = response.data;
        res.send({
          'access_token': access_token
        });
        req.session.access_token = access_token;
      }
    });
});

export { registerUser, loginUser, callback, getRefreshToken };