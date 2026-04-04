export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const API_PATHS = {
    AUTH: {
        REGISTER: `/api/auth/register`,
        LOGIN: `/api/auth/login`,
        PROFILE: `/api/auth/profile`,
    },
    RESUMES: {
        CREATE: `/api/resume`,
        GET_USER_RESUMES: `/api/resume`,
        GET_RESUME_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE_RESUME: (id) => `/api/resume/${id}`,
        UPLOAD_RESUME_IMAGES: (id) => `/api/resume/${id}/upload-images`,
        DELETE_RESUME: (id) => `/api/resume/${id}`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/api/auth/upload-image`,
    },
    AI: {
        PARSE_RESUME: `/api/ai/parse-resume`,
        IMPORT_RESUME: `/api/ai/import-resume`,
        ATS_SCORE: `/api/ai/ats-score`,
        ANONYMIZE_PUBLISH: `/api/ai/anonymize-publish`,
        ENHANCE_BULLET: `/api/ai/enhance-bullet`,
    },
    TEMPLATES: {
        GET_ALL: `/api/templates`,
        CLONE: (id) => `/api/templates/${id}/clone`,
        LIKE: (id) => `/api/templates/${id}/like`,
    }
};
