import mongoose from 'mongoose';

const PublicTemplateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    creatorName: {
        type: String,
        required: true,
    },
    templateConfig: {
        theme: { type: String, default: '' },
        colorPalette: { type: [String], default: [] },
        fontFamily: { type: String, default: '' },
    },
    // AI-scrubbed resume data — no PII
    anonymizedData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    cloneCount: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

export default mongoose.model('PublicTemplate', PublicTemplateSchema);
