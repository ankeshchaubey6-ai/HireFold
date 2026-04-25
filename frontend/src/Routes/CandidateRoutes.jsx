import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../Pages/Candidate/Dashboard";
import Jobs from "../Pages/Candidate/Jobs";
import Resume from "../Pages/Candidate/Resume";
import ResumeAnalysis from "../Pages/Candidate/ResumeAnalysis";
import Interviews from "../Pages/Candidate/Interviews";
import Offers from "../Pages/Candidate/Offers";
import Notifications from "../Pages/Candidate/Notifications";
import TemplateViewer from "../Pages/Candidate/TemplateViewer";

/*  NEW PAGE (WE WILL CREATE NEXT) */
import SavedResumes from "../Pages/Candidate/SavedResumes";

const CandidateRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />

      <Route path="jobs" element={<Jobs />} />

      {/* ===== RESUME SYSTEM ===== */}
      <Route path="resume" element={<Resume />} />
      <Route path="resumes" element={<SavedResumes />} /> {/*  NEW */}
      <Route
        path="resume/templates/:templateId"
        element={<TemplateViewer />}
      />
      <Route
        path="resume/analysis"
        element={<ResumeAnalysis />}
      />

      <Route path="interviews" element={<Interviews />} />
      <Route path="offers" element={<Offers />} />
      <Route path="notifications" element={<Notifications />} />
    </Routes>
  );
};

export default CandidateRoutes;
