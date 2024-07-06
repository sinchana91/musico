import express from 'express';
import { Router } from 'express';
import {auth} from '../middleware/auth.js';
const router = Router();
import { getRecommendtion} from

router.get('/recommendation',auth, getRecommendtion);

export default router;
