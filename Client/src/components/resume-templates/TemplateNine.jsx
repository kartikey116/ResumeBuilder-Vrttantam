import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaGithub, FaLink } from 'react-icons/fa';

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
    interests = [],
    customSections = [],
  } = resumeData || {};

  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const cat = skill?.category?.trim() || 'Technical Skills';
    if (!acc[cat]) acc[cat] = [];
    const names = (skill?.name || "").split(",").map(s => s.trim()).filter(Boolean);
    acc[cat].push(...names);
    return acc;
  }, {});

  // Accent colour from palette slot [3], dark from [4]
  const accent = colorPalette?.[3] || '#1a1a1a';
  const dark = colorPalette?.[4] || '#111111';
  const font = fontFamily || 'Georgia, "Times New Roman", serif';

  const layout = resumeData?.template?.layout || {};

  const s = {
    page: {
      fontFamily: layout.descriptionFont || font,
      fontSize: layout.descriptionSize ? `${layout.descriptionSize}pt` : (layout.fontSize ? `${layout.fontSize}pt` : '10pt'),
      lineHeight: layout.descriptionLineHeight || 1.5,
      color: layout.descriptionColor || dark,
      background: '#ffffff',
      padding: `${layout.sidePaddingTop ?? layout.padding ?? 36}px ${layout.sidePaddingRight ?? layout.padding ?? 48}px ${layout.sidePaddingBottom ?? layout.padding ?? 36}px ${layout.sidePaddingLeft ?? layout.padding ?? 48}px`,
      boxSizing: 'border-box',
    },
    name: {
      textAlign: 'center',
      fontFamily: layout.headingFont || font,
      fontSize: layout.headingSize ? `${layout.headingSize}pt` : '22pt',
      fontWeight: 'bold',
      color: layout.headingColor || dark,
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
      fontFamily: layout.sectionHeaderFont || font,
      fontSize: layout.sectionHeaderSize ? `${layout.sectionHeaderSize}pt` : '10pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: layout.sectionHeaderColor || dark,
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: '2px',
      marginBottom: `${layout.sectionGap ?? 10}px`,
      marginTop: `${layout.sectionGap ?? 16}px`,
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '1px',
    },
    jobTitle: {
      fontFamily: layout.subHeadingFont || font,
      fontWeight: 'bold',
      fontSize: layout.subHeadingSize ? `${layout.subHeadingSize}pt` : '10pt',
      color: layout.subHeadingColor || dark,
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
      margin: `${layout.itemSpacing ?? 4}px 0 ${layout.itemSpacing ?? 10}px 0`,
      paddingLeft: '18px',
      listStyle: 'disc',
    },
    bulletItem: {
      fontSize: layout.descriptionSize ? `${layout.descriptionSize - 0.5}pt` : '9.5pt',
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
      fontFamily: layout.subHeadingFont || font,
      fontWeight: 'bold',
      fontSize: layout.subHeadingSize ? `${layout.subHeadingSize}pt` : '10pt',
      color: layout.subHeadingColor || dark,
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
    contactInfo.phone && (
      <span key="ph" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <FaPhoneAlt style={{ fontSize: '8pt', color: accent }} /> {contactInfo.phone}
      </span>
    ),
    contactInfo.email && (
      <span key="em" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <FaEnvelope style={{ fontSize: '8.5pt', color: accent }} /> {contactInfo.email}
      </span>
    ),
    contactInfo.location && (
      <span key="loc" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <FaMapMarkerAlt style={{ fontSize: '9pt', color: accent }} /> {contactInfo.location}
      </span>
    ),
    contactInfo.linkedin && (
      <a href={contactInfo.linkedin} style={{ ...s.link, display: 'inline-flex', alignItems: 'center', gap: '3px' }} key="li">
        <FaLinkedin style={{ color: accent }} /> LinkedIn
      </a>
    ),
    contactInfo.github && (
      <a href={contactInfo.github} style={{ ...s.link, display: 'inline-flex', alignItems: 'center', gap: '3px' }} key="gh">
        <FaGithub style={{ color: accent }} /> GitHub
      </a>
    ),
    contactInfo.website && (
      <a href={contactInfo.website} style={{ ...s.link, display: 'inline-flex', alignItems: 'center', gap: '3px' }} key="web">
        <FaGlobe style={{ color: accent }} /> Portfolio
      </a>
    ),
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
                <span style={s.jobDates}>
                  {formatDate(exp.startDate)} – {exp.isCurrentlyWorking || !exp.endDate ? 'Present' : formatDate(exp.endDate)}
                </span>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {proj.github && <a href={proj.github} style={{ ...s.link, display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FaGithub style={{ color: accent }} /> GitHub</a>}
                  {proj.liveDemo && <a href={proj.liveDemo} style={{ ...s.link, display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FaLink style={{ color: accent }} /> Live Demo</a>}
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
                <span style={s.jobDates}>
                  {formatDate(edu.startDate)} – {edu.isCurrentlyStudying || !edu.endDate ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              <div style={{ ...s.company, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>{edu.degree}</span>
                {edu.grade && <span style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}><strong>Grade: {edu.grade}</strong></span>}
              </div>
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

      {interests.length > 0 && interests[0] && (
        <section className="print-safe-section">
          <div style={s.sectionTitle}>Interests</div>
          <p style={s.skillRow}>
            {interests.join(', ')}
          </p>
        </section>
      )}

      {customSections && customSections.map((sec, sIdx) => {
        if (!sec.title || !sec.items || sec.items.length === 0) return null;
        return (
          <section key={sIdx} className="print-safe-section">
            <div style={s.sectionTitle}>{sec.title}</div>
            {sec.items.map((item, iIdx) => (
              <div key={iIdx} style={{ marginBottom: '8px' }}>
                <div style={s.jobHeader}>
                  <span style={s.jobTitle}>{item.heading}</span>
                  {(item.startDate || item.endDate) && (
                    <span style={s.jobDates}>
                      {item.startDate} {item.startDate && item.endDate && '–'} {item.endDate}
                    </span>
                  )}
                </div>
                {item.subHeading && (
                  <div style={s.company}>{item.subHeading}</div>
                )}
                {renderBullets(item.description)}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default TemplateNine;
