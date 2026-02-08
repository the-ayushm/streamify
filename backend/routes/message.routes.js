import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessages , sendMessages} from '../controllers/message.controller.js';
const router = express.Router();

router.get('/:conversationId', protectRoute, getMessages);
router.post('/', protectRoute, sendMessages);
export default router;