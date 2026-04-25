import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/ats02.css";

const ATS02 = ({ resume }) => {
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
     Reads from: meta.accentColor (YOUR SCHEMA)
  ====================================================== */
  const accentColor =
    meta?.accentColor || "#0ea5e9";

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
      className="resume-root ats02"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="ats02-header"
        style={{
          borderBottom: "2px solid var(--resume-accent)",
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        <h1
          style={{
            color: "var(--resume-accent)",
          }}
        >
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

        <p className="contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .join(" | ")}
        </p>
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
            Summary
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

            <p
              className="skills-line"
              style={{
                background: "var(--resume-accent-soft)",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              {skills[0].items
                .map((s) => s.name)
                .filter(Boolean)
                .join("  ")}
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
            Experience
          </h3>

          {experience.map((exp, i) => (
            <div
              key={i}
              className="item"
              style={{
                borderLeft:
                  "3px solid var(--resume-accent)",
                paddingLeft: 10,
                marginBottom: 12,
              }}
            >
              <div className="item-header">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                <span
                  className="date"
                  style={{
                    color: "var(--resume-accent)",
                    fontWeight: 500,
                  }}
                >
                  {exp.startDate} {" "}
                  {exp.currentlyWorking
                    ? "Present"
                    : exp.endDate}
                </span>
              </div>

              {exp.location && (
                <div className="muted">
                  {exp.location}
                </div>
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
              className="item"
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
              className="item"
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

              <div className="muted">
                {edu.fieldOfStudy}
                {(edu.startDate || edu.endDate) && (
                  <>
                    {" "}
                    | {edu.startDate}  {edu.endDate}
                  </>
                )}
              </div>
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
              .map((l) => `${l.name} (${l.level})`)
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default ATS02;

