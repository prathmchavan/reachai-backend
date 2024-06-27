import express from 'express';
import { addProvider , checkAccessToken,getAccessToken } from '../controller/providerController';
import { authenticateToken } from '../middleware/authMiddelware';



const router = express.Router();

router.post('/add-provider', authenticateToken, addProvider);
router.post('/check-access-token', authenticateToken, checkAccessToken);
router.post('/get-access-token', authenticateToken, getAccessToken);

export default router;
