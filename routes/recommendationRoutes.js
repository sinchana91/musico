import express from 'express';
import { Router } from 'express';
import {auth} from '../middleware/auth.js';
const router = Router();
import {recommendSongs} from '../controllers/recommendationController.js';

router.get('/recommendation', recommendSongs);

export default router;
