import express from 'express';
import { callback } from '../controllers/userController';
const router = express.Router();

router.get('/', callback);

export default router;