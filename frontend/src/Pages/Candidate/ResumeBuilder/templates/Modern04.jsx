import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/modern04.css";

const Modern04 = ({ resume }) => {
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
    photo,
  } = basics;

  return (
    <div
      className="resume-root modern04"
      
      style={{
        borderTop: "6px solid var(--resume-accent)",
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="modern04-header"
        style={{
          borderBottom: "2px solid var(--resume-accent-border)",
        }}
      >
        <div className="left">
          <h1 style={{ color: "var(--resume-accent)" }}>
            {fullName}
          </h1>

          {label && (
            <h2 style={{ color: "var(--resume-accent)" }}>
              {label}
            </h2>
          )}

          <div className="contacts">
            {[email, phone, address, linkedin, github, portfolio]
              .filter(Boolean)
              .map((v, i) => (
                <span key={i}>{v}</span>
              ))}
          </div>
        </div>

        {photo && (
          <img
            src={photo}
            alt="Profile"
            className="resume-photo"
            style={{
              border: "3px solid var(--resume-accent)",
            }}
          />
        )}
      </header>

      {/* ================= SUMMARY ================= */}
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
            Summary
          </h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills?.[0]?.items?.length > 0 && (
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "2px solid var(--resume-accent-border)",
              paddingBottom: 4,
            }}
          >
            Skills
          </h3>

          <div className="resume-tags">
            {skills[0].items.map(
              (s, i) =>
                s?.name && (
                  <span
                    key={i}
                    className="resume-tag"
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
            <div key={i} className="item">
              <strong
                style={{ color: "var(--resume-accent)" }}
              >
                {exp.role}  {exp.company}
              </strong>

              <div className="muted">
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
            <div key={i} className="item">
              <strong
                style={{ color: "var(--resume-accent)" }}
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
                "2px solid var(--resume-accent-border)",
              paddingBottom: 4,
            }}
          >
            Education
          </h3>

          {education.map((edu, i) => (
            <div key={i} className="item">
              <strong
                style={{ color: "var(--resume-accent)" }}
              >
                {edu.degree}  {edu.institute}
              </strong>

              <div className="muted">
                {edu.fieldOfStudy}
                {edu.startDate && (
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
        <section className="resume-section">
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "2px solid var(--resume-accent-border)",
              paddingBottom: 4,
            }}
          >
            Certifications
          </h3>

          {certifications.map((c, i) => (
            <div key={i} className="item">
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
                "2px solid var(--resume-accent-border)",
              paddingBottom: 4,
            }}
          >
            Awards
          </h3>

          {awards.map((a, i) => (
            <div key={i} className="item">
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
                "2px solid var(--resume-accent-border)",
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
                      borderColor: "var(--resume-accent)",
                      color: "var(--resume-accent)",
                    }}
                  >
                    {l.name} {l.level && `(${l.level})`}
                  </span>
                )
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Modern04;

