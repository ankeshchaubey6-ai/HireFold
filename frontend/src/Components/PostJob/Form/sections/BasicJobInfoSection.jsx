import { useRef } from "react";
import { useJob } from "../../../../Context/JobContext";

const BasicJobInfoSection = () => {
  const { job, updateSection } = useJob();
  const fileInputRef = useRef(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation (production safe)
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG)");
      return;
    }

    // Convert image to Base64 so it persists after publish & refresh
    const reader = new FileReader();

    reader.onloadend = () => {
      updateSection("basics", {
        companyLogoFile: file, // For future backend upload
        companyLogoPreview: reader.result, // Persistent Base64 string
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="section-surface">
      <div className="form-section">
        <div className="form-section-header">
          <h3>Basic Job Information</h3>
        </div>

        {/* INPUT GRID */}
        <div className="form-grid">
          {/* Job Title */}
          <input
            placeholder="Job Title"
            value={job.basics.title}
            onChange={(e) =>
              updateSection("basics", { title: e.target.value })
            }
          />

          {/* Employment Type */}
          <select
            value={job.basics.employmentType}
            onChange={(e) =>
              updateSection("basics", {
                employmentType: e.target.value,
              })
            }
          >
            <option value="">Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          {/* Department */}
          <input
            placeholder="Department"
            value={job.basics.department}
            onChange={(e) =>
              updateSection("basics", { department: e.target.value })
            }
          />

          {/* Experience Level */}
          <select
            value={job.basics.experienceLevel}
            onChange={(e) =>
              updateSection("basics", {
                experienceLevel: e.target.value,
              })
            }
          >
            <option value="">Experience Level</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
            <option value="Lead">Lead / Manager</option>
          </select>

          {/* Location */}
          <input
            placeholder="Location"
            value={job.basics.location}
            onChange={(e) =>
              updateSection("basics", { location: e.target.value })
            }
          />
        </div>

        {/* WORK MODE + COMPANY NAME + COMPANY LOGO (SAME ROW) */}
        <div className="form-subsection workmode-logo-row">
          {/* LEFT: Work Mode */}
          <div className="workmode-block">
            <label className="form-label">Work Mode</label>
            <div className="workmode-toggle">
              {["Onsite", "Hybrid", "Remote"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`toggle-btn ${
                    job.basics.workMode === mode ? "active" : ""
                  }`}
                  onClick={() =>
                    updateSection("basics", { workMode: mode })
                  }
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE: Company Name */}
          <div className="company-name-block">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              value={job.basics.companyName || ""}
              onChange={(e) =>
                updateSection("basics", {
                  companyName: e.target.value,
                })
              }
              className="company-name-input"
            />
          </div>

          {/* RIGHT: Company Logo Upload */}
          <div className="company-logo-block">
            <label className="form-label">Company Logo</label>

            <div className="company-logo-upload-inline">
              {/* Preview (non-clickable) */}
              <div className="logo-preview-inline">
                {job.basics.companyLogoPreview ? (
                  <img
                    src={job.basics.companyLogoPreview}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span>No Logo</span>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                className="upload-logo-btn"
                onClick={handleLogoClick}
              >
                Upload Logo
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicJobInfoSection;
