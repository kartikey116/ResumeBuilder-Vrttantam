// server/models/Resume.js
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnailLink: {
        type: String,
        default: ""
    },
    template: {
        theme: {
            type: String,
            default: ""
        },
        colorPalette: {
            type: [String],
            default: []
        },
        fontFamily: {
            type: String,
            default: ""
        }
    },
    profileInfo: {
        profilePreviewUrl: {
            type: String,
            default: ""
        },
        fullName: {
            type: String,
            default: ""
        },
        designation: {
            type: String,
            default: ""
        },
        summary: {
            type: String,
            default: ""
        },
    },
    contactInfo: {
        email: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        }
    },
    workExperience: [{
        company: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            default: ""
        },
        startDate: {
            type: String,
            default: ""
        },
        endDate: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        isCurrentlyWorking: {
            type: Boolean,
            default: false
        },
    }],
    education: [{
        degree: {
            type: String,
            default: ""
        },
        institution: {
            type: String,
            default: ""
        },
        startDate: {
            type: String,
            default: ""
        },
        endDate: {
            type: String,
            default: ""
        },
    }],
    skills: [{
        name: {
            type: String,
            default: ""
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
    }],
    projects: [{
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        liveDemo: {
            type: String,
            default: ""
        },
    }],
    certifications: [{
        title: {
            type: String,
            default: ""
        },
        issuer: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
    }],
    languages: [{
        name: {
            type: String,
            default: ""
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
    }],
    interests: [{
        type: String,
        default: ""
    }],
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default mongoose.model('Resume', ResumeSchema);