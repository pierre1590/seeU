import express from 'express';
const router = express.Router();
import followUser from '../controllers/followController';
import { protect } from '../middleware/authMiddleware.js';

// route authenticate and protect
router.route('/toggle-follow').post(protect, followUser);

export default router;