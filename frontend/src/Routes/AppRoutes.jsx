import React from "react";
import { Routes, Route } from "react-router-dom";

/* ================= LAYOUTS ================= */
import PublicLayout from "../Layouts/PublicLayout";
import CandidateLayout from "../Layouts/CandidateLayout";
import RecruiterLayout from "../Layouts/RecruiterLayout";

/* ================= PUBLIC ================= */
import Home from "../Pages/Public/Home";
import Jobs from "../Pages/Public/Jobs";
import Pricing from "../Pages/Public/Pricing";
import Interviews from "../Pages/Public/Interviews";
import LoginCandidate from "../Pages/Public/LoginCandidate";
import LoginRecruiter from "../Pages/Public/LoginRecruiter";
import RegisterCandidate from "../Pages/Public/RegisterCandidate";
import RegisterRecruiter from "../Pages/Public/RegisterRecruiter";
import ForgotPassword from "../Pages/Public/ForgotPassword";

/* ================= COMMON ================= */
import Feedback from "../Pages/Common/Feedback";
import FAQ from "../Pages/Common/FAQ";
import About from "../Pages/Common/About";
import Contact from "../Pages/Common/Contact";

/* ================= CANDIDATE ================= */
import CandidateDashboard from "../Pages/Candidate/Dashboard";
import CandidateJobs from "../Pages/Candidate/Jobs";
import CandidateInterviews from "../Pages/Candidate/Interviews";
import CandidateResume from "../Pages/Candidate/Resume";
import CandidateMockTests from "../Pages/Candidate/MockTests";
import CandidateNotifications from "../Pages/Candidate/Notifications";
import CandidateOffers from "../Pages/Candidate/Offers";
import CandidateUploadResume from "../Pages/Candidate/UploadResume";
import TemplateViewer from "../Pages/Candidate/TemplateViewer";
import ResumeAnalysis from "../Pages/Candidate/ResumeAnalysis";
import CandidatePlans from "../Pages/Candidate/Plans";
import MyResumes from "../Pages/Candidate/MyResumes";

/* ================= RECRUITER ================= */
import RecruiterDashboard from "../Pages/Recruiter/Dashboard";
import RecruiterApplicants from "../Pages/Recruiter/Applicants";
import RecruiterInterviews from "../Pages/Recruiter/Interviews";
import RecruiterNotifications from "../Pages/Recruiter/Notifications";
import RecruiterPostJob from "../Pages/Recruiter/PostJob/PostJob";
import RecruiterReports from "../Pages/Recruiter/Reports";
import RecruiterServicesPlans from "../Pages/Recruiter/ServicesPlans";
import PostedJobs from "../Pages/Recruiter/PostedJobs";

/*  AI SHORTLISTING */
import AIShortlisting from "../Pages/Recruiter/AIShortlisting";

/* ================= ROUTE GUARD ================= */
import ProtectedRoute from "./ProtectedRoute";

/* ================= 404 ================= */
import NotFound from "../Components/Common/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="interviews" element={<Interviews />} />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="/login/candidate" element={<LoginCandidate />} />
      <Route path="/login/recruiter" element={<LoginRecruiter />} />
      <Route path="/register/candidate" element={<RegisterCandidate />} />
      <Route path="/register/recruiter" element={<RegisterRecruiter />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= CANDIDATE (PROTECTED) ================= */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRole="CANDIDATE">
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<CandidateDashboard />} />

        {/* Core */}
        <Route path="jobs" element={<CandidateJobs />} />
        <Route path="interviews" element={<CandidateInterviews />} />
        <Route path="notifications" element={<CandidateNotifications />} />
        <Route path="offers" element={<CandidateOffers />} />
        <Route path="plans" element={<CandidatePlans />} />
        <Route path="mock-tests" element={<CandidateMockTests />} />

        {/* ================= RESUME SYSTEM (PRODUCTION STRUCTURE) ================= */}
        
        {/* Resume Builder (Main) */}
        <Route path="resume" element={<CandidateResume />} />

        {/*  Saved Resumes Page (PRIMARY) */}
        <Route path="resumes" element={<MyResumes />} />

        {/*  Alias route (for navbar safety) */}
        <Route path="my-resumes" element={<MyResumes />} />

        {/* Resume Analysis */}
        <Route path="resume/analysis" element={<ResumeAnalysis />} />

        {/* Templates Viewer */}
        <Route
          path="resume/templates/:templateId"
          element={<TemplateViewer />}
        />

        {/* Upload Resume */}
        <Route path="upload-resume" element={<CandidateUploadResume />} />
      </Route>

      {/* ================= RECRUITER (PROTECTED) ================= */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRole="RECRUITER">
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
        <Route path="post-job" element={<RecruiterPostJob />} />
        <Route path="jobs/:type" element={<PostedJobs />} />
        <Route path="applicants" element={<RecruiterApplicants />} />
        <Route path="interviews" element={<RecruiterInterviews />} />
        <Route path="notifications" element={<RecruiterNotifications />} />
        <Route path="reports" element={<RecruiterReports />} />

        {/*  AI SHORTLISTING */}
        <Route path="ai-shortlisting" element={<AIShortlisting />} />

        {/* Plans */}
        <Route
          path="services-plans"
          element={<RecruiterServicesPlans />}
        />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
