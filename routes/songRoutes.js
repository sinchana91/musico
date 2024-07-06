import express from 'express';
import { Router } from 'express';
import {auth} from '../middleware/auth.js';
const router = Router();
import { createSong,getAllSongs,seachSong} from '../controllers/songController.js';

router.post('/create',auth, createSong);
router.get('/',auth, getAllSongs);
router.get('/search',auth, seachSong);

export default router;
