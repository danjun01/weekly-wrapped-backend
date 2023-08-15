import express from 'express';
const router = express.Router();

import {
  loginUser,
  registerUser
} from '../controllers/userController';

router.get('/', (req: any, res: any) => {
  console.log('get /api/user');
  res.send('get /api/user');
});
router.post('/', registerUser);
router.get('/login', loginUser);
router.get('/logout', (req: any, res: any) => {
  res.redirect('https://accounts.spotify.com/en/logout');
});


export default router;