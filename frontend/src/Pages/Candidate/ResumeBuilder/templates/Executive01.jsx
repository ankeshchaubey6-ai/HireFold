import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/executive01.css";

const Executive01 = ({ resume }) => {
  if (!resume) return null;

  const {
    basics = {},
    summary = "",
    experience = [],
    skills = [],
    education = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
    meta = {},
  } = resume;

  /* ======================================================
      GLOBAL THEME COLOR (CONNECTED TO COLOR PICKER)
  ====================================================== */
  const accentColor =
    meta?.accentColor || "#0ea5e9";

  const {
    fullName = "",
    label = "",
    email = "",
    phone = "",
    linkedin = "",
    address = "",
  } = basics;

  return (
    <div
      className="resume-root executive01"
      /* GLOBAL CSS VARIABLES FOR ALL STYLING */
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="exec-header"
        style={{
          borderBottom:
            "3px solid var(--resume-accent)",
        }}
      >
        <div>
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
                opacity: 0.85,
              }}
            >
              {label}
            </h2>
          )}
        </div>

        <div className="exec-contact">
          {[email, phone, address, linkedin]
            .filter(Boolean)
            .map((v, i) => (
              <div key={i}>{v}</div>
            ))}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section
          className="exec-summary"
          style={{
            borderLeft:
              "4px solid var(--resume-accent)",
            paddingLeft: 12,
          }}
        >
          <p>{summary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "2px solid var(--resume-accent-border)",
              paddingBottom: 6,
              marginBottom: 12,
            }}
          >
            Professional Experience
          </h3>

          {experience.map((exp, i) => (
            <div key={i} className="exec-item">
              <div className="exec-item-header">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                <span>
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

      {/* ================= SKILLS ================= */}
      {skills?.length > 0 &&
        skills[0]?.items?.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 6,
              }}
            >
              Core Competencies
            </h3>

            <div className="exec-skills">
              {skills[0].items.map(
                (s, i) =>
                  s?.name && (
                    <span
                      key={i}
                      style={{
                        border:
                          "1px solid var(--resume-accent-border)",
                        background:
                          "var(--resume-accent-soft)",
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

      {/* ================= PROJECTS ================= */}
      {projects.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "2px solid var(--resume-accent-border)",
              paddingBottom: 6,
            }}
          >
            Key Initiatives
          </h3>

          {projects.map((p, i) => (
            <div key={i} className="exec-item">
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
                "2px solid var(--resume-accent-border)",
              paddingBottom: 6,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div key={i} className="exec-item">
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {edu.degree}  {edu.institute}
              </strong>

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
            }}
          >
            Languages
          </h3>

          <p>
            {languages
              .map(
                (l) =>
                  `${l.name} (${l.level})`
              )
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Executive01;

