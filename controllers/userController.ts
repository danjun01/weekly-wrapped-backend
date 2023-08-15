import asyncHandler from 'express-async-handler';
import querystring from 'querystring';

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

const loginUser = asyncHandler(asyncHandler(async (req: any, res: any) => {
  var client_id = process.env.CLIENT_ID;
  var redirect_uri = process.env.BASE_URL + '/callback';
  console.log(redirect_uri)
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
})
);

export { registerUser, loginUser };