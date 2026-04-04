import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ResumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 1000, // Scalable allowance for standard traffic
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Session logic for OAuth Strategy
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-123',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/test', (req, res) => {
  console.log(">>> /test route was hit successfully!");
  res.send('The server on port 4000 is working!');
});

const allowedOrigins = [
    "http://localhost:5173",
    "https://resume-builder-vrttantam.vercel.app",
    "https://resume-builder-vrttantam-git-main-kartikeys-projects-6ba48c84.vercel.app",
    "https://resume-builder-vrttantam-87wd8c0if-kartikeys-projects-6ba48c84.vercel.app"
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

const vercelpreviewRegex = /https:\/\/.*\.vercel\.app$/;

app.use(cors({
     origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests/Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

//Routes
console.log("--- [server.js] Loading Routes ---");
app.use("/api/auth",authRoutes);
app.use("/api/resume",ResumeRoutes);
app.use("/api/ai",aiRoutes);

//Serve uploads folder
app.use (
  "/uploads",
  express.static(path.join(__dirname,"uploads"),{
    setHeaders:(res, filePath) =>{
      res.set("Access-Control-Allow-Origin","*"); 
      res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    },
  })
)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
