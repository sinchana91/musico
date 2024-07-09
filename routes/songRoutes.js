import express from 'express';
import { Router } from 'express';
import {auth} from '../middleware/auth.js';
const router = Router();
import { getAllSongs,searchSong} from '../controllers/songController.js';

// router.post('/create',auth, createSong);
router.get('/',auth, getAllSongs);
router.get('/search',auth, searchSong);

export default router;
