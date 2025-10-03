import express from 'express';
import {registerUser, loginUser, getUserProfile} from '../controllers/authController.js';
import {protect} from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

console.log("--- [authRoutes.js] File is being read, router object created. ---"); // <-- ADD THIS

//Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
console.log("--- [authRoutes.js] POST /login route has been defined. ---"); // <-- ADD THIS
router.get('/profile', protect, getUserProfile);

router.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({msg:"Please upload a file"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});

export default router;