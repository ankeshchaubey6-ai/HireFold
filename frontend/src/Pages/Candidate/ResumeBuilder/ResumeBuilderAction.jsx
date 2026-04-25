import React, { useState } from "react";
import { useResume } from "../../Context/ResumeContext";
import { useAuth } from "../../Context/AuthContext";
import { ResumeStorageService } from "../../services/resumeStorage.service";
import Button from "../Common/Button";

import "../../Styles/resumeActions.css";

export default function ResumeBuilderActions() {
  const { resume } = useResume(); //  FIXED (was resumeData)
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!user?.id) {
      alert("Please login to save your resume");
      return;
    }

    try {
      setSaving(true);

      const resumeId =
        resume?.meta?.resumeId ||
        `resume-${user.id}-${Date.now()}`;

      await ResumeStorageService.saveResume({
        resumeId,
        userId: user.id,
        title: resume?.basics?.fullName || "My Resume",
        source: "builder",
        structuredData: resume,
        isDraft: true,
      });

      alert("Resume saved successfully");
    } catch (err) {
      
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="resume-builder-actions">
      <Button onClick={handleSave} variant="primary">
        {saving ? "Saving..." : "Save Resume"}
      </Button>

      <Button variant="outline">
        Download PDF
      </Button>
    </div>
  );
}

