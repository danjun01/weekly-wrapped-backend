import asyncHandler from 'express-async-handler';
import querystring from 'querystring';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createPlaylist = asyncHandler(async (req: any, res: any) => {
  try {
    const { userId, title } = req.body;

    2
    3
    4
    5
    6
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const playlist = await prisma.playlist.create({
      data: {
        title: title,
        songs: {},
        playlistLength: 0,
        createdAt: date,
        updatedAt: date,
        createdBy: {
          connect: { id: userId }
        },
        userId: userId
      }
    });

    console.log(playlist);
  }
  catch (err) {

  }
});