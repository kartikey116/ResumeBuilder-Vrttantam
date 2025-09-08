// import fs from 'fs';
// import path from 'path';
// import Resume from '../models/Resume.js';
// import upload from '../middlewares/uploadMiddleware.js';


// const uploadResumeImages = async (req,res) => {
//     try {
//         upload.fields([{name:'thumbnail'},{name:'profileImage'},]) (req,res,async (err) =>{
//             if (err) {
//                 return res.status(500).json({message:"Failed to upload images",error:err.message});
//             }

//             const resumeId = req.params.id;
//             const resume = await Resume.findOne({_id:resumeId,userId:req.user._id});
//             if(!resume){
//                 res.status(404).json({message:"Resume not found"});
//             }
//             const uploadsFolder = path.join(__dirname,'..','uploads');
//             const baseUrl = `${req.protocol}://${req.get("host")}`;

//             const newThumbnail = req.files.thumbnail?.[0];
//             const newProfileImage = req.files.profileImage?.[0];

//             // if new thumbnail is provided, update thumbnailLink
//             if(newThumbnail){
//                 if(resume.thumbnailLink){
//                     const oldThumbnail = path.join(uploadsFolder,path.basename(resume.thumbnailLink));
//                     if(fs.existsSync(oldThumbnail)){
//                         fs.unlinkSync(oldThumbnail);
//                     }
//                 }
//                 resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
//             }
//             //if new profile image uploads , delete old one
//             // if(newProfileImage && resume.profileInfo?.profilePreviewUrl){
//             if(newProfileImage){
//                 if(resume.profileInfo?.profilePreviewUrl){
//                     const oldProfileImage = path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl));
//                     if(fs.existsSync(oldProfileImage)){
//                         fs.unlinkSync(oldProfileImage);
//                     }
//                 }
//                 resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
//             }

//             //Save and return updated resume
//             await resume.save();
//             res.status(200).json({
//                 message:"Resume updated successfully",
//                 thumbnailLink:resume.thumbnailLink,
//                 profilePreviewUrl:resume.profileInfo.profilePreviewUrl,
//             });
//         })
//     } catch (error) {
//         console.error("Error uploading resume images",error);
//         res.status(500).json({message:"Failed to upload resume images",error:error.message});
//     }
// }

// export {
//     uploadResumeImages
// };



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Resume from '../models/Resume.js';
import upload from '../middlewares/uploadMiddleware.js';

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadResumeImages = async (req, res) => {
    try {
        // Use the upload middleware first
        upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'profileImage', maxCount: 1 }
        ])(req, res, async (err) => {
            if (err) {
                console.error("Upload middleware error:", err);
                return res.status(400).json({
                    message: "Failed to upload images",
                    error: err.message
                });
            }

            try {
                const resumeId = req.params.id;
                
                // Validate resumeId
                if (!resumeId) {
                    return res.status(400).json({
                        message: "Resume ID is required"
                    });
                }

                // Find the resume
                const resume = await Resume.findOne({
                    _id: resumeId,
                    userId: req.user._id
                });

                if (!resume) {
                    return res.status(404).json({
                        message: "Resume not found or you don't have permission to access it"
                    });
                }

                const uploadsFolder = path.join(__dirname, '..', 'uploads');
                const baseUrl = `${req.protocol}://${req.get("host")}`;

                // Ensure uploads folder exists
                if (!fs.existsSync(uploadsFolder)) {
                    fs.mkdirSync(uploadsFolder, { recursive: true });
                }

                const newThumbnail = req.files?.thumbnail?.[0];
                const newProfileImage = req.files?.profileImage?.[0];

                let thumbnailLink = resume.thumbnailLink || "";
                let profilePreviewUrl = resume.profileInfo?.profilePreviewUrl || "";

                // Handle thumbnail upload
                if (newThumbnail) {
                    try {
                        // Delete old thumbnail if it exists
                        if (resume.thumbnailLink) {
                            const oldThumbnailPath = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                            if (fs.existsSync(oldThumbnailPath)) {
                                fs.unlinkSync(oldThumbnailPath);
                            }
                        }
                        
                        thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
                        resume.thumbnailLink = thumbnailLink;
                    } catch (thumbnailError) {
                        console.error("Error processing thumbnail:", thumbnailError);
                        // Continue without failing the entire operation
                    }
                }

                // Handle profile image upload
                if (newProfileImage) {
                    try {
                        // Initialize profileInfo if it doesn't exist
                        if (!resume.profileInfo) {
                            resume.profileInfo = {};
                        }

                        // Delete old profile image if it exists
                        if (resume.profileInfo.profilePreviewUrl) {
                            const oldProfileImagePath = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                            if (fs.existsSync(oldProfileImagePath)) {
                                fs.unlinkSync(oldProfileImagePath);
                            }
                        }

                        profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
                        resume.profileInfo.profilePreviewUrl = profilePreviewUrl;
                    } catch (profileError) {
                        console.error("Error processing profile image:", profileError);
                        // Continue without failing the entire operation
                    }
                }

                // Save the updated resume
                await resume.save();

                res.status(200).json({
                    message: "Resume images updated successfully",
                    thumbnailLink,
                    profilePreviewUrl,
                    resumeId: resume._id
                });

            } catch (dbError) {
                console.error("Database error:", dbError);
                res.status(500).json({
                    message: "Database error occurred",
                    error: dbError.message
                });
            }
        });

    } catch (error) {
        console.error("Error uploading resume images:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Alternative simpler version if the above doesn't work
const uploadResumeImagesSimple = async (req, res) => {
    try {
        const resumeId = req.params.id;
        
        if (!resumeId) {
            return res.status(400).json({ message: "Resume ID is required" });
        }

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // For testing purposes, just return success without actual file handling
        res.status(200).json({
            message: "Resume found successfully",
            thumbnailLink: resume.thumbnailLink || "",
            profilePreviewUrl: resume.profileInfo?.profilePreviewUrl || "",
            resumeId: resume._id
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export {
    uploadResumeImages,
    uploadResumeImagesSimple
};