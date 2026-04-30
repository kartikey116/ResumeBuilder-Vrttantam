import express from 'express';
import { registerUser, loginUser, getUserProfile, generateToken } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import passport from 'passport';

const router = express.Router();

console.log("--- [authRoutes.js] File is being read, router object created. ---");

//Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
console.log("--- [authRoutes.js] POST /login route has been defined. ---");
router.get('/profile', protect, getUserProfile);

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = generateToken(req.user);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
});

// OAuth GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = generateToken(req.user);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
});

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: "Please upload a file" });
    }
    const imageUrl = req.file.location;
    res.status(200).json({ imageUrl });
});

export default router;