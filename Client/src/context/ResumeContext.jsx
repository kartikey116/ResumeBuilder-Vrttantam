import React, { createContext, useState, useEffect } from 'react';

export const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
    // Mode toggles behavior (does the user need more focus on Projects or Work Exp?)
    const [builderMode, setBuilderMode] = useState('fresher'); // 'fresher' | 'experienced'
    
    // Customization State
    const [templateId, setTemplateId] = useState('modern_minimal'); 
    const [themeConfig, setThemeConfig] = useState({
        fontFamily: 'Inter, sans-serif',
        primaryColor: '#3b82f6', // Tailwinds blue-500
        secondaryColor: '#1e293b', // Tailwind slate-800
    });

    // Core Data State (The JSON that fuels the resume templates)
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: '',
        },
        summary: '',
        education: [
            // { degree, institution, startDate, endDate, score, description }
        ],
        experience: [
            // { role, company, startDate, endDate, isCurrent, location, description }
        ],
        projects: [
            // { title, tools, techStack, link, description }
        ],
        skills: {
            core: [],
            languages: [],
            frameworks: [],
        }
    });

    // Helper to update specific nested pieces of the resume Data
    const updateResumeSection = (section, data) => {
        setResumeData(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const value = {
        builderMode, setBuilderMode,
        templateId, setTemplateId,
        themeConfig, setThemeConfig,
        resumeData, setResumeData,
        updateResumeSection
    };

    return (
        <ResumeContext.Provider value={value}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeProvider;
