import express from 'express';
import { Router } from 'express';

const router = Router();
import { login, register } from '../controllers/authController.js';

router.post('/login', login);
router.post('/register', register);

export default router;
