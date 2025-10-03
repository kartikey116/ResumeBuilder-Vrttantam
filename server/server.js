import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ResumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();
app.use(express.json());

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

app.use(cors({
     origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests/Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

//Routes
console.log("--- [server.js] Attempting to load authRoutes ---");
app.use("/api/auth",authRoutes);
app.use("/api/resume",ResumeRoutes);

//Serve uploads folder
app.use (
  "/uploads"
  ,express.static(path.join(__dirname,"uploads"),{
    setHeaders:(res,path) =>{
      res.set("Access-Control-Allow-Origin","http://localhost:3000");
    },
  })
)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
