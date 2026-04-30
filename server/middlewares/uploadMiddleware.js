import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

let region = process.env.AWS_REGION || 'us-east-1';
if (region.includes(' ')) {
    region = region.split(' ').pop();
}

const s3Config = new S3Client({
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-key-here',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-here',
    }
});

//file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg .jpg and .png formats are allowed'), false);
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: process.env.AWS_S3_BUCKET_NAME || 'resume-builder-bucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `images/${uniqueSuffix}-${file.originalname.replace(/\\s+/g, '-')}`);
        }
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;