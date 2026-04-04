import express from 'express';
import PublicTemplate from '../models/PublicTemplate.js';
import Resume from '../models/Resume.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/templates — Public: Get all community templates (sorted by trending)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, sort = 'trending' } = req.query;
        const sortOption = sort === 'trending' ? { cloneCount: -1 } : { createdAt: -1 };

        const templates = await PublicTemplate.find()
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-anonymizedData.contactInfo.email -anonymizedData.contactInfo.phone'); // Extra safety

        const total = await PublicTemplate.countDocuments();

        res.status(200).json({ success: true, templates, total, page: parseInt(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch templates.', error: error.message });
    }
});

// POST /api/templates/:id/clone — Protected: Clone a template to user's dashboard
router.post('/:id/clone', protect, async (req, res) => {
    try {
        const template = await PublicTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found.' });
        }

        const data = template.anonymizedData || {};

        // Safely coerce interests — Resume schema expects array of strings,
        // but AI may return array of objects like [{ name: "..." }]
        const safeInterests = (data.interests || []).map((item) =>
            typeof item === 'string' ? item : item?.name || item?.interest || String(item)
        );

        // Safely coerce skills — ensure { name, progress } shape
        const safeSkills = (data.skills || []).map((s) =>
            typeof s === 'string' ? { name: s, progress: 80 } : s
        );

        const newResume = await Resume.create({
            userId: req.user._id,
            title: `Cloned: ${template.creatorName}'s Template`,
            template: {
                theme: template.templateConfig?.theme || '01',
                colorPalette: template.templateConfig?.colorPalette || [],
                fontFamily: template.templateConfig?.fontFamily || 'Arial, sans-serif',
            },
            profileInfo: data.profileInfo || {},
            contactInfo: data.contactInfo || {},
            workExperience: data.workExperience || [],
            education: data.education || [],
            skills: safeSkills,
            projects: data.projects || [],
            certifications: data.certifications || [],
            languages: data.languages || [],
            interests: safeInterests,
        });

        await PublicTemplate.findByIdAndUpdate(req.params.id, { $inc: { cloneCount: 1 } });

        res.status(201).json({
            success: true,
            message: 'Template cloned to your Dashboard! Start editing it now.',
            resumeId: newResume._id,
        });
    } catch (error) {
        console.error('[Clone Error]', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Failed to clone template.', error: error.message });
    }
});

// POST /api/templates/:id/like — Protected: Toggle like on a template
router.post('/:id/like', protect, async (req, res) => {
    try {
        const template = await PublicTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found.' });
        }

        const userId = req.user._id;
        const hasLiked = template.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike
            template.likedBy.pull(userId);
            template.likes = Math.max(0, template.likes - 1);
        } else {
            // Like
            template.likedBy.push(userId);
            template.likes += 1;
        }
        await template.save();

        res.status(200).json({ success: true, likes: template.likes, liked: !hasLiked });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to toggle like.', error: error.message });
    }
});

export default router;
