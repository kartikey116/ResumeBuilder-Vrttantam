import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ResumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import './workers/aiWorker.js'; // Initialize the BullMQ Worker to process background AI jobs
import templateRoutes from './routes/templateRoutes.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();

// Security Middlewares
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added urlencoded

// WORKAROUND for Express 5 vs express-mongo-sanitize:
// Express 5 makes req.query immutable. This makes it writable again so the sanitizer doesn't crash.
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true, // This is the crucial fix
    enumerable: true,
    configurable: true
  });
  next();
});

// Data Sanitization must come AFTER express.json()
app.use(mongoSanitize());

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

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
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
    if (allowedOrigins.indexOf(origin) !== -1 || vercelpreviewRegex.test(origin)) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

//Routes
console.log("--- [server.js] Loading Routes ---");
app.use("/api/auth", authRoutes);
app.use("/api/resume", ResumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/templates", templateRoutes);


//Serve uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    },
  })
)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error. Please try again later.';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { dev_error_details: err.message, stack: err.stack }),
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
