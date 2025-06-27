import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//@desc create a new resueme 
//@route POST /api/resume
//@access private
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

//@desc Get all resumes for logged-in user
//@route GET /api/resume
//@access private
const getUserResumes = async (req,res) => {
    try {
        const resumes = await Resume.find({userId:req.user._id}).sort({updatedAt:-1});
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({message:"Failed to get resumes",error:error.message});
    }
}

// @desc Get resume by id
// @route GET /api/resume/:id
// @access private
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


// Update resume
// @route PUT /api/resume/:id
// @access private
const updateResume = async (req,res) => {
    try {
        const resume = await Resume.findOne({_id:req.params.id,userId:req.user._id});
        if(!resume){
            res.status(404).json({message:"Resume not found"});
        }    
        //Merge updates from req.body into existing resume
        Object.assign(resume, req.body);
        //Save and return updated resume
        const savedResume = await resume.save();
        res.status(200).json(savedResume);
    } catch (error) {
        res.status(500).json({message:"Failed to update resume",error:error.message});
    }
}

// Delete resume
// @route DELETE /api/resume/:id
// @access private
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