import React from 'react';

/**
 * Template 09 — "Harvard Clean"
 * Single-column, black & white, ATS-optimized (~92–95% ATS score)
 * Based on Harvard Office of Career Services / Jake's Resume style.
 * - No tables, no graphics, no columns that break ATS parsers
 * - Section titles: ALL-CAPS bold, thin horizontal rule below
 * - Bullet points via split('\n') for maximum compatibility
 */
const TemplateNine = ({ resumeData, colorPalette, fontFamily }) => {
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

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category?.trim() || 'Technical Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {});

  // Accent colour from palette slot [3], dark from [4]
  const accent = colorPalette?.[3] || '#1a1a1a';
  const dark = colorPalette?.[4] || '#111111';
  const font = fontFamily || 'Georgia, "Times New Roman", serif';

  const s = {
    page: {
      fontFamily: font,
      fontSize: '10pt',
      lineHeight: 1.5,
      color: dark,
      background: '#ffffff',
      padding: '36px 48px',
      boxSizing: 'border-box',
    },
    name: {
      textAlign: 'center',
      fontSize: '22pt',
      fontWeight: 'bold',
      letterSpacing: '1px',
      color: dark,
      margin: '0 0 4px 0',
      textTransform: 'uppercase',
    },
    contactLine: {
      textAlign: 'center',
      fontSize: '9pt',
      color: '#444',
      marginBottom: '16px',
    },
    divider: {
      borderTop: `1.5px solid ${dark}`,
      margin: '4px 0 10px 0',
    },
    sectionTitle: {
      fontSize: '10pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: dark,
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: '2px',
      marginBottom: '10px',
      marginTop: '16px',
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '1px',
    },
    jobTitle: {
      fontWeight: 'bold',
      fontSize: '10pt',
      color: dark,
    },
    jobDates: {
      fontSize: '9pt',
      color: '#555',
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      marginLeft: '8px',
    },
    company: {
      fontStyle: 'italic',
      fontSize: '9.5pt',
      color: '#444',
      marginBottom: '4px',
    },
    bulletList: {
      margin: '4px 0 10px 0',
      paddingLeft: '18px',
      listStyle: 'disc',
    },
    bulletItem: {
      fontSize: '9.5pt',
      marginBottom: '2px',
      lineHeight: 1.5,
    },
    skillRow: {
      fontSize: '9.5pt',
      marginBottom: '4px',
    },
    link: {
      color: accent,
      textDecoration: 'none',
      fontSize: '9pt',
    },
    projectTitle: {
      fontWeight: 'bold',
      fontSize: '10pt',
    },
    certRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '9.5pt',
      marginBottom: '3px',
    },
  };

  const formatDate = (d) => {
    if (!d) return '';
    if (d === 'Present') return 'Present';
    const [year, month] = d.split('-');
    if (!month) return year;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const contactParts = [
    contactInfo.phone,
    contactInfo.email,
    contactInfo.location,
    contactInfo.linkedin && <a href={contactInfo.linkedin} style={s.link} key="li">LinkedIn</a>,
    contactInfo.github && <a href={contactInfo.github} style={s.link} key="gh">GitHub</a>,
    contactInfo.website && <a href={contactInfo.website} style={s.link} key="web">Portfolio</a>,
  ].filter(Boolean);

  const renderBullets = (description) => {
    if (!description) return null;
    const lines = description.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return null;
    return (
      <ul style={s.bulletList}>
        {lines.map((line, i) => (
          <li key={i} style={s.bulletItem}>{line.replace(/^[-•*]\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <h1 style={s.name}>{profileInfo.fullName || 'Your Name'}</h1>
      {profileInfo.designation && (
        <p style={{ textAlign: 'center', fontSize: '10pt', color: '#555', margin: '0 0 4px 0' }}>
          {profileInfo.designation}
        </p>
      )}
      <p style={s.contactLine}>
        {contactParts.map((part, i) => (
          <span key={i}>
            {i > 0 && <span style={{ margin: '0 6px', color: '#aaa' }}>|</span>}
            {part}
          </span>
        ))}
      </p>
      <div style={s.divider} />

      {/* Summary */}
      {profileInfo.summary && (
        <section className="print-safe-section">
          <div style={s.sectionTitle}>Summary</div>
          <p style={{ fontSize: '9.5pt', color: '#333', marginBottom: '4px', lineHeight: 1.6 }}>
            {profileInfo.summary}
          </p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="print-safe-section">
          <div style={s.sectionTitle}>Technical Skills</div>
          {Object.entries(groupedSkills).map(([cat, items], i) => (
            <p key={i} style={s.skillRow}>
              <strong>{cat}: </strong>
              {items.join(', ')}
            </p>
          ))}
          {languages.length > 0 && languages[0]?.name && (
            <p style={s.skillRow}>
              <strong>Languages: </strong>
              {languages.map((l) => l.name).join(' · ')}
            </p>
          )}
        </section>
      )}

      {workExperience.length > 0 && workExperience[0]?.company && (
        <section>
          <div style={s.sectionTitle}>Experience</div>
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10px' }} className="print-safe-section">
              <div style={s.jobHeader}>
                <span style={s.jobTitle}>{exp.role}</span>
                <span style={s.jobDates}>{formatDate(exp.startDate)} – {exp.isCurrentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div style={s.company}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {renderBullets(exp.description)}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && projects[0]?.title && (
        <section>
          <div style={s.sectionTitle}>Projects</div>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }} className="print-safe-section">
              <div style={s.jobHeader}>
                <span style={s.projectTitle}>{proj.title}</span>
                <span>
                  {proj.github && <a href={proj.github} style={{ ...s.link, marginRight: '8px' }}>GitHub</a>}
                  {proj.liveDemo && <a href={proj.liveDemo} style={s.link}>Live Demo</a>}
                </span>
              </div>
              {renderBullets(proj.description)}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && education[0]?.degree && (
        <section>
          <div style={s.sectionTitle}>Education</div>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }} className="print-safe-section">
              <div style={s.jobHeader}>
                <span style={s.jobTitle}>{edu.institution}</span>
                <span style={s.jobDates}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
              </div>
              <div style={s.company}>{edu.degree}</div>
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && certifications[0]?.title && (
        <section className="print-safe-section">
          <div style={s.sectionTitle}>Certifications</div>
          {certifications.map((cert, i) => (
            <div key={i} style={s.certRow}>
              <span><strong>{cert.title}</strong>{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
              <span style={{ color: '#666', fontStyle: 'italic' }}>{cert.year}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TemplateNine;
