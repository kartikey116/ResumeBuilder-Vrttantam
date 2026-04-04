import express from 'express';
import { parseResumeToJSON, atsScore, enhanceBulletPoint, importResumeToDashboard, anonymizeAndPublish } from '../controllers/aiController.js';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Local Memory Storage for parsing text out of PDF without saving to disk
const uploadMemory = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/parse-resume', uploadMemory.single('resumePdf'), parseResumeToJSON);
router.post('/import-resume', protect, uploadMemory.single('resumePdf'), importResumeToDashboard); // Phase 1
router.post('/ats-score', atsScore);
router.post('/enhance-bullet', enhanceBulletPoint);
router.post('/anonymize-publish', protect, anonymizeAndPublish); // Phase 2

export default router;
