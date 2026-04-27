import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";
import PreviewRenderer from "../ResumePreview/PreviewRenderer";
import AutoScalePreview from "../ResumePreview/AutoScalePreview";
import ResumePaper from "../ResumePreview/ResumePaper";
import prepareResumeForPreview from "../../utils/prepareResumeForPreview";
import { TEMPLATE_LIST } from "../../Pages/Candidate/ResumeBuilder/templates";
import "../../Styles/resumeTemplatesSection.css";

const ResumeTemplatesSection = ({ onSelectTemplate }) => {
  const navigate = useNavigate();
  const { resume, setResume } = useResume();
  const [showAll, setShowAll] = useState(false);
  const previewResume = useMemo(
    () => prepareResumeForPreview(resume),
    [resume]
  );

  const visibleTemplates = useMemo(
    () => (showAll ? TEMPLATE_LIST : TEMPLATE_LIST.slice(0, 6)),
    [showAll]
  );

  const handleTemplateSelect = (templateId) => {
    setResume((previous) => ({
      ...previous,
      meta: {
        ...(previous.meta || {}),
        targetTemplate: templateId,
      },
    }));

    onSelectTemplate?.(templateId);
  };

  return (
    <div className="resume-templates">
      <h3>Select a Resume Template</h3>

      <div className="template-grid">
        {visibleTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <AutoScalePreview containerHeight={420}>
              <ResumePaper mode="preview">
                <PreviewRenderer
                  resumeOverride={{
                    ...previewResume,
                    meta: {
                      ...(previewResume.meta || {}),
                      targetTemplate: template.id,
                    },
                  }}
                  mode="preview"
                />
              </ResumePaper>
            </AutoScalePreview>

            <div className="template-footer">
              <span>{template.label}</span>

              <div className="template-actions">
                <button
                  className="btn-outline"
                  onClick={() =>
                    navigate(`/candidate/resume/templates/${template.id}`, {
                    })
                  }
                  type="button"
                >
                  View
                </button>

                <button
                  className="btn-outline"
                  onClick={() => handleTemplateSelect(template.id)}
                  type="button"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}

        {!showAll ? (
          <button className="template-card explore-more-card" onClick={() => setShowAll(true)} type="button">
            <div className="explore-more-content">
              <h4>Explore more templates</h4>
              <p>View all resume designs</p>
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ResumeTemplatesSection;
