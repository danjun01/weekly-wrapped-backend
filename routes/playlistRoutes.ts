import express from 'express';
const router = express.Router();

router.get('/create', () => { console.log('mesg') });


export default router;