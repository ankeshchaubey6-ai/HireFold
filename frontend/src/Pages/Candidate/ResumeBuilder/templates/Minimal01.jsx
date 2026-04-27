import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/minimal01.css";

const Minimal01 = ({ resume }) => {
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
    fullName = "",
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
      className="resume-root minimal01"
      
      style={{
        borderTop: "5px solid var(--resume-accent)",
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="minimal01-header"
        style={{
          borderBottom: "2px solid var(--resume-accent-border)",
          paddingBottom: 12,
          marginBottom: 18,
        }}
      >
        <h1
          style={{
            color: "var(--resume-accent)",
            marginBottom: 4,
          }}
        >
          {fullName}
        </h1>

        {label && (
          <h2
            style={{
              fontWeight: 500,
              color: "var(--resume-accent)",
              marginBottom: 8,
            }}
          >
            {label}
          </h2>
        )}

        <div className="minimal01-contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .join("  ")}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Summary
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills?.length > 0 && skills[0]?.items?.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Skills
          </h3>
          <p
            className="skill-line"
            style={{
              color: "var(--resume-accent)",
              fontWeight: 500,
            }}
          >
            {skills[0].items
              .map((s) => s?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Experience
          </h3>

          {experience.map((exp, i) => (
            <div key={i} className="resume-item">
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {exp.role}
                {exp.company && `  ${exp.company}`}
              </strong>

              {(exp.location || exp.startDate) && (
                <div className="resume-muted">
                  {exp.location}
                  {exp.startDate && (
                    <>
                      {" "} | {exp.startDate} {" "}
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
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div key={i} className="resume-item">
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
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
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div key={i} className="resume-item">
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {edu.degree}  {edu.institute}
              </strong>

              {(edu.fieldOfStudy || edu.startDate) && (
                <div className="resume-muted">
                  {edu.fieldOfStudy}
                  {edu.startDate && (
                    <>
                      {" "} | {edu.startDate} {" "}
                      {edu.endDate}
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
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Certifications
          </h3>

          {certifications.map((c, i) => (
            <div key={i} className="resume-item">
              {c.title}  {c.issuer}
            </div>
          ))}
        </section>
      )}

      {/* ================= AWARDS ================= */}
      {awards.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
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

      {/* ================= LANGUAGES ================= */}
      {languages.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Languages
          </h3>
          <p
            className="skill-line"
            style={{
              color: "var(--resume-accent)",
              fontWeight: 500,
            }}
          >
            {languages
              .map(
                (l) =>
                  `${l.name}${l.level ? ` (${l.level})` : ""}`
              )
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Minimal01;

