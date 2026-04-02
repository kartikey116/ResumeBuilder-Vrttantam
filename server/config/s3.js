import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
dotenv.config();

// AWS S3 Client Initialization
const s3Config = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-key-here',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-here',
    }
});

// Resumes Bucket Configuration
export const uploadResumeToS3 = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: process.env.AWS_S3_BUCKET_NAME || 'resume-builder-bucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `resumes/${uniqueSuffix}-${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB Limit per file for scale
    }
});
