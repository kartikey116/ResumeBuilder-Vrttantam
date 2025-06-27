import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ResumeRoutes from './routes/ResumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || "*" || "http://localhost:5173",
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

//Routes
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
