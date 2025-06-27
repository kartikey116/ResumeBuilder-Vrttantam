export const BASE_URL = "http://localhost:4000";

export const API_PATHS = {
    AUTH: {
        REGISTER: `${BASE_URL}/api/auth/register`,
        LOGIN: `${BASE_URL}/api/auth/login`,
        PROFILE: `${BASE_URL}/api/auth/profile`,
    },
    RESUMES: {
        CREATE: `${BASE_URL}/api/resume`,
        GET_USER_RESUMES: `${BASE_URL}/api/resume`,
        GET_RESUME_BY_ID: (id) => `${BASE_URL}/api/resume/${id}`,
        UPDATE_RESUME: (id) => `${BASE_URL}/api/resume/${id}`,
        UPLOAD_RESUME_IMAGES: (id) => `${BASE_URL}/api/resume/${id}/upload-images`,
        DELETE_RESUME: (id) => `${BASE_URL}/api/resume/${id}`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
    }
};
