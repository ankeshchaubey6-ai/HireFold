import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/ats03.css";

const ATS03 = ({ resume }) => {
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
    <div className="ats03">
      {/* ================= HEADER ================= */}
      <header>
        <h1>{fullName}</h1>
        {label && <h2>{label}</h2>}

        <p className="contact">
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section>
          <h3>Professional Summary</h3>
          <p>{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills.length > 0 && (
        <section>
          <h3>Skills</h3>
          <p>
            {skills[0]?.items?.map((s) => s.name).join(", ")}
          </p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section>
          <h3>Experience</h3>

          {experience.map((exp, i) => (
            <div key={i} className="item">
              <strong>
                {exp.role}  {exp.company}
              </strong>

              <div className="meta">
                {exp.location}
                {exp.startDate && (
                  <>
                    {" | "}
                    {exp.startDate} {" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate}
                  </>
                )}
              </div>

              {exp.achievements?.length > 0 && (
                <ul>
                  {exp.achievements.map(
                    (a, idx) => a && <li key={idx}>{a}</li>
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
          <h3>Projects</h3>

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
          <h3>Education</h3>

          {education.map((edu, i) => (
            <div key={i} className="item">
              <strong>
                {edu.degree}  {edu.institute}
              </strong>
              <div className="meta">
                {edu.fieldOfStudy}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications.length > 0 && (
        <section>
          <h3>Certifications</h3>
          <ul>
            {certifications.map(
              (c, i) =>
                c.title && (
                  <li key={i}>
                    {c.title}  {c.issuer}
                  </li>
                )
            )}
          </ul>
        </section>
      )}

      {/* ================= AWARDS ================= */}
      {awards.length > 0 && (
        <section>
          <h3>Awards</h3>
          <ul>
            {awards.map(
              (a, i) =>
                a.title && <li key={i}>{a.title}</li>
            )}
          </ul>
        </section>
      )}

      {/* ================= LANGUAGES ================= */}
      {languages.length > 0 && (
        <section>
          <h3>Languages</h3>
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

export default ATS03;

