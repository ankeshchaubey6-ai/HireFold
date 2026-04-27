import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/ats01.css";

const ATS01 = ({ resume }) => {
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
    meta = {},
  } = resume;

  /* ======================================================
      GLOBAL ACCENT COLOR (CONNECTED TO COLOR PICKER)
  ====================================================== */
  const accentColor =
    meta?.accentColor || "#0ea5e9";

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
      className="resume-root ats01"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="ats01-header"
        style={{
          borderBottom:
            "2px solid var(--resume-accent)",
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        <h1 style={{ color: "var(--resume-accent)" }}>
          {fullName}
        </h1>

        {label && (
          <h2
            style={{
              color: "var(--resume-accent)",
              opacity: 0.9,
            }}
          >
            {label}
          </h2>
        )}

        <div className="ats01-contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Professional Summary
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills?.length > 0 &&
        skills[0]?.items?.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "1px solid var(--resume-accent-border)",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Skills
            </h3>
            <p>
              {skills[0].items
                .map((s) => s?.name)
                .filter(Boolean)
                .join(", ")}
            </p>
          </section>
        )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Work Experience
          </h3>

          {experience.map((exp, i) => (
            <div
              key={i}
              className="ats01-item"
              style={{
                borderLeft:
                  "3px solid var(--resume-accent)",
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {exp.role}  {exp.company}
              </strong>

              <div className="ats01-muted">
                {exp.location}
                {(exp.startDate || exp.endDate) && (
                  <>
                    {" | "}
                    {exp.startDate} {" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : exp.endDate}
                  </>
                )}
              </div>

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
                "1px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div
              key={i}
              className="ats01-item"
              style={{
                borderLeft:
                  "3px solid var(--resume-accent)",
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
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
                "1px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div
              key={i}
              className="ats01-item"
              style={{
                borderLeft:
                  "3px solid var(--resume-accent)",
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {edu.degree}  {edu.institute}
              </strong>

              {(edu.fieldOfStudy || edu.startDate) && (
                <div className="ats01-muted">
                  {edu.fieldOfStudy}
                  {edu.startDate && (
                    <>
                      {" | "}
                      {edu.startDate}  {edu.endDate}
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
        <section>
          <h3 style={{ color: "var(--resume-accent)" }}>
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
          <h3 style={{ color: "var(--resume-accent)" }}>
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
          <h3 style={{ color: "var(--resume-accent)" }}>
            Languages
          </h3>
          <p>
            {languages
              .map(
                (l) => `${l.name} (${l.level})`
              )
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default ATS01;

