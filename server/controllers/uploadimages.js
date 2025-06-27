import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import upload from '../middlewares/uploadMiddleware.js';


const uploadResumeImages = async (req,res) => {
    try {
        upload.fields([{name:'thumbnail'},{name:'profileImage'},]) (req,res,async (err) =>{
            if (err) {
                return res.status(500).json({message:"Failed to upload images",error:err.message});
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({_id:resumeId,userId:req.user._id});
            if(!resume){
                res.status(404).json({message:"Resume not found"});
            }
            const uploadsFolder = path.join(__dirname,'..','uploads');
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            // if new thumbnail is provided, update thumbnailLink
            if(newThumbnail){
                if(resume.thumbnailLink){
                    const oldThumbnail = path.join(uploadsFolder,path.basename(resume.thumbnailLink));
                    if(fs.existsSync(oldThumbnail)){
                        fs.unlinkSync(oldThumbnail);
                    }
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }
            //if new profile image uploads , delete old one
            // if(newProfileImage && resume.profileInfo?.profilePreviewUrl){
            if(newProfileImage){
                if(resume.profileInfo?.profilePreviewUrl){
                    const oldProfileImage = path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfileImage)){
                        fs.unlinkSync(oldProfileImage);
                    }
                }
                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            //Save and return updated resume
            await resume.save();
            res.status(200).json({
                message:"Resume updated successfully",
                thumbnailLink:resume.thumbnailLink,
                profilePreviewUrl:resume.profileInfo.profilePreviewUrl,
            });
        })
    } catch (error) {
        console.error("Error uploading resume images",error);
        res.status(500).json({message:"Failed to upload resume images",error:error.message});
    }
}

export {
    uploadResumeImages
};