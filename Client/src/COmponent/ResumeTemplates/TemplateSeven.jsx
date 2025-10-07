import React from 'react';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

const TemplateSeven = ({ resumeData, colorPalette }) => {
    const {
        profileInfo = {},
        contactInfo = {},
        workExperience = [],
        education = [],
        skills = [],
        projects = [],
    } = resumeData || {};

    const primaryColor = colorPalette ? colorPalette[3] : '#005f73';
    const secondaryColor = colorPalette ? colorPalette[1] : '#e9d8a6';
    const textColor = colorPalette ? colorPalette[4] : '#3d405b';
    const backgroundColor = '#ffffff';

    const containerStyle = {
        fontFamily: resumeData?.template?.fontFamily || 'Georgia, serif',
        backgroundColor: backgroundColor,
        padding: '40px',
        minHeight: '1122px',
        color: textColor,
    };

    const headerStyle = {
        textAlign: 'center',
        borderBottom: `3px solid ${primaryColor}`,
        paddingBottom: '20px',
        marginBottom: '30px',
    };

    const sectionTitleStyle = {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: primaryColor,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '15px',
        borderBottom: `1px solid ${secondaryColor}`,
        paddingBottom: '5px'
    };
    
    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1 style={{ fontSize: '2.8rem', margin: '0', color: primaryColor }}>{profileInfo.fullName}</h1>
                <h2 style={{ fontSize: '1.2rem', margin: '10px 0', fontWeight: 'normal' }}>{profileInfo.designation}</h2>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    {contactInfo.email && <span><Mail size={14} style={{ display: 'inline-block', marginRight: '5px' }}/>{contactInfo.email}</span>}
                    {contactInfo.phone && <span><Phone size={14} style={{ display: 'inline-block', marginRight: '5px' }}/>{contactInfo.phone}</span>}
                    {contactInfo.linkedin && <span><Linkedin size={14} style={{ display: 'inline-block', marginRight: '5px' }}/>LinkedIn</span>}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr', gap: '40px' }}>
                {/* Left Column */}
                <main>
                    <section>
                        <h3 style={sectionTitleStyle}>Profile</h3>
                        <p>{profileInfo.summary}</p>
                    </section>

                    <section style={{ marginTop: '30px' }}>
                        <h3 style={sectionTitleStyle}>Experience</h3>
                        {workExperience.map((job, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{job.role}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', marginBottom: '5px' }}>
                                    <span>{job.company}</span>
                                    <span>{job.startDate} - {job.endDate}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{job.description}</p>
                            </div>
                        ))}
                    </section>
                </main>
                
                {/* Right Column */}
                <aside>
                    <section>
                        <h3 style={sectionTitleStyle}>Skills</h3>
                        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                            {skills.map((skill, index) => <li key={index} style={{ marginBottom: '5px' }}>{skill.name}</li>)}
                        </ul>
                    </section>

                    <section style={{ marginTop: '30px' }}>
                        <h3 style={sectionTitleStyle}>Education</h3>
                        {education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <h4 style={{ margin: '0', fontWeight: 'bold' }}>{edu.degree}</h4>
                                <p style={{ margin: '2px 0' }}>{edu.institution}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontStyle: 'italic' }}>{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>

                    {projects.length > 0 && <section style={{ marginTop: '30px' }}>
                        <h3 style={sectionTitleStyle}>Projects</h3>
                        {projects.map((project, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{project.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{project.description}</p>
                            </div>
                        ))}
                    </section>}
                </aside>
            </div>
        </div>
    );
};

export default TemplateSeven;
