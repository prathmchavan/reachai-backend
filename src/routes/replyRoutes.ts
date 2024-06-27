import express from 'express';
import { authenticateToken } from '../middleware/authMiddelware';
import { createTag , generateResponse, listReplies , getEmails} from '../controller/replyController';


const router = express.Router();

router.post('/create-tag', authenticateToken, createTag);
router.post('/generate-response', authenticateToken, generateResponse);
router.post('/list-replies', authenticateToken, listReplies);
router.get('/get-emails', authenticateToken, getEmails);

export default router;
