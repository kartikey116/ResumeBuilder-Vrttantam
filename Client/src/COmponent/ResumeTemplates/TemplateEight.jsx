import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

const TemplateEight = ({ resumeData }) => {
    const {
        profileInfo = {},
        contactInfo = {},
        education = [],
        workExperience = [],
        projects = [],
        skills = [],
        certifications = []
    } = resumeData || {};

    const styles = {
        container: {
            fontFamily: resumeData?.template?.fontFamily || 'Georgia, serif',
            padding: '40px',
            backgroundColor: '#fff',
            color: '#333',
            minHeight: '1122px',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '20px',
        },
        name: {
            fontSize: '2.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 10px 0',
        },
        contactLine: {
            fontSize: '0.9rem',
        },
        contactLink: {
            color: '#0056b3',
            textDecoration: 'none',
        },
        section: {
            marginBottom: '25px',
        },
        sectionTitle: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: '5px',
            marginBottom: '15px',
        },
        subheading: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
        },
        subheadingLeft: {
            fontSize: '1rem',
            fontWeight: 'bold',
        },
        subheadingRight: {
            fontSize: '0.9rem',
            fontStyle: 'italic',
        },
        itemList: {
            listStyle: 'none',
            paddingLeft: '20px',
            marginTop: '5px',
        },
        item: {
            marginBottom: '5px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            position: 'relative',
        },
        bullet: {
            position: 'absolute',
            left: '-15px',
            top: '9px',
            height: '4px',
            width: '4px',
            backgroundColor: '#000',
            borderRadius: '50%',
        },
        skillsContainer: {
            paddingLeft: '5px',
        },
        skillItem: {
            fontSize: '0.95rem',
            lineHeight: '1.6'
        },
        link: {
            display: 'inline-block',
            marginRight: '10px',
            fontSize: '0.9rem',
            color: '#0056b3',
            textDecoration: 'none',
        }
    };

    const Subheading = ({ left, right, leftItalic = false, rightItalic = false }) => (
        <div style={styles.subheading}>
            <span style={{ ...styles.subheadingLeft, fontStyle: leftItalic ? 'italic' : 'normal' }}>{left}</span>
            <span style={{ ...styles.subheadingRight, fontStyle: rightItalic ? 'italic' : 'normal' }}>{right}</span>
        </div>
    );
    
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.name}>{profileInfo.fullName}</h1>
                <p style={styles.contactLine}>
                    {contactInfo.phone && <span>{contactInfo.phone} | </span>}
                    {contactInfo.email && <a href={`mailto:${contactInfo.email}`} style={styles.contactLink}>{contactInfo.email}</a>}
                    {contactInfo.linkedin && <span> | <a href={contactInfo.linkedin} style={styles.contactLink}>LinkedIn</a></span>}
                    {contactInfo.github && <span> | <a href={contactInfo.github} style={styles.contactLink}>GitHub</a></span>}
                </p>
            </header>

            <main>
                {skills.length > 0 && (
                     <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Technical Skills</h2>
                         <div style={styles.skillsContainer}>
                            <p style={styles.skillItem}>
                                <strong style={{fontWeight: 'bold'}}>Skills: </strong>
                                {skills.map(skill => skill.name).join(', ')}
                            </p>
                        </div>
                    </section>
                )}
               
                {workExperience.length > 0 && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Experience</h2>
                        {workExperience.map((job, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <Subheading left={job.company} right={job.location || ''} />
                                <Subheading left={job.role} right={`${job.startDate} – ${job.endDate}`} leftItalic />
                                <ul style={styles.itemList}>
                                    {job.description.split('\n').map((desc, i) => desc && (
                                        <li key={i} style={styles.item}>
                                            <span style={styles.bullet}></span>
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {projects.length > 0 && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Projects</h2>
                        {projects.map((project, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <Subheading left={project.title} />
                                <div>
                                    {project.githubLink && <a href={project.githubLink} style={styles.link}>GitHub</a>}
                                    {project.liveDemoLink && <a href={project.liveDemoLink} style={styles.link}>Live Demo</a>}
                                </div>
                                <ul style={styles.itemList}>
                                    {project.description.split('\n').map((desc, i) => desc && (
                                        <li key={i} style={styles.item}>
                                            <span style={styles.bullet}></span>
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                 {education.length > 0 && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Education</h2>
                        {education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <Subheading left={edu.institution} right={edu.location || ''} />
                                <Subheading left={edu.degree} right={`${edu.startDate} – ${edu.endDate}`} leftItalic />
                            </div>
                        ))}
                    </section>
                )}
                
                {certifications.length > 0 && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Certifications</h2>
                        {certifications.map((cert, index) => (
                            <div key={index} style={{ marginBottom: '14px' }}>
                                <h4 style={{ margin: 0, fontWeight: 'bold' }}>{cert.title}</h4>
                                    <p style={{ margin: '2px 0' }}>{cert.issuer} ({cert.year})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default TemplateEight;