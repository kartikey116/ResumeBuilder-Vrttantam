import React from 'react';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

const TemplateFour = ({ resumeData, colorPalette, fontFamily }) => {
    const {
        profileInfo = {},
        contactInfo = {},
        workExperience = [],
        education = [],
        skills = [],
        projects = [],
        certifications = [],
        languages = [],
        interests = []
    } = resumeData || {};

    const primaryColor = colorPalette ? colorPalette[3] : '#2c3e50';
    const secondaryColor = colorPalette ? colorPalette[1] : '#ecf0f1';
    const textColor = colorPalette ? colorPalette[4] : '#34495e';
    const headerTextColor = '#ffffff';
    const appliedFont = fontFamily || resumeData?.template?.fontFamily || 'Arial, sans-serif';

    const containerStyle = {
        fontFamily: appliedFont,
        backgroundColor: '#fff',
        color: textColor,
        minHeight: '1122px',
    };

    const headerStyle = {
        backgroundColor: primaryColor,
        color: headerTextColor,
        padding: '30px',
        textAlign: 'center',
    };

    const sectionTitleStyle = {
        color: primaryColor,
        borderBottom: `2px solid ${secondaryColor}`,
        paddingBottom: '5px',
        marginBottom: '15px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{profileInfo.fullName}</h1>
                <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 'normal' }}>{profileInfo.designation}</h2>
            </header>

            <div style={{ padding: '20px 30px' }}>
                <p style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: '20px', borderBottom: `1px solid ${secondaryColor}`, paddingBottom: '20px' }}>
                    {profileInfo.summary}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                    <div>
                        <section>
                            <h3 style={sectionTitleStyle}>Contact</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {contactInfo.email && <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><Mail size={16} style={{ marginRight: '8px', color: primaryColor }} /> {contactInfo.email}</li>}
                                {contactInfo.phone && <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><Phone size={16} style={{ marginRight: '8px', color: primaryColor }} /> {contactInfo.phone}</li>}
                                {contactInfo.linkedin && <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><Linkedin size={16} style={{ marginRight: '8px', color: primaryColor }} /> linkedin.com/...</li>}
                                {contactInfo.github && <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><Github size={16} style={{ marginRight: '8px', color: primaryColor }} /> github.com/...</li>}
                                {contactInfo.website && <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><Globe size={16} style={{ marginRight: '8px', color: primaryColor }} /> {contactInfo.website}</li>}
                            </ul>
                        </section>

                        <section style={{ marginTop: '25px' }}>
                            <h3 style={sectionTitleStyle}>Skills</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {skills.map((skill, index) => (
                                    <li key={index} style={{ marginBottom: '8px' }}>{skill.name}</li>
                                ))}
                            </ul>
                        </section>

                        <section style={{ marginTop: '25px' }}>
                            <h3 style={sectionTitleStyle}>Education</h3>
                            {education.map((edu, index) => (
                                <div key={index} style={{ marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0, fontWeight: 'bold' }}>{edu.degree}</h4>
                                    <p style={{ margin: '2px 0' }}>{edu.institution}</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', fontStyle: 'italic' }}>{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </section>

                         <section style={{ marginTop: '25px' }}>
                            <h3 style={sectionTitleStyle}>Languages</h3>
                             <ul style={{ listStyle: 'none', padding: 0 }}>
                                {languages.map((lang, index) => (
                                    <li key={index} style={{ marginBottom: '8px' }}>{lang.name}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div>
                        <section>
                            <h3 style={sectionTitleStyle}>Work Experience</h3>
                            {workExperience.map((job, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 2px 0', fontSize: '1.1rem' }}>{job.role}</h4>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{job.company}</p>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', fontStyle: 'italic' }}>{job.startDate} - {job.endDate}</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{job.description}</p>
                                </div>
                            ))}
                        </section>

                        <section style={{ marginTop: '25px' }}>
                            <h3 style={sectionTitleStyle}>Projects</h3>
                            {projects.map((project, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{project.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{project.description}</p>
                                </div>
                            ))}
                        </section>
                        
                         <section style={{ marginTop: '25px' }}>
                            <h3 style={sectionTitleStyle}>Certifications</h3>
                            {certifications.map((cert, index) => (
                                <div key={index} style={{ marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0, fontWeight: 'bold' }}>{cert.title}</h4>
                                    <p style={{ margin: '2px 0' }}>{cert.issuer} ({cert.year})</p>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateFour;