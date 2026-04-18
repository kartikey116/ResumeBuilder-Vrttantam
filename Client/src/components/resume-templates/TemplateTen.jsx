import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award } from 'lucide-react';

/**
 * Template 10 — "Executive Pro"
 * Two-column modern layout (dark left sidebar + white main column)
 * Popular for tech/design roles. ATS score ~78-85%.
 * - Left sidebar: Name, photo, contact, skills, languages, interests
 * - Right panel: Summary, Experience, Education, Projects, Certifications
 * - Accent color driven by colorPalette[3], dark by colorPalette[4]
 */
const TemplateTen = ({ resumeData, colorPalette, fontFamily }) => {
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
  } = resumeData || {};

  const accent = colorPalette?.[3] || '#4F46E5';
  const sidebarBg = colorPalette?.[4] || '#1e293b';
  const sidebarLight = colorPalette?.[2] || '#334155';
  const font = fontFamily || 'Inter, "Segoe UI", sans-serif';

  const s = {
    page: {
      fontFamily: font,
      display: 'flex',
      background: '#ffffff',
      boxSizing: 'border-box',
    },
    sidebar: {
      width: '33%',
      background: sidebarBg,
      color: '#f1f5f9',
      padding: '36px 20px',
      flexShrink: 0,
    },
    main: {
      flex: 1,
      padding: '36px 32px',
      color: '#1e293b',
      background: '#ffffff',
    },
    photoWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    photo: {
      width: '88px',
      height: '88px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `3px solid ${accent}`,
    },
    photoPlaceholder: {
      width: '88px',
      height: '88px',
      borderRadius: '50%',
      background: sidebarLight,
      border: `3px solid ${accent}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#fff',
    },
    sidebarName: {
      textAlign: 'center',
      fontSize: '15pt',
      fontWeight: 'bold',
      color: '#ffffff',
      lineHeight: 1.2,
      marginBottom: '4px',
    },
    sidebarDesignation: {
      textAlign: 'center',
      fontSize: '9pt',
      color: accent,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '20px',
    },
    sidebarSectionTitle: {
      fontSize: '8pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: accent,
      borderBottom: `1px solid ${sidebarLight}`,
      paddingBottom: '4px',
      marginBottom: '10px',
      marginTop: '18px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '8.5pt',
      color: '#cbd5e1',
      marginBottom: '6px',
      wordBreak: 'break-all',
    },
    contactIcon: {
      width: '12px',
      height: '12px',
      marginTop: '2px',
      flexShrink: 0,
      color: accent,
    },
    skillItem: {
      marginBottom: '8px',
    },
    skillName: {
      fontSize: '8.5pt',
      color: '#e2e8f0',
      marginBottom: '3px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    skillBar: {
      height: '4px',
      background: sidebarLight,
      borderRadius: '2px',
      overflow: 'hidden',
    },
    skillFill: (pct) => ({
      height: '100%',
      width: `${pct}%`,
      background: accent,
      borderRadius: '2px',
    }),
    interestTag: {
      display: 'inline-block',
      background: sidebarLight,
      color: '#cbd5e1',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '7.5pt',
      marginRight: '4px',
      marginBottom: '4px',
    },
    // Main panel
    mainSectionTitle: {
      fontSize: '11pt',
      fontWeight: 'bold',
      color: sidebarBg,
      borderLeft: `4px solid ${accent}`,
      paddingLeft: '10px',
      marginBottom: '12px',
      marginTop: '20px',
    },
    summaryText: {
      fontSize: '9.5pt',
      color: '#475569',
      lineHeight: 1.7,
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    expRole: {
      fontWeight: 'bold',
      fontSize: '10pt',
      color: '#1e293b',
    },
    expDates: {
      fontSize: '8.5pt',
      color: '#64748b',
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      marginLeft: '8px',
    },
    expCompany: {
      fontSize: '9pt',
      color: accent,
      marginBottom: '4px',
      fontWeight: '600',
    },
    bulletList: {
      margin: '4px 0 12px 0',
      paddingLeft: '16px',
      listStyle: 'disc',
    },
    bulletItem: {
      fontSize: '9pt',
      color: '#334155',
      marginBottom: '3px',
      lineHeight: 1.5,
    },
    eduDegree: {
      fontWeight: 'bold',
      fontSize: '9.5pt',
      color: '#1e293b',
    },
    eduSchool: {
      fontSize: '9pt',
      color: '#64748b',
    },
    projectTitle: {
      fontWeight: 'bold',
      fontSize: '9.5pt',
      color: '#1e293b',
    },
    projectLinks: {
      fontSize: '8pt',
      color: accent,
      marginLeft: '8px',
      textDecoration: 'none',
    },
    certRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '6px',
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

  const renderBullets = (description) => {
    if (!description) return null;
    const lines = description.split('\n').filter((l) => l.trim());
    return lines.length > 0 ? (
      <ul style={s.bulletList}>
        {lines.map((line, i) => (
          <li key={i} style={s.bulletItem}>{line.replace(/^[-•*]\s*/, '')}</li>
        ))}
      </ul>
    ) : null;
  };

  const initials = (profileInfo.fullName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={s.page}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={s.sidebar}>
        {/* Avatar */}
        <div style={s.photoWrapper}>
          {profileInfo.profilePreviewUrl ? (
            <img src={profileInfo.profilePreviewUrl} alt="Profile" style={s.photo} />
          ) : (
            <div style={s.photoPlaceholder}>{initials}</div>
          )}
        </div>

        <div style={s.sidebarName}>{profileInfo.fullName || 'Your Name'}</div>
        {profileInfo.designation && (
          <div style={s.sidebarDesignation}>{profileInfo.designation}</div>
        )}

        {/* Contact */}
        <div style={s.sidebarSectionTitle}>Contact</div>
        {contactInfo.phone && (
          <div style={s.contactItem}>
            <Phone style={s.contactIcon} />
            <span>{contactInfo.phone}</span>
          </div>
        )}
        {contactInfo.email && (
          <div style={s.contactItem}>
            <Mail style={s.contactIcon} />
            <span>{contactInfo.email}</span>
          </div>
        )}
        {contactInfo.location && (
          <div style={s.contactItem}>
            <MapPin style={s.contactIcon} />
            <span>{contactInfo.location}</span>
          </div>
        )}
        {contactInfo.linkedin && (
          <div style={s.contactItem}>
            <Linkedin style={s.contactIcon} />
            <a href={contactInfo.linkedin} style={{ color: '#93c5fd', fontSize: '8pt', wordBreak: 'break-all' }}>
              LinkedIn
            </a>
          </div>
        )}
        {contactInfo.github && (
          <div style={s.contactItem}>
            <Github style={s.contactIcon} />
            <a href={contactInfo.github} style={{ color: '#93c5fd', fontSize: '8pt', wordBreak: 'break-all' }}>
              GitHub
            </a>
          </div>
        )}
        {contactInfo.website && (
          <div style={s.contactItem}>
            <Globe style={s.contactIcon} />
            <a href={contactInfo.website} style={{ color: '#93c5fd', fontSize: '8pt', wordBreak: 'break-all' }}>
              Portfolio
            </a>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <>
            <div style={s.sidebarSectionTitle}>Skills</div>
            {skills.map((sk, i) => (
              <div key={i} style={s.skillItem} className="print-safe-section">
                <div style={s.skillName}>
                  <span>{sk.category ? <strong>{sk.category}: </strong> : null}{sk.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: '7.5pt' }}>{sk.progress}%</span>
                </div>
                <div style={s.skillBar}>
                  <div style={s.skillFill(sk.progress)} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Languages */}
        {languages.length > 0 && languages[0]?.name && (
          <>
            <div style={s.sidebarSectionTitle}>Languages</div>
            {languages.map((lang, i) => (
              <div key={i} style={s.skillItem}>
                <div style={s.skillName}>
                  <span>{lang.name}</span>
                </div>
                <div style={s.skillBar}>
                  <div style={s.skillFill(lang.progress)} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Interests */}
        {interests.length > 0 && interests[0] && (
          <>
            <div style={s.sidebarSectionTitle}>Interests</div>
            <div>
              {interests.map((it, i) => (
                <span key={i} style={s.interestTag}>{it}</span>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* ── MAIN PANEL ── */}
      <main style={s.main}>
        {/* Summary */}
        {profileInfo.summary && (
          <section>
            <div style={s.mainSectionTitle}>Professional Summary</div>
            <p style={s.summaryText}>{profileInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && workExperience[0]?.company && (
          <section>
            <div style={s.mainSectionTitle}>Experience</div>
            {workExperience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '14px' }} className="print-safe-section">
                <div style={s.expHeader}>
                  <span style={s.expRole}>{exp.role}</span>
                  <span style={s.expDates}>
                    {formatDate(exp.startDate)} – {exp.isCurrentlyWorking ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div style={s.expCompany}>{exp.company}</div>
                {renderBullets(exp.description)}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && projects[0]?.title && (
          <section>
            <div style={s.mainSectionTitle}>Projects</div>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '12px' }} className="print-safe-section">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={s.projectTitle}>{proj.title}</span>
                  {proj.github && (
                    <a href={proj.github} style={s.projectLinks}>GitHub ↗</a>
                  )}
                  {proj.liveDemo && (
                    <a href={proj.liveDemo} style={s.projectLinks}>Live ↗</a>
                  )}
                </div>
                {renderBullets(proj.description)}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education[0]?.degree && (
          <section>
            <div style={s.mainSectionTitle}>Education</div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }} className="print-safe-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={s.eduDegree}>{edu.degree}</span>
                  <span style={s.expDates}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
                <div style={s.eduSchool}>{edu.institution}</div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && certifications[0]?.title && (
          <section>
            <div style={s.mainSectionTitle}>Certifications</div>
            {certifications.map((cert, i) => (
              <div key={i} style={s.certRow} className="print-safe-section">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={12} style={{ color: accent }} />
                  <span style={{ fontSize: '9.5pt', fontWeight: '600' }}>{cert.title}</span>
                  {cert.issuer && <span style={{ fontSize: '9pt', color: '#64748b' }}>— {cert.issuer}</span>}
                </span>
                <span style={{ fontSize: '8.5pt', color: '#94a3b8', fontStyle: 'italic' }}>{cert.year}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default TemplateTen;
