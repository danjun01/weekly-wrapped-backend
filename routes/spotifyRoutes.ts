import express from 'express';
import { callback, getRefreshToken } from '../controllers/userController';
const router = express.Router();

router.get('/callback', callback);
router.get('/refresh_token', getRefreshToken);

export default router;