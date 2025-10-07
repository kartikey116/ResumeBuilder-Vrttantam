import React from 'react';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

const TemplateSix = ({ resumeData, colorPalette }) => {
    const {
        profileInfo = {},
        contactInfo = {},
        workExperience = [],
        education = [],
        skills = [],
        projects = [],
        certifications = [],
        languages = [],
    } = resumeData || {};

    const sidebarColor = colorPalette ? colorPalette[4] : '#2c3e50';
    const mainColor = colorPalette ? colorPalette[3] : '#3498db';
    const textColor = '#333333';
    const sidebarTextColor = '#FFFFFF';

    const containerStyle = {
        fontFamily: resumeData?.template?.fontFamily || 'Arial, sans-serif',
        backgroundColor: '#FFFFFF',
        minHeight: '1122px',
        display: 'flex',
    };

    const sidebarStyle = {
        backgroundColor: sidebarColor,
        color: sidebarTextColor,
        padding: '30px',
        width: '33%',
    };

    const mainContentStyle = {
        width: '67%',
        padding: '30px',
    };
    
    const sectionTitleStyle = (color = mainColor) => ({
        color: color,
        borderBottom: `2px solid ${color}`,
        paddingBottom: '5px',
        marginBottom: '15px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    });

    const contactItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '0.9rem',
    };

    return (
        <div style={containerStyle}>
            <aside style={sidebarStyle}>
                 {profileInfo.profileImg && (
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <img 
                            src={profileInfo.profileImg} 
                            alt={profileInfo.fullName} 
                            style={{ width: '150px', height: '150px', borderRadius: '50%', border: `4px solid ${mainColor}` }} 
                        />
                    </div>
                )}
                
                <section>
                    <h3 style={sectionTitleStyle(sidebarTextColor)}>Contact</h3>
                    <div style={{ marginTop: '10px' }}>
                        {contactInfo.email && <p style={contactItemStyle}><Mail size={16} style={{ marginRight: '10px' }} /> {contactInfo.email}</p>}
                        {contactInfo.phone && <p style={contactItemStyle}><Phone size={16} style={{ marginRight: '10px' }} /> {contactInfo.phone}</p>}
                        {contactInfo.location && <p style={contactItemStyle}><MapPin size={16} style={{ marginRight: '10px' }} /> {contactInfo.location}</p>}
                        {contactInfo.linkedin && <p style={contactItemStyle}><Linkedin size={16} style={{ marginRight: '10px' }} /> LinkedIn</p>}
                        {contactInfo.github && <p style={contactItemStyle}><Github size={16} style={{ marginRight: '10px' }} /> GitHub</p>}
                    </div>
                </section>
                
                <section style={{ marginTop: '30px' }}>
                    <h3 style={sectionTitleStyle(sidebarTextColor)}>Skills</h3>
                    <ul style={{ padding: 0, listStyle: 'none', marginTop: '10px' }}>
                        {skills.map((skill, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{skill.name}</li>
                        ))}
                    </ul>
                </section>

                <section style={{ marginTop: '30px' }}>
                    <h3 style={sectionTitleStyle(sidebarTextColor)}>Languages</h3>
                    <ul style={{ padding: 0, listStyle: 'none', marginTop: '10px' }}>
                        {languages.map((lang, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{lang.name}</li>
                        ))}
                    </ul>
                </section>
            </aside>

            <main style={mainContentStyle}>
                <header style={{ textAlign: 'left', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '3rem', color: mainColor, margin: '0', textTransform: 'uppercase' }}>{profileInfo.fullName}</h1>
                    <h2 style={{ fontSize: '1.5rem', color: textColor, margin: '5px 0' }}>{profileInfo.designation}</h2>
                </header>

                <section>
                    <h3 style={sectionTitleStyle()}>Summary</h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{profileInfo.summary}</p>
                </section>
                
                <section style={{ marginTop: '30px' }}>
                    <h3 style={sectionTitleStyle()}>Experience</h3>
                    {workExperience.map((job, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{job.role}</h4>
                            <p style={{ margin: '0 0 5px 0', fontStyle: 'italic' }}>{job.company} | {job.startDate} - {job.endDate}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{job.description}</p>
                        </div>
                    ))}
                </section>
                
                <section style={{ marginTop: '30px' }}>
                    <h3 style={sectionTitleStyle()}>Education</h3>
                    {education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{edu.degree}</h4>
                            <p style={{ margin: '0 0 5px 0' }}>{edu.institution}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem' }}>{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default TemplateSix;
