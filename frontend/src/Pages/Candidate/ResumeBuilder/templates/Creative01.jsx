import "../../../../Styles/templates/baseResume.css";
import "../../../../Styles/templates/creative01.css";

const Creative01 = ({ resume, accentColor = "#be185d" }) => {
  if (!resume) {
    return null;
  }

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
    photo = null,
    email = "",
    phone = "",
    address = "",
    linkedin = "",
    github = "",
    portfolio = "",
  } = basics;

  return (
    <div
      className="resume-root creative01"
      style={{
        "--resume-accent": accentColor,
        "--resume-accent-soft": `${accentColor}22`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      <aside
        className="creative01-left"
        style={{
          background: "var(--resume-accent-soft)",
          borderRight: "2px solid var(--resume-accent-border)",
        }}
      >
        <div className="creative01-profile">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="creative01-photo"
              style={{ border: "3px solid var(--resume-accent)" }}
            />
          ) : null}

          <h1 style={{ color: "var(--resume-accent)" }}>{fullName}</h1>
          {label ? <h2 style={{ color: "var(--resume-accent)" }}>{label}</h2> : null}
        </div>

        <section>
          <h3 style={{ color: "var(--resume-accent)" }}>Contact</h3>
          {[email, phone, address, linkedin, github, portfolio]
            .filter(Boolean)
            .map((value) => (
              <p key={value}>{value}</p>
            ))}
        </section>

        {skills.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Skills</h3>
            <ul>
              {skills.flatMap((group) =>
                (group.items || []).map((item) =>
                  item?.name ? <li key={`${group.category || "skills"}-${item.name}`}>{item.name}</li> : null
                )
              )}
            </ul>
          </section>
        ) : null}

        {languages.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Languages</h3>
            <ul>
              {languages.map((language) =>
                language?.name ? (
                  <li key={language.name}>
                    {language.name}
                    {language.level ? ` (${language.level})` : ""}
                  </li>
                ) : null
              )}
            </ul>
          </section>
        ) : null}
      </aside>

      <main className="creative01-right">
        {summary ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Profile</h3>
            <p>{summary}</p>
          </section>
        ) : null}

        {experience.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Experience</h3>
            {experience.map((item, index) => (
              <div key={`${item.company || "experience"}-${index}`} className="creative01-item">
                <strong style={{ color: "var(--resume-accent)" }}>
                  {item.role}
                  {item.company ? ` | ${item.company}` : ""}
                </strong>
                <div className="creative01-muted">
                  {item.location}
                  {item.startDate ? ` | ${item.startDate} - ${item.currentlyWorking ? "Present" : item.endDate || ""}` : ""}
                </div>
                {item.achievements?.length ? (
                  <ul>
                    {item.achievements.map((achievement) =>
                      achievement ? <li key={achievement}>{achievement}</li> : null
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {projects.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Projects</h3>
            {projects.map((project, index) => (
              <div key={`${project.title || "project"}-${index}`} className="creative01-item">
                <strong style={{ color: "var(--resume-accent)" }}>{project.title}</strong>
                {project.description ? <p>{project.description}</p> : null}
              </div>
            ))}
          </section>
        ) : null}

        {education.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Education</h3>
            {education.map((item, index) => (
              <div key={`${item.institute || "education"}-${index}`} className="creative01-item">
                <strong style={{ color: "var(--resume-accent)" }}>
                  {item.degree}
                  {item.institute ? ` | ${item.institute}` : ""}
                </strong>
                {item.fieldOfStudy ? <div className="creative01-muted">{item.fieldOfStudy}</div> : null}
              </div>
            ))}
          </section>
        ) : null}

        {certifications.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Certifications</h3>
            {certifications.map((item, index) => (
              <p key={`${item.title || "certification"}-${index}`}>
                {item.title}
                {item.issuer ? ` | ${item.issuer}` : ""}
              </p>
            ))}
          </section>
        ) : null}

        {awards.length ? (
          <section>
            <h3 style={{ color: "var(--resume-accent)" }}>Awards</h3>
            {awards.map((item, index) => (
              <p key={`${item.title || "award"}-${index}`}>
                {item.title}
                {item.issuer ? ` | ${item.issuer}` : ""}
              </p>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default Creative01;
