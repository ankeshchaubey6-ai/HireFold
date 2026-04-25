import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/modern03.css";

const Modern03 = ({ resume }) => {
  if (!resume) return null;

  const {
    basics = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
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
  } = basics;

  return (
    <div
      className="resume-root modern03"
      /*  CORE: Enables global theme color from color picker */
      style={{
        borderLeft: "6px solid var(--resume-accent)",
      }}
    >
      {/* ================= LEFT COLUMN ================= */}
      <aside
        className="modern03-left"
        style={{
          background: "var(--resume-accent-light)",
          borderRight: "2px solid var(--resume-accent-border)",
        }}
      >
        <div className="left-block">
          <h1 style={{ color: "var(--resume-accent)" }}>
            {fullName}
          </h1>

          {label && (
            <h2 style={{ color: "var(--resume-accent)" }}>
              {label}
            </h2>
          )}
        </div>

        {/* CONTACT */}
        <div className="left-block">
          <h3 style={{ color: "var(--resume-accent)" }}>
            Contact
          </h3>
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .map((v, i) => (
              <div key={i} className="left-text">
                {v}
              </div>
            ))}
        </div>

        {/* SKILLS */}
        {skills?.length > 0 &&
          skills[0]?.items?.length > 0 && (
            <div className="left-block">
              <h3 style={{ color: "var(--resume-accent)" }}>
                Skills
              </h3>
              <ul className="left-list">
                {skills[0].items.map(
                  (s, i) =>
                    s?.name && <li key={i}>{s.name}</li>
                )}
              </ul>
            </div>
          )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <div className="left-block">
            <h3 style={{ color: "var(--resume-accent)" }}>
              Languages
            </h3>
            <ul className="left-list">
              {languages.map(
                (l, i) =>
                  l.name && (
                    <li key={i}>
                      {l.name}
                      {l.level && `  ${l.level}`}
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <div className="left-block">
            <h3 style={{ color: "var(--resume-accent)" }}>
              Certifications
            </h3>
            <ul className="left-list">
              {certifications.map((c, i) => (
                <li key={i}>{c.title}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* ================= RIGHT COLUMN ================= */}
      <main className="modern03-right">
        {/* SUMMARY */}
        {summary && (
          <section className="resume-section">
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Professional Summary
            </h3>
            <p>{summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="resume-section">
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div key={i} className="resume-item">
                <strong>
                  {exp.role}  {exp.company}
                </strong>

                {(exp.startDate || exp.endDate) && (
                  <div className="resume-muted">
                    {exp.startDate} {" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : exp.endDate}
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

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="resume-section">
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Projects
            </h3>

            {projects.map((p, i) => (
              <div key={i} className="resume-item">
                <strong>{p.title}</strong>
                {p.description && <p>{p.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="resume-section">
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Education
            </h3>

            {education.map((edu, i) => (
              <div key={i} className="resume-item">
                <strong>
                  {edu.degree}  {edu.institute}
                </strong>

                {edu.fieldOfStudy && (
                  <div className="resume-muted">
                    {edu.fieldOfStudy}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* AWARDS */}
        {awards.length > 0 && (
          <section className="resume-section">
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Awards
            </h3>

            {awards.map((a, i) => (
              <div key={i} className="resume-item">
                {a.title}  {a.issuer}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Modern03;

