import express from 'express';
import { parseResumeToJSON, atsScore, enhanceBulletPoint } from '../controllers/aiController.js';
import multer from 'multer';

const router = express.Router();

// Local Memory Storage for parsing text out of PDF without saving to disk or S3 first.
const uploadMemory = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/parse-resume', uploadMemory.single('resumePdf'), parseResumeToJSON);
router.post('/ats-score', atsScore);
router.post('/enhance-bullet', enhanceBulletPoint);

export default router;
