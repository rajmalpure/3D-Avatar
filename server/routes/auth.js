import express from 'express';
import {
  signup,
  login,
  getMe,
  logout,
  googleAuth,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;
