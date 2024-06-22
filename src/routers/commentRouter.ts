import express from 'express';
import { storValidationRule } from '../validators/storeValidator';
import { validateFileds } from '../middlewares/validateFileds';
import { allowedFileds } from '../validators/storeValidator';
import { createComment, createReply } from '../controllers/commentController';
import { jwtAuthenticator } from '../middlewares/auth';

const router = express.Router();

// 待更新
router.post('/event/:eventId/messageBoard', jwtAuthenticator, createComment);
router.post('/event/:eventId/messageBoard/:messageId/reply', jwtAuthenticator, createReply)

export default router;
