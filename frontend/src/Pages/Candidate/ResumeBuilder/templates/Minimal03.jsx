import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/minimal03.css";

const Minimal03 = ({ resume }) => {
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
      className="resume-root minimal03"
      /*  THIS LINE CONNECTS COLOR PICKER TO TEMPLATE */
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-border": `${accentColor}33`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="minimal03-header"
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
              color: "var(--resume-accent)",
              fontWeight: 500,
            }}
          >
            {label}
          </h2>
        )}

        <div className="contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .join("  ")}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section>
          <p
            className="summary"
            style={{
              borderLeft: "4px solid var(--resume-accent)",
              paddingLeft: 12,
            }}
          >
            {summary}
          </p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills.length > 0 && skills[0]?.items?.length > 0 && (
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
            Skills
          </h3>
          <p className="inline">
            {skills[0]?.items
              ?.map((s) => s?.name)
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
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Experience
          </h3>

          {experience.map((exp, i) => (
            <div key={i} className="item">
              <div className="row">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}
                </strong>

                <span>
                  {exp.startDate} {" "}
                  {exp.currentlyWorking
                    ? "Present"
                    : exp.endDate}
                </span>
              </div>

              <div className="muted">
                {exp.company}
                {exp.location && `  ${exp.location}`}
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
                "1.5px solid var(--resume-accent-border)",
              paddingBottom: 4,
              marginBottom: 10,
            }}
          >
            Projects
          </h3>

          {projects.map((p, i) => (
            <div key={i} className="item">
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
            <div key={i} className="item">
              <strong
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                {edu.degree}
              </strong>
              <div className="muted">
                {edu.institute}
                {edu.fieldOfStudy &&
                  `  ${edu.fieldOfStudy}`}
              </div>
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
          <p className="inline">
            {certifications
              .map((c) => c.title)
              .join(", ")}
          </p>
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
          <p className="inline">
            {awards.map((a) => a.title).join(", ")}
          </p>
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
          <p className="inline">
            {languages
              .map(
                (l) =>
                  `${l.name}${
                    l.level ? ` (${l.level})` : ""
                  }`
              )
              .join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Minimal03;

