import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getSidebarUsers } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/sidebarUsers', protectRoute, getSidebarUsers);
export default router;