import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/simple01.css";

const Simple01 = ({ resume }) => {
  if (!resume) return null;

  const {
    basics = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
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
    fullName = "",
    label = "",
    email = "",
    phone = "",
    linkedin = "",
    github = "",
    address = "",
  } = basics;

  return (
    <div
      className="resume-root simple01"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
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

        <p>
          {[email, phone, address, linkedin, github]
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
              marginBottom: 6,
            }}
          >
            Summary
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills?.[0]?.items?.length > 0 && (
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "1px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 6,
            }}
          >
            Skills
          </h3>

          <p
            style={{
              background: "var(--resume-accent-soft)",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            {skills[0].items
              .map((s) => s.name)
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
              marginBottom: 6,
            }}
          >
            Experience
          </h3>

          {experience.map((e, i) => (
            <div
              key={i}
              style={{
                borderLeft:
                  "3px solid var(--resume-accent)",
                paddingLeft: 10,
                marginBottom: 12,
              }}
            >
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {e.role}  {e.company}
              </strong>

              {e.location && (
                <p className="muted">{e.location}</p>
              )}

              {e.achievements?.length > 0 && (
                <ul>
                  {e.achievements.map(
                    (a, j) => a && <li key={j}>{a}</li>
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
              marginBottom: 6,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div
              key={i}
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
              marginBottom: 6,
            }}
          >
            Education
          </h3>

          {education.map((e, i) => (
            <div
              key={i}
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
                {e.degree}  {e.institute}
              </strong>
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
              .map((l) => l.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Simple01;

