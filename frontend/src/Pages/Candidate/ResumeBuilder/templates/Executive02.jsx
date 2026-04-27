import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/executive02.css";

const Executive02 = ({ resume }) => {
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
      GLOBAL THEME COLOR (CONNECTED TO COLOR PICKER)
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
    photo = null,
  } = basics;

  return (
    <div
      className="resume-root executive02"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ================= LEFT ================= */}
      <aside
        className="executive02-left"
        style={{
          borderRight: "3px solid var(--resume-accent)",
        }}
      >
        {/* Profile */}
        <div className="executive02-profile">
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="executive02-photo"
              style={{
                border:
                  "3px solid var(--resume-accent)",
              }}
            />
          )}

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
        </div>

        {/* Contact */}
        <section>
          <h3 style={{ color: "var(--resume-accent)" }}>
            Contact
          </h3>

          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .map((item, i) => (
              <p key={i}>{item}</p>
            ))}
        </section>

        {/* Skills */}
        {skills?.length > 0 &&
          skills[0]?.items?.length > 0 && (
            <section>
              <h3
                style={{
                  color: "var(--resume-accent)",
                }}
              >
                Skills
              </h3>

              <ul>
                {skills[0].items.map(
                  (s, i) =>
                    s?.name && (
                      <li
                        key={i}
                        style={{
                          borderLeft:
                            "3px solid var(--resume-accent)",
                          paddingLeft: 8,
                          marginBottom: 4,
                        }}
                      >
                        {s.name}
                      </li>
                    )
                )}
              </ul>
            </section>
          )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>
              Languages
            </h3>

            <ul>
              {languages.map(
                (l, i) =>
                  l.name && (
                    <li key={i}>
                      {l.name}
                      {l.level ? ` (${l.level})` : ""}
                    </li>
                  )
              )}
            </ul>
          </section>
        )}
      </aside>

      {/* ================= RIGHT ================= */}
      <main className="executive02-right">
        {/* Profile / Summary */}
        {summary && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 6,
                marginBottom: 10,
              }}
            >
              Profile
            </h3>
            <p>{summary}</p>
          </section>
        )}

        {/* Experience */}
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
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div
                key={i}
                className="executive02-item"
                style={{
                  borderLeft:
                    "4px solid var(--resume-accent)",
                  paddingLeft: 12,
                }}
              >
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                {(exp.location || exp.startDate) && (
                  <div className="executive02-muted">
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

        {/* Projects */}
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
              Projects
            </h3>

            {projects.map((p, i) => (
              <div
                key={i}
                className="executive02-item"
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

        {/* Education */}
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
              <div
                key={i}
                className="executive02-item"
              >
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {edu.degree}  {edu.institute}
                </strong>

                {(edu.fieldOfStudy ||
                  edu.startDate) && (
                  <div className="executive02-muted">
                    {edu.fieldOfStudy}
                    {edu.startDate && (
                      <>
                        {" "}
                        | {edu.startDate} {" "}
                        {edu.endDate}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
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
              <div
                key={i}
                className="executive02-item"
              >
                {c.title}  {c.issuer}
              </div>
            ))}
          </section>
        )}

        {/* Awards */}
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
              <div
                key={i}
                className="executive02-item"
              >
                {a.title}  {a.issuer}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Executive02;

