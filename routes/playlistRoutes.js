import express from 'express';
import { Router } from 'express';
import {auth} from '../middleware/auth.js';
const router = Router();
import { createPlaylist,getUserPlaylists,getUserById,deletePlaylist,updatePlaylist} from '../controllers/playlistController.js';

router.post('/create',auth, createPlaylist);
router.get('/',auth, getUserPlaylists);
router.get('/:id',auth, getUserById);
router.delete('/:id',auth, deletePlaylist);
router.put('/:id',auth, updatePlaylist);




export default router;
