import express from 'express';
const router = express.Router();

import {
  registerUser
} from '../controllers/userController';

router.post('/', registerUser);
router.post('/auth',);
router.post('/logout',);

export default router;