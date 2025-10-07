import React from "react";

const TemplateFive = ({ resumeData, colorPalette }) => {
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

  const primaryColor = colorPalette ? colorPalette[3] : "#333";
  const lightBgColor = colorPalette ? colorPalette[1] : "#f8f9fa";
  const textColor = colorPalette ? colorPalette[4] : "#212529";

  const containerStyle = {
    fontFamily: resumeData?.template?.fontFamily || "sans-serif",
    backgroundColor: "#ffffff",
    color: textColor,
    padding: "40px",
    minHeight: "1122px",
  };

  const sectionStyle = {
    marginBottom: "25px",
  };

  const sectionTitleStyle = {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: primaryColor,
    borderBottom: `2px solid ${primaryColor}`,
    paddingBottom: "8px",
    marginBottom: "15px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <div style={containerStyle}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "3rem", margin: "0", color: primaryColor }}>
          {profileInfo.fullName}
        </h1>
        <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
          {profileInfo.designation}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "10px",
            fontSize: "0.9rem",
          }}
        >
          <span>{contactInfo.email}</span>
          <span>{contactInfo.phone}</span>
          {contactInfo.website && <span>{contactInfo.website}</span>}
        </div>
      </header>

      <section style={sectionStyle}>
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          {profileInfo.summary}
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Experience</h2>
        {workExperience.map((job, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0" }}>
              {job.role}
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontStyle: "italic",
                margin: "2px 0 5px 0",
              }}
            >
              <span>{job.company}</span>
              <span>
                {job.startDate} - {job.endDate}
              </span>
            </div>
            <p style={{ margin: 0 }}>{job.description}</p>
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Skills</h2>
        <ul
          style={{
            padding: 0,
            margin: 0,
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {skills.map((skill, index) => (
            <li
              key={index}
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              {skill.name}
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Projects</h2>
        {projects.map((project, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0" }}>
              {project.title}
            </h3>
            <p style={{ margin: "5px 0" }}>{project.description}</p>
          </div>
        ))}
      </section>

       <div
        style={{ display: "grid", gap: "20px" }}
      >
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Education</h2>
          {education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <h3
                style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0" }}
              >
                {edu.institution}
              </h3>
              <p style={{ margin: "2px 0" }}>{edu.degree}</p>
              <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default TemplateFive;
