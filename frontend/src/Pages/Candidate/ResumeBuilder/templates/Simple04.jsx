import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/simple03.css";

const Simple04 = ({ resume }) => {
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
     This matches your ResumeForm color system
  ====================================================== */
  const accentColor =
    meta?.accentColor || "#2563EB";

  const {
    fullName,
    label,
    email,
    phone,
    address,
  } = basics;

  return (
    <div
      className="simple03"
      style={{
        "--accent": accentColor,
        "--accent-soft": `${accentColor}15`,
        "--accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= LEFT ================= */}
      <aside
        className="simple03-left"
        style={{
          borderRight: "2px solid var(--accent-border)",
        }}
      >
        <div>
          <h1 style={{ color: "var(--accent)" }}>
            {fullName}
          </h1>

          {label && (
            <h2 style={{ color: "var(--accent)" }}>
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
                color: "var(--accent)",
                borderBottom:
                  "1px solid var(--accent-border)",
                paddingBottom: 4,
              }}
            >
              Skills
            </h3>
            <ul>
              {skills.flatMap((s) =>
                (s.items || []).map(
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
                color: "var(--accent)",
                borderBottom:
                  "1px solid var(--accent-border)",
                paddingBottom: 4,
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
                color: "var(--accent)",
                borderBottom:
                  "1px solid var(--accent-border)",
                paddingBottom: 4,
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
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--accent)",
                paddingBottom: 4,
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
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--accent)",
                paddingBottom: 4,
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
                    "3px solid var(--accent)",
                  paddingLeft: 12,
                  marginBottom: 12,
                }}
              >
                <strong style={{ color: "var(--accent)" }}>
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

                <ul>
                  {exp.achievements?.map(
                    (a, idx) =>
                      a && <li key={idx}>{a}</li>
                  )}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--accent)",
                paddingBottom: 4,
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
                    "3px solid var(--accent)",
                  paddingLeft: 12,
                  marginBottom: 12,
                }}
              >
                <strong style={{ color: "var(--accent)" }}>
                  {p.title}
                </strong>
                {p.description && <p>{p.description}</p>}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
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
            <h3 style={{ color: "var(--accent)" }}>
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
            <h3 style={{ color: "var(--accent)" }}>
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
            <h3 style={{ color: "var(--accent)" }}>
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
            <h3 style={{ color: "var(--accent)" }}>
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
            <h3 style={{ color: "var(--accent)" }}>
              References
            </h3>
            {references.map((reference, index) => (
              <p key={index}>
                {[reference.name, reference.role, reference.company]
                  .filter(Boolean)
                  .join("  ")}
                {(reference.email || reference.phone) &&
                  `  ${[reference.email, reference.phone].filter(Boolean).join(" | ")}`}
              </p>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Simple04;

