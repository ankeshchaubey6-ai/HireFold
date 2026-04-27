import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/minimal02.css";

const Minimal02 = ({ resume }) => {
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
      className="resume-root minimal02"
      
      style={{
        borderTop: "6px solid var(--resume-accent)",
        paddingTop: 12,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="minimal02-header"
        style={{
          borderBottom: "2px solid var(--resume-accent-border)",
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div>
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
                color: "var(--resume-accent)",
                fontWeight: 500,
              }}
            >
              {label}
            </h2>
          )}
        </div>

        <div className="minimal02-contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .map((v, i) => (
              <div key={i}>{v}</div>
            ))}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Profile
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills?.length > 0 && skills[0]?.items?.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Skills
          </h3>
          <div className="minimal02-tags">
            {skills[0].items.map(
              (s, i) =>
                s?.name && (
                  <span
                    key={i}
                    className="minimal02-tag"
                    style={{
                      borderColor: "var(--resume-accent)",
                      color: "var(--resume-accent)",
                    }}
                  >
                    {s.name}
                  </span>
                )
            )}
          </div>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Experience
          </h3>

          {experience.map((exp, i) => (
            <div key={i} className="minimal02-item">
              <div className="minimal02-row">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                {(exp.startDate || exp.endDate) && (
                  <span className="muted">
                    {exp.startDate} {" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : exp.endDate}
                  </span>
                )}
              </div>

              {exp.location && (
                <div className="muted">{exp.location}</div>
              )}

              {exp.achievements?.length > 0 && (
                <ul>
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
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div key={i} className="minimal02-item">
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
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div key={i} className="minimal02-item">
              <div className="minimal02-row">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {edu.degree}  {edu.institute}
                </strong>

                {(edu.startDate || edu.endDate) && (
                  <span className="muted">
                    {edu.startDate}  {edu.endDate}
                  </span>
                )}
              </div>

              {edu.fieldOfStudy && (
                <div className="muted">
                  {edu.fieldOfStudy}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications.length > 0 && (
        <section>
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
            <p key={i}>
              {c.title}  {c.issuer}
            </p>
          ))}
        </section>
      )}

      {/* ================= AWARDS ================= */}
      {awards.length > 0 && (
        <section>
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
            <p key={i}>
              {a.title}  {a.issuer}
            </p>
          ))}
        </section>
      )}

      {/* ================= LANGUAGES ================= */}
      {languages.length > 0 && (
        <section>
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
          <p>
            {languages
              .map(
                (l) =>
                  `${l.name}${l.level ? ` (${l.level})` : ""}`
              )
              .join("  ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Minimal02;

