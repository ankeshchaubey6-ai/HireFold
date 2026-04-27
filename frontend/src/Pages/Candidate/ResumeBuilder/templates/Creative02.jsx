import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/creative02.css";

const Creative02 = ({ resume }) => {
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
      THEME COLOR (CONNECTED TO BUILDER COLOR PICKER)
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
      className="resume-root creative02"
      /* GLOBAL THEME VARIABLES */
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}1A`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      {/* ======================================================
         LEFT PANEL
      ====================================================== */}
      <aside
        className="creative02-left"
        style={{
          background: "var(--resume-accent-soft)",
          borderRight: "2px solid var(--resume-accent-border)",
        }}
      >
        {/* PROFILE */}
        <div className="profile">
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="creative02-photo"
              style={{
                border: "3px solid var(--resume-accent)",
              }}
            />
          )}

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
        </div>

        {/* CONTACT */}
        <section>
          <h3
            style={{
              color: "var(--resume-accent)",
              borderBottom:
                "2px solid var(--resume-accent-border)",
              paddingBottom: 4,
            }}
          >
            Contact
          </h3>

          <div className="contact">
            {[email, phone, address, linkedin, github, portfolio]
              .filter(Boolean)
              .map((item, i) => (
                <div key={i}>{item}</div>
              ))}
          </div>
        </section>

        {/* SKILLS */}
        {skills?.length > 0 &&
          skills[0]?.items?.length > 0 && (
            <section>
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

              <ul>
                {skills[0].items.map(
                  (s, i) =>
                    s?.name && <li key={i}>{s.name}</li>
                )}
              </ul>
            </section>
          )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <section>
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

            <ul>
              {languages.map(
                (l, i) =>
                  l.name && (
                    <li key={i}>
                      {l.name}
                      {l.level && ` (${l.level})`}
                    </li>
                  )
              )}
            </ul>
          </section>
        )}
      </aside>

      {/* ======================================================
         RIGHT CONTENT
      ====================================================== */}
      <main className="creative02-right">
        {/* SUMMARY */}
        {summary && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
                marginBottom: 10,
              }}
            >
              Profile
            </h3>
            <p>{summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
                marginBottom: 12,
              }}
            >
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div key={i} className="creative02-item">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {exp.role}  {exp.company}
                </strong>

                {(exp.location || exp.startDate) && (
                  <div className="creative02-muted">
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

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
                marginBottom: 10,
              }}
            >
              Projects
            </h3>

            {projects.map((p, i) => (
              <div key={i} className="creative02-item">
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

        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--resume-accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
                marginBottom: 10,
              }}
            >
              Education
            </h3>

            {education.map((edu, i) => (
              <div key={i} className="creative02-item">
                <strong
                  style={{
                    color: "var(--resume-accent)",
                  }}
                >
                  {edu.degree}  {edu.institute}
                </strong>

                {(edu.fieldOfStudy || edu.startDate) && (
                  <div className="creative02-muted">
                    {edu.fieldOfStudy}
                    {edu.startDate && (
                      <>
                        {" "}
                        | {edu.startDate}  {edu.endDate}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section>
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
              <div key={i} className="creative02-item">
                {c.title}  {c.issuer}
              </div>
            ))}
          </section>
        )}

        {/* AWARDS */}
        {awards.length > 0 && (
          <section>
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
              <div key={i} className="creative02-item">
                {a.title}  {a.issuer}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Creative02;

