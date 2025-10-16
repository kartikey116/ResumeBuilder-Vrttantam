import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createResume = async (req,res) => {
    try {
        const {title} = req.body;

        //Default templates
        const defaultResumeData = {
            profileInfo:{ 
                profileImg:null,
                profilePreviewUrl:" ",
                fullName:" ",
                designation:" ",
                summary:" ",
            },
            contactInfo:{
                email:" ",
                phone:" ",
                location:" ",
                linkedin:" ",
                github:" ",
                website:" ",
            },
            workExperience:[
                {
                    company:" ",
                    role:" ",
                    startDate:" ",
                    endDate:" ",
                    description:" ",
                },
            ],
            education:[
                {
                    degree:" ",
                    field:" ",
                    startDate:" ",
                    endDate:" ",
                }           
            ],
            skills:[
                {
                    name:" ",
                    progress:0,
                },
            ],
            projects:[
                {
                    title:" ",
                    description:" ",
                    github:" ",
                    liveDemo:" ",
                }
            ],
            certifications:[
                {
                    title:" ",
                    issuer:" ",
                    year:" ",
                }
            ],
            languages:[
                {
                    name:" ",
                    progress:0,
                }
            ],
            interests:[" "],
        };

        const newResume = await Resume.create({
            userId:req.user._id,
            title,
            ...defaultResumeData,
        });
        res.status(201).json({message:"Resume created successfully",resume:newResume});
        
    } catch (error) {
        res.status(500).json({message:"Failed to Create Resume",error:error.message});
    }
};


const getUserResumes = async (req,res) => {
    try {
        const resumes = await Resume.find({userId:req.user._id}).sort({updatedAt:-1});
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({message:"Failed to get resumes",error:error.message});
    }
}

const getResumeById = async (req,res) => {
    try {
        if(!req.params.id){
            res.status(400).json({message:"Resume id is required"});
        }
        const resume = await Resume.findOne({_id:req.params.id,userId:req.user._id});
        if(!resume){
            res.status(404).json({message:"Resume not found"});
        }
        res.status(200).json(resume);
    } catch (error) {
      res.status(500).json({message:"Failed to get resume",error:error.message});
    }
}



const updateResume = async (req, res) => {
    try {
        console.log("Update resume request for ID:", req.params.id);
        console.log("Request body:", JSON.stringify(req.body, null, 2));

        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            console.log("Resume not found");
            return res.status(404).json({ message: "Resume not found" });
        }

        // Safely update each field
        if (req.body.title !== undefined) resume.title = req.body.title;
        if (req.body.thumbnailLink !== undefined) resume.thumbnailLink = req.body.thumbnailLink;
        
        // Update template
        if (req.body.template) {
            resume.template = {
                theme: req.body.template.theme || resume.template?.theme || "",
                colorPalette: req.body.template.colorPalette || resume.template?.colorPalette || [],
                fontFamily: req.body.template.fontFamily || resume.template?.fontFamily || ""
            };
        }

        // Update profileInfo
        if (req.body.profileInfo) {
            resume.profileInfo = {
                ...resume.profileInfo,
                fullName: req.body.profileInfo.fullName || resume.profileInfo?.fullName || "",
                designation: req.body.profileInfo.designation || resume.profileInfo?.designation || "",
                summary: req.body.profileInfo.summary || resume.profileInfo?.summary || "",
                profilePreviewUrl: req.body.profileInfo.profilePreviewUrl || resume.profileInfo?.profilePreviewUrl || "",
            };
        }

        // Update contactInfo
        if (req.body.contactInfo) {
            resume.contactInfo = {
                ...resume.contactInfo,
                ...req.body.contactInfo
            };
        }

        // Update arrays
        if (req.body.workExperience) resume.workExperience = req.body.workExperience;
        if (req.body.education) resume.education = req.body.education;
        if (req.body.skills) resume.skills = req.body.skills;
        if (req.body.projects) resume.projects = req.body.projects;
        if (req.body.certifications) resume.certifications = req.body.certifications;
        if (req.body.languages) resume.languages = req.body.languages;
        if (req.body.interests) resume.interests = req.body.interests;

        // Save the updated resume
        const savedResume = await resume.save();
        console.log("Resume updated successfully");
        
        res.status(200).json(savedResume);
    } catch (error) {
        console.error("Update resume error:", error);
        res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        });
    }
};


const deleteResume = async (req,res) => {
    try {
        const resume = await Resume.findOne({_id:req.params.id,userId:req.user._id});
        if(!resume){
            res.status(404).json({message:"Resume not found"});
        }
        //Delete thumbnailLink and profilePreviewUrl images from uploads folder 
        const uploadsFolder = path.join(__dirname,'..','uploads');
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        if(resume.thumbnailLink){
            const oldThumbnail  =path.join(uploadsFolder,path.basename(resume.thumbnailLink));
            if(fs.existsSync(oldThumbnail)){
                fs.unlinkSync(oldThumbnail);
            }
        }
        if(resume.profileInfo?.profilePreviewUrl){
            const oldProfile = path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl));
            if(fs.existsSync(oldProfile)){
                fs.unlinkSync(oldProfile);
            }
        }

        const deleted = await Resume.findOneAndDelete({
            _id:req.params.id,
            userId:req.user._id
        });

        if(!deleted){
            res.status(404).json({message:"Resume not found or unauthorized"});
        }
        res.json({
            message:"Resume deleted successfully",
        })
    } catch (error) {
        res.status(500).json({message:"Failed to delete resume",error:error.message});
    }
}

export {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
};