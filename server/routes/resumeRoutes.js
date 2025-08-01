import express from 'express';
import{
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
} from '../controllers/resumeController.js';
import {protect} from '../middlewares/authMiddleware.js';
import {uploadResumeImages} from '../controllers/uploadimages.js';

const router = express.Router();

router.post('/',protect, createResume); //create resume
router.get('/',protect, getUserResumes); //get resumes
router.get('/:id',protect, getResumeById); //get resume by id
router.put('/:id',protect, updateResume); //update resume
router.put('/upload-images',protect,uploadResumeImages); //upload resume images
router.delete('/:id',protect, deleteResume); //delete resume

export default router;