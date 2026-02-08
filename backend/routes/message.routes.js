import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessages } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/:conversationId', protectRoute, getMessages);
export default router;