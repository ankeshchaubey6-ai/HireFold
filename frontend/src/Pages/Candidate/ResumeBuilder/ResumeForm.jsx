import React, { useRef, useState } from "react";

import { useResume } from "../../../Context/ResumeContext";

import "../../../Styles/resumeForm.css";
import "../../../Styles/sectionSurface.css";

/* =========================================================
   FULL RESUME FORM - STEP WIZARD (PRODUCTION SAFE)
   - ALL ORIGINAL SECTIONS PRESERVED
   - NO SAVE & EXIT
   - NO STEP HEADER TEXT
   - TEMPLATE + COLOR PICKER ON TOP
   - NEXT / BACK FLOW (LIKE MODERN BUILDERS)
========================================================= */

const ResumeForm = () => {
  const {
    resume,
    setResume,
    setSkillsFromText,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  } = useResume();

  /* ======================================================
     SAFE META DEFAULT (PREVENTS CRASHES)
  ====================================================== */
  const safeResume = {
    ...resume,
    meta: {
      targetTemplate: "Modern01",
      accentColor: "#0ea5e9",
      ...resume.meta,
    },
  };

  /* ======================================================
     STEP WIZARD STATE (NEW UX)
  ====================================================== */
  const [step, setStep] = useState(0);

  const totalSteps = 13;

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ======================================================
     PROFILE PHOTO UPLOAD (ORIGINAL LOGIC PRESERVED)
  ====================================================== */
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResume((prev) => ({
        ...prev,
        basics: {
          ...prev.basics,
          photo: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="resume-form">

      {/* ======================================================
   COMPACT RESUME DESIGN BAR (SMALL  HORIZONTAL)
   ====================================================== */}
<div
  className="section-surface"
  style={{
    padding: "12px 16px",
    marginBottom: 16,
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
    }}
  >
    {/* LEFT: LABEL */}
    <div style={{ fontWeight: 600, fontSize: 14 }}>
      Resume Design
    </div>

    {/* RIGHT: CONTROLS (HORIZONTAL SMALL) */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {/* TEMPLATE DROPDOWN (SMALL) */}
      <select
        value={safeResume.meta.targetTemplate}
        onChange={(e) =>
          setResume((prev) => ({
            ...prev,
            meta: {
              ...prev.meta,
              targetTemplate: e.target.value,
            },
          }))
        }
        style={{
          padding: "6px 10px",
          fontSize: 13,
          borderRadius: 8,
          minWidth: 140,
        }}
      >
        <option value="Modern01">Modern 01</option>
        <option value="Modern02">Modern 02</option>
        <option value="Modern03">Modern 03</option>
        <option value="Modern04">Modern 04</option>

        <option value="Minimal01">Minimal 01</option>
        <option value="Minimal02">Minimal 02</option>
        <option value="Minimal03">Minimal 03</option>

        <option value="ATS01">ATS 01</option>
        <option value="ATS02">ATS 02</option>
        <option value="ATS03">ATS 03</option>

        <option value="Creative01">Creative 01</option>
        <option value="Creative02">Creative 02</option>

        <option value="Executive01">Executive 01</option>
        <option value="Executive02">Executive 02</option>

        <option value="Simple01">Simple 01</option>
        <option value="Simple02">Simple 02</option>
        <option value="Simple03">Simple 03</option>
        <option value="Simple04">Simple 04</option>
      </select>

      {/* COLOR PICKER DOTS (HORIZONTAL) */}
     {/* COLOR PICKER + PRESET COLORS (UNLIMITED) */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
  }}
>
  {/* QUICK PRESET COLORS (FAST CLICK) */}
  {[
    "#2563EB", // Blue
    "#10B981", // Green
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#F59E0B", // Amber
    "#0EA5E9", // Cyan
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ].map((color) => (
    <div
      key={color}
      onClick={() =>
        setResume((prev) => ({
          ...prev,
          meta: {
            ...prev.meta,
            accentColor: color,
          },
        }))
      }
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: color,
        cursor: "pointer",
        
         border:
  (resume?.meta?.accentColor || "#0ea5e9") === color
    ? "2px solid #111"
    : "2px solid #E5E7EB",

        transition: "all 0.15s ease",
      }}
      title={color}
    />
  ))}

  {/* DIVIDER */}
  <div
    style={{
      width: 1,
      height: 18,
      background: "#E5E7EB",
      margin: "0 4px",
    }}
  />

  {/* FULL COLOR PICKER (UNLIMITED COLORS) */}
  <input
  type="color"
  value={
    resume?.meta?.accentColor || "#0ea5e9"
  }
  onChange={(e) =>
    setResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        accentColor: e.target.value,
      },
    }))
  }

    style={{
      width: 28,
      height: 28,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 0,
    }}
    title="Pick any color"
  />
</div>

    </div>
  </div>
</div>

      {/* ======================================================
         STEP 0  PROFILE (ORIGINAL SECTION, ENHANCED UI)
      ====================================================== */}
      {step === 0 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Profile</h3>
              <p>Basic personal & contact information</p>
            </div>

            {/* PHOTO */}
            <div className="photo-upload">
              <label className="photo-label">
                Profile Photo <span>(optional)</span>
              </label>

              <div
                className="photo-upload-box"
                onClick={() => fileInputRef.current.click()}
              >
                {resume.basics.photo ? (
                  <img
                    src={resume.basics.photo}
                    alt="Profile"
                    className="photo-preview"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <span className="photo-icon"></span>
                    <span>Upload photo</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />

              <p className="photo-hint">
                JPG / PNG  Max 2MB  Square image recommended
              </p>
            </div>

            {/* BASIC DETAILS */}
            <div className="form-grid">
              <input
                placeholder="Full Name"
                value={resume.basics.fullName}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      fullName: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Preferred Name"
                value={resume.basics.preferredName}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      preferredName: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Job Title / Role"
                value={resume.basics.label}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      label: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Email"
                value={resume.basics.email}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      email: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Phone"
                value={resume.basics.phone}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      phone: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Location"
                value={resume.basics.address}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      address: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="LinkedIn"
                value={resume.basics.linkedin}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      linkedin: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="GitHub"
                value={resume.basics.github}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      github: e.target.value,
                    },
                  }))
                }
              />
              <input
                placeholder="Portfolio / Website"
                value={resume.basics.portfolio}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    basics: {
                      ...prev.basics,
                      portfolio: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </section>
      )}
      {/* ======================================================
         STEP 1  SUMMARY (BIGGER TEXT AREA)
      ====================================================== */}
      {step === 1 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Professional Summary</h3>
              <p>ATS-friendly impactful summary</p>
            </div>

            <textarea
              rows={6}
              placeholder="Write a strong 24 line professional summary..."
              value={resume.summary}
              onChange={(e) =>
                setResume((prev) => ({
                  ...prev,
                  summary: e.target.value,
                }))
              }
              style={{ fontSize: 16, padding: 16 }}
            />
          </div>
        </section>
      )}

      {/* ======================================================
         STEP 2  SKILLS (ENHANCED UI)
      ====================================================== */}
      {step === 2 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Skills</h3>
              <p>Comma separated skills (ATS optimized)</p>
            </div>

            <textarea
              rows={5}
              placeholder="React, JavaScript, Node.js, SQL, Machine Learning"
              value={
                resume.skills?.[0]?.items
                  ?.map((s) => s.name)
                  .join(", ") || ""
              }
              onChange={(e) => setSkillsFromText(e.target.value)}
              style={{ fontSize: 16, padding: 16 }}
            />
          </div>
        </section>
      )}
      {/* ======================================================
         STEP 3  WORK EXPERIENCE (ORIGINAL LOGIC 100% PRESERVED)
      ====================================================== */}
      {step === 3 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Work Experience</h3>
              <p>Add your professional experience</p>
            </div>

            {resume.experience.map((exp, i) => (
              <div key={i} className="repeat-block">
                <span className="repeat-title">
                  Experience {i + 1}
                </span>

                <input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateArrayItem(
                      "experience",
                      i,
                      "company",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) =>
                    updateArrayItem(
                      "experience",
                      i,
                      "role",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) =>
                    updateArrayItem(
                      "experience",
                      i,
                      "location",
                      e.target.value
                    )
                  }
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <input
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        i,
                        "startDate",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateArrayItem(
                        "experience",
                        i,
                        "endDate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Achievements (comma separated)"
                  value={exp.achievements?.join(", ") || ""}
                  onChange={(e) =>
                    updateArrayItem(
                      "experience",
                      i,
                      "achievements",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                    )
                  }
                  style={{ fontSize: 15, padding: 14 }}
                />

                <button
                  className="btn-outline"
                  onClick={() =>
                    removeArrayItem("experience", i)
                  }
                >
                  Remove Experience
                </button>
              </div>
            ))}

            <button
              className="btn-outline"
              onClick={() =>
                addArrayItem("experience", {
                  company: "",
                  role: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  achievements: [],
                  techStack: [],
                })
              }
            >
              + Add Work Experience
            </button>
          </div>
        </section>
      )}
      {/* ======================================================
         STEP 4  EDUCATION (ORIGINAL STRUCTURE)
      ====================================================== */}
      {step === 4 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Education</h3>
              <p>Your academic background</p>
            </div>

            {resume.education.map((edu, i) => (
              <div key={i} className="repeat-block">
                <span className="repeat-title">
                  Education {i + 1}
                </span>

                <input
                  placeholder="Institute"
                  value={edu.institute}
                  onChange={(e) =>
                    updateArrayItem(
                      "education",
                      i,
                      "institute",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateArrayItem(
                      "education",
                      i,
                      "degree",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    updateArrayItem(
                      "education",
                      i,
                      "fieldOfStudy",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Grade / CGPA"
                  value={edu.grade}
                  onChange={(e) =>
                    updateArrayItem(
                      "education",
                      i,
                      "grade",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    removeArrayItem("education", i)
                  }
                >
                  Remove Education
                </button>
              </div>
            ))}

            <button
              className="btn-outline"
              onClick={() =>
                addArrayItem("education", {
                  institute: "",
                  degree: "",
                  fieldOfStudy: "",
                  grade: "",
                })
              }
            >
              + Add Education
            </button>
          </div>
        </section>
      )}

      {/* ======================================================
         STEP 5  PROJECTS (ORIGINAL STRUCTURE)
      ====================================================== */}
      {step === 5 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Projects</h3>
              <p>Showcase your best work</p>
            </div>

            {resume.projects.map((proj, i) => (
              <div key={i} className="repeat-block">
                <span className="repeat-title">
                  Project {i + 1}
                </span>

                <input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) =>
                    updateArrayItem(
                      "projects",
                      i,
                      "title",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="GitHub / Live URL"
                  value={proj.url}
                  onChange={(e) =>
                    updateArrayItem(
                      "projects",
                      i,
                      "url",
                      e.target.value
                    )
                  }
                />

                <textarea
                  rows={4}
                  placeholder="Project Description"
                  value={proj.description}
                  onChange={(e) =>
                    updateArrayItem(
                      "projects",
                      i,
                      "description",
                      e.target.value
                    )
                  }
                  style={{ fontSize: 15, padding: 14 }}
                />

                <button
                  className="btn-outline"
                  onClick={() =>
                    removeArrayItem("projects", i)
                  }
                >
                  Remove Project
                </button>
              </div>
            ))}

            <button
              className="btn-outline"
              onClick={() =>
                addArrayItem("projects", {
                  title: "",
                  description: "",
                  url: "",
                  techStack: [],
                })
              }
            >
              + Add Project
            </button>
          </div>
        </section>
      )}
      {/* ======================================================
         STEP 6  CERTIFICATIONS (ORIGINAL)
      ====================================================== */}
      {step === 6 && (
        <section className="section-surface">
          <div className="form-section">
            <div className="form-section-header">
              <h3>Certifications</h3>
              <p>Professional certifications</p>
            </div>

            {resume.certifications.map((cert, i) => (
              <div key={i} className="repeat-block">
                <span className="repeat-title">
                  Certification {i + 1}
                </span>

                <input
                  placeholder="Certification Title"
                  value={cert.title}
                  onChange={(e) =>
                    updateArrayItem(
                      "certifications",
                      i,
                      "title",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Issuer"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateArrayItem(
                      "certifications",
                      i,
                      "issuer",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Issue Date"
                  value={cert.issueDate}
                  onChange={(e) =>
                    updateArrayItem(
                      "certifications",
                      i,
                      "issueDate",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Credential URL"
                  value={cert.credentialUrl}
                  onChange={(e) =>
                    updateArrayItem(
                      "certifications",
                      i,
                      "credentialUrl",
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn-outline"
                  onClick={() =>
                    removeArrayItem("certifications", i)
                  }
                >
                  Remove Certification
                </button>
              </div>
            ))}

            <button
              className="btn-outline"
              onClick={() =>
                addArrayItem("certifications", {
                  title: "",
                  issuer: "",
                  issueDate: "",
                  credentialUrl: "",
                })
              }
            >
              + Add Certification
            </button>
          </div>
        </section>
      )}

      {/* ======================================================
         STEP 7  ACHIEVEMENTS + COURSES + PUBLICATIONS
      ====================================================== */}
      {step === 7 && (
        <>
          {/* AWARDS */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>Awards & Achievements</h3>
              </div>

              {resume.awards.map((award, i) => (
                <div key={i} className="repeat-block">
                  <span className="repeat-title">
                    Award {i + 1}
                  </span>

                  <input
                    placeholder="Award Title"
                    value={award.title}
                    onChange={(e) =>
                      updateArrayItem(
                        "awards",
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Issuer"
                    value={award.issuer}
                    onChange={(e) =>
                      updateArrayItem(
                        "awards",
                        i,
                        "issuer",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    placeholder="Description"
                    value={award.description}
                    onChange={(e) =>
                      updateArrayItem(
                        "awards",
                        i,
                        "description",
                        e.target.value
                      )
                    }
                    style={{ fontSize: 15, padding: 14 }}
                  />

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removeArrayItem("awards", i)
                    }
                  >
                    Remove Award
                  </button>
                </div>
              ))}

              <button
                className="btn-outline"
                onClick={() =>
                  addArrayItem("awards", {
                    title: "",
                    issuer: "",
                    description: "",
                  })
                }
              >
                + Add Award
              </button>
            </div>
          </section>

          {/* COURSES */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>Courses</h3>
              </div>

              {resume.courses.map((course, i) => (
                <div key={i} className="repeat-block">
                  <span className="repeat-title">
                    Course {i + 1}
                  </span>

                  <input
                    placeholder="Course Title"
                    value={course.title}
                    onChange={(e) =>
                      updateArrayItem(
                        "courses",
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Provider"
                    value={course.provider}
                    onChange={(e) =>
                      updateArrayItem(
                        "courses",
                        i,
                        "provider",
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removeArrayItem("courses", i)
                    }
                  >
                    Remove Course
                  </button>
                </div>
              ))}

              <button
                className="btn-outline"
                onClick={() =>
                  addArrayItem("courses", {
                    title: "",
                    provider: "",
                  })
                }
              >
                + Add Course
              </button>
            </div>
          </section>

          {/* PUBLICATIONS */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>Publications</h3>
              </div>

              {resume.publications.map((pub, i) => (
                <div key={i} className="repeat-block">
                  <span className="repeat-title">
                    Publication {i + 1}
                  </span>

                  <input
                    placeholder="Title"
                    value={pub.title}
                    onChange={(e) =>
                      updateArrayItem(
                        "publications",
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Publisher"
                    value={pub.publisher}
                    onChange={(e) =>
                      updateArrayItem(
                        "publications",
                        i,
                        "publisher",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="URL"
                    value={pub.url}
                    onChange={(e) =>
                      updateArrayItem(
                        "publications",
                        i,
                        "url",
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removeArrayItem("publications", i)
                    }
                  >
                    Remove Publication
                  </button>
                </div>
              ))}

              <button
                className="btn-outline"
                onClick={() =>
                  addArrayItem("publications", {
                    title: "",
                    publisher: "",
                    url: "",
                  })
                }
              >
                + Add Publication
              </button>
            </div>
          </section>
        </>
      )}

      {/* ======================================================
         STEP 8  LANGUAGES + REFERENCES + ATTACHMENTS
      ====================================================== */}
      {step === 8 && (
        <>
          {/* LANGUAGES */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>Languages</h3>
              </div>

              {resume.languages.map((lang, i) => (
                <div key={i} className="repeat-block">
                  <span className="repeat-title">
                    Language {i + 1}
                  </span>

                  <input
                    placeholder="Language"
                    value={lang.name}
                    onChange={(e) =>
                      updateArrayItem(
                        "languages",
                        i,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Proficiency"
                    value={lang.level}
                    onChange={(e) =>
                      updateArrayItem(
                        "languages",
                        i,
                        "level",
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removeArrayItem("languages", i)
                    }
                  >
                    Remove Language
                  </button>
                </div>
              ))}

              <button
                className="btn-outline"
                onClick={() =>
                  addArrayItem("languages", {
                    name: "",
                    level: "",
                  })
                }
              >
                + Add Language
              </button>
            </div>
          </section>

          {/* REFERENCES */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>References</h3>
                <p>Optional</p>
              </div>

              {resume.references.map((ref, i) => (
                <div key={i} className="repeat-block">
                  <span className="repeat-title">
                    Reference {i + 1}
                  </span>

                  <input
                    placeholder="Name"
                    value={ref.name}
                    onChange={(e) =>
                      updateArrayItem(
                        "references",
                        i,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Role"
                    value={ref.role}
                    onChange={(e) =>
                      updateArrayItem(
                        "references",
                        i,
                        "role",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Company"
                    value={ref.company}
                    onChange={(e) =>
                      updateArrayItem(
                        "references",
                        i,
                        "company",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Email / Phone"
                    value={ref.email}
                    onChange={(e) =>
                      updateArrayItem(
                        "references",
                        i,
                        "email",
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removeArrayItem("references", i)
                    }
                  >
                    Remove Reference
                  </button>
                </div>
              ))}

              <button
                className="btn-outline"
                onClick={() =>
                  addArrayItem("references", {
                    name: "",
                    role: "",
                    company: "",
                    email: "",
                    phone: "",
                  })
                }
              >
                + Add Reference
              </button>
            </div>
          </section>

          {/* ATTACHMENTS */}
          <section className="section-surface">
            <div className="form-section">
              <div className="form-section-header">
                <h3>Attachments</h3>
                <p>Supporting documents (PDF, images)</p>
              </div>

              <input
                type="file"
                onChange={(e) =>
                  addArrayItem("attachments", {
                    name: e.target.files[0]?.name,
                    type: e.target.files[0]?.type,
                    size: e.target.files[0]?.size,
                  })
                }
              />
            </div>
          </section>
        </>
      )}

      {/* ======================================================
         NAVIGATION BUTTONS (NO SAVE & EXIT  AS YOU REQUESTED)
      ====================================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <button
          className="btn-outline"
          onClick={prevStep}
          disabled={step === 0}
        >
           Back
        </button>

        <button
          className="btn-primary hf-premium"
          onClick={nextStep}
          disabled={step === totalSteps - 1}
        >
          {step === totalSteps - 1 ? "Completed" : "Next "}
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
