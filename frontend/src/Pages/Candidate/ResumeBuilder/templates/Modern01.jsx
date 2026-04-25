import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/modern01.css";

const Modern01 = ({ resume }) => {
  if (!resume) return null;

  /* =====================================================
      DYNAMIC ACCENT COLOR (FROM YOUR COLOR PICKER)
     This reads: resume.meta.accentColor
  ===================================================== */
  const accentColor =
    resume?.meta?.accentColor || "#0ea5e9";

  const {
    basics = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    courses = [],
    publications = [],
    volunteer = [],
    awards = [],
    languages = [],
    references = [],
  } = resume;

  const {
    fullName = "Your Name",
    label = "",
    email = "",
    phone = "",
    address = "",
    linkedin = "",
    github = "",
    portfolio = "",
    photo = null,
  } = basics;

  return (
    <div
      className="resume-root modern01"
      style={{
        /*  GLOBAL THEME COLOR INJECTION */
        "--accent-color": accentColor,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="modern01-header"
        style={{
          borderBottom: `3px solid ${accentColor}`,
          paddingBottom: 12,
          marginBottom: 18,
        }}
      >
        <div className="modern01-title">
          <h1
            style={{
              color: accentColor, //  Name color changes with picker
            }}
          >
            {fullName}
          </h1>

          {label && (
            <h2
              style={{
                color: "#555",
                fontWeight: 500,
              }}
            >
              {label}
            </h2>
          )}
        </div>

        <div className="modern01-contact">
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="resume-photo"
              style={{
                border: `2px solid ${accentColor}`, //  Photo border themed
              }}
            />
          )}

          <div className="resume-muted">
            {[email, phone, address, linkedin, github, portfolio]
              .filter(Boolean)
              .map((v, i) => (
                <div key={i}>{v}</div>
              ))}
          </div>
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor, //  Section title color dynamic
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Summary
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Skills
          </h3>

          {skills.map((group, i) => (
            <div key={i} className="resume-item">
              {group.category && (
                <strong
                  style={{
                    color: accentColor,
                  }}
                >
                  {group.category}
                </strong>
              )}

              <div className="resume-tags">
                {group.items?.map(
                  (s, idx) =>
                    s?.name && (
                      <span
                        key={idx}
                        className="resume-tag"
                        style={{
                          border: `1px solid ${accentColor}`,
                          color: accentColor,
                          background: `${accentColor}10`, // soft tint
                        }}
                      >
                        {s.name}
                      </span>
                    )
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Experience
          </h3>

          {experience.map((exp, i) => (
            <div key={i} className="resume-item">
              <strong>
                {exp.role}
                {exp.company && `  ${exp.company}`}
              </strong>

              {(exp.location || exp.startDate) && (
                <div className="resume-muted">
                  {exp.location}
                  {exp.startDate && (
                    <>
                      {" "}
                      | {exp.startDate} {" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : exp.endDate}
                    </>
                  )}
                </div>
              )}

              {exp.achievements?.length > 0 && (
                <ul className="resume-list">
                  {exp.achievements.map(
                    (a, idx) =>
                      a && <li key={idx}>{a}</li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {projects.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div key={i} className="resume-item">
              <strong style={{ color: accentColor }}>
                {p.title}
              </strong>
              {p.description && <p>{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {education.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div key={i} className="resume-item">
              <strong>
                {edu.degree}
                {edu.institute && `  ${edu.institute}`}
              </strong>

              {(edu.fieldOfStudy || edu.startDate) && (
                <div className="resume-muted">
                  {edu.fieldOfStudy}
                  {edu.startDate && (
                    <>
                      {" "}
                      | {edu.startDate}  {edu.endDate}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Certifications
          </h3>

          {certifications.map((c, i) => (
            <div key={i} className="resume-item">
              {c.title}
              {c.issuer && `  ${c.issuer}`}
            </div>
          ))}
        </section>
      )}

      {/* ================= COURSES ================= */}
      {courses.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Courses
          </h3>

          {courses.map((c, i) => (
            <div key={i} className="resume-item">
              {c.title}
              {c.provider && `  ${c.provider}`}
            </div>
          ))}
        </section>
      )}

      {/* ================= PUBLICATIONS ================= */}
      {publications.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Publications
          </h3>

          {publications.map((p, i) => (
            <div key={i} className="resume-item">
              {p.title}
              {p.publisher && `  ${p.publisher}`}
            </div>
          ))}
        </section>
      )}

      {/* ================= AWARDS ================= */}
      {awards.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Awards
          </h3>

          {awards.map((a, i) => (
            <div key={i} className="resume-item">
              {a.title}
              {a.issuer && `  ${a.issuer}`}
            </div>
          ))}
        </section>
      )}

      {/* ================= LANGUAGES ================= */}
      {languages.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            Languages
          </h3>

          <div className="resume-tags">
            {languages.map(
              (l, i) =>
                l.name && (
                  <span
                    key={i}
                    className="resume-tag"
                    style={{
                      border: `1px solid ${accentColor}`,
                      color: accentColor,
                      background: `${accentColor}10`,
                    }}
                  >
                    {l.name}
                    {l.level && ` (${l.level})`}
                  </span>
                )
            )}
          </div>
        </section>
      )}

      {/* ================= REFERENCES ================= */}
      {references.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: accentColor,
              borderBottom: `2px solid ${accentColor}`,
              paddingBottom: 4,
            }}
          >
            References
          </h3>
          <p className="resume-muted">
            Available upon request
          </p>
        </section>
      )}
    </div>
  );
};

export default Modern01;

