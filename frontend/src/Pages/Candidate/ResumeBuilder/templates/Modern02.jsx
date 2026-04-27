import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/modern02.css";

const Modern02 = ({ resume }) => {
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
    photo = null,
  } = basics;

  return (
    <div
      className="resume-root modern02"
      style={{
        /*  LOCKED TO GLOBAL COLOR ENGINE (NO BLUE FALLBACK) */
        borderTop: "6px solid var(--accent)",
        color: "#111827",
        background: "#ffffff",
      }}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className="modern02-left"
        style={{
          background: "var(--resume-accent-light)",
          borderRight: "2px solid var(--resume-accent-border)",
        }}
      >
        {photo && (
          <img
            src={photo}
            alt="Profile"
            className="resume-photo"
          />
        )}

        <h1
          className="name"
          style={{ color: "var(--accent)" }}
        >
          {fullName}
        </h1>

        {label && (
          <h2
            className="title"
            style={{
              color: "#6b7280", // neutral professional (NOT accent)
              fontWeight: 500,
            }}
          >
            {label}
          </h2>
        )}

        <div className="contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .map((item, i) => (
              <div key={i}>{item}</div>
            ))}
        </div>

        {/* ================= SKILLS ================= */}
        {skills?.length > 0 &&
          skills[0]?.items?.length > 0 && (
            <section>
              <h3 style={{ color: "var(--accent)" }}>
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

        {/* ================= LANGUAGES ================= */}
        {languages.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
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

      {/* ================= RIGHT CONTENT ================= */}
      <main className="modern02-right">
        {/* ================= SUMMARY ================= */}
        {summary && (
          <section>
            <h3
              style={{
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Professional Summary
            </h3>
            <p>{summary}</p>
          </section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience.length > 0 && (
          <section>
            <h3
              style={{
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div key={i} className="item">
                <strong>
                  {exp.role}
                  {exp.company && `  ${exp.company}`}
                </strong>

                {(exp.location || exp.startDate) && (
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
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Projects
            </h3>

            {projects.map((p, i) => (
              <div key={i} className="item">
                <strong>{p.title}</strong>
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
                color: "var(--accent)",
                borderBottom:
                  "2px solid var(--resume-accent-border)",
                paddingBottom: 4,
              }}
            >
              Education
            </h3>

            {education.map((edu, i) => (
              <div key={i} className="item">
                <strong>
                  {edu.degree}
                  {edu.institute && `  ${edu.institute}`}
                </strong>

                {(edu.fieldOfStudy || edu.startDate) && (
                  <div className="muted">
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

        {/* ================= CERTIFICATIONS ================= */}
        {certifications.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
              Certifications
            </h3>
            {certifications.map((c, i) => (
              <div key={i}>
                {c.title}
                {c.issuer && `  ${c.issuer}`}
              </div>
            ))}
          </section>
        )}

        {/* ================= AWARDS ================= */}
        {awards.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
              Awards
            </h3>
            {awards.map((a, i) => (
              <div key={i}>
                {a.title}
                {a.issuer && `  ${a.issuer}`}
              </div>
            ))}
          </section>
        )}

        {/* ================= COURSES ================= */}
        {courses.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
              Courses
            </h3>
            {courses.map((c, i) => (
              <div key={i}>
                {c.title}
                {c.provider && `  ${c.provider}`}
              </div>
            ))}
          </section>
        )}

        {/* ================= PUBLICATIONS ================= */}
        {publications.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
              Publications
            </h3>
            {publications.map((p, i) => (
              <div key={i}>
                {p.title}
                {p.publisher && `  ${p.publisher}`}
              </div>
            ))}
          </section>
        )}

        {/* ================= VOLUNTEER ================= */}
        {volunteer.length > 0 && (
          <section>
            <h3 style={{ color: "var(--accent)" }}>
              Volunteer Experience
            </h3>
            {volunteer.map((v, i) => (
              <div key={i}>
                <strong>{v.role}</strong>
                {v.organization && `  ${v.organization}`}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Modern02;

