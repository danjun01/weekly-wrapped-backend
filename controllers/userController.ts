import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req: any, res: any) => {

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

export { registerUser };