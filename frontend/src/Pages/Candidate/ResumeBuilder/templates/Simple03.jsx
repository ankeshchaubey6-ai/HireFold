import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/simple03.css";

const Simple03 = ({ resume }) => {
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
    courses = [],
    publications = [],
    volunteer = [],
    references = [],
    meta = {},
  } = resume;

  /* ======================================================
     GLOBAL ACCENT COLOR (CONNECTED TO YOUR COLOR PICKER)
     Uses: meta.accentColor (YOUR SCHEMA)
  ====================================================== */
  const accentColor =
    meta?.accentColor || "#0ea5e9";

  const {
    fullName = "Your Name",
    label = "",
    email = "",
    phone = "",
    address = "",
  } = basics;

  return (
    <div
      className="resume-root simple03"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}15`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= LEFT ================= */}
      <aside
        className="simple03-left"
        style={{
          borderRight: "2px solid var(--resume-accent-border)",
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
                opacity: 0.9,
              }}
            >
              {label}
            </h2>
          )}

          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
          {address && <p>{address}</p>}
        </div>

        {skills.length > 0 && (
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
            <ul>
              {skills.flatMap((s) =>
                s.items?.map(
                  (i, idx) =>
                    i?.name && (
                      <li key={idx}>{i.name}</li>
                    )
                )
              )}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
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
              Languages
            </h3>
            <ul>
              {languages.map(
                (l, i) =>
                  l.name && (
                    <li key={i}>
                      {l.name}
                      {l.level ? `  ${l.level}` : ""}
                    </li>
                  )
              )}
            </ul>
          </section>
        )}

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
              <p key={i}>
                {e.degree}  {e.institute}
              </p>
            ))}
          </section>
        )}
      </aside>

      {/* ================= RIGHT ================= */}
      <main className="simple03-right">
        {summary && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent)",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Summary
            </h3>
            <p>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent)",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div
                key={i}
                className="simple03-item"
                style={{
                  borderLeft:
                    "3px solid var(--resume-accent)",
                  paddingLeft: 12,
                  marginBottom: 14,
                }}
              >
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                {(exp.startDate || exp.endDate) && (
                  <span className="simple03-muted">
                    {" "}
                    {exp.startDate} {" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : exp.endDate}
                  </span>
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

        {projects.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent)",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Projects
            </h3>
            {projects.map((p, i) => (
              <div
                key={i}
                className="simple03-item"
                style={{
                  borderLeft:
                    "3px solid var(--resume-accent)",
                  paddingLeft: 12,
                  marginBottom: 12,
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

        {courses.length > 0 && (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>
              Courses
            </h3>
            {courses.map((c, i) => (
              <p key={i}>
                {c.title}  {c.provider}
              </p>
            ))}
          </section>
        )}

        {publications.length > 0 && (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>
              Publications
            </h3>
            {publications.map((p, i) => (
              <p key={i}>
                {p.title}  {p.publisher}
              </p>
            ))}
          </section>
        )}

        {volunteer.length > 0 && (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>
              Volunteer
            </h3>
            {volunteer.map((v, i) => (
              <p key={i}>
                {v.role}  {v.organization}
              </p>
            ))}
          </section>
        )}

        {references.length > 0 && (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>
              References
            </h3>
            <p>Available on request</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Simple03;

