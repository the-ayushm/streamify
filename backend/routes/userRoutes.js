import express from 'express';
import protectRoute from '../middleware/protectRoute';
import { getSidebarUsers } from '../controllers/user.controller';
const router = express.Router();

router.get('/sidebarUsers', protectRoute, getSidebarUsers);