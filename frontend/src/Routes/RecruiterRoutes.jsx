import React from "react";
import { Routes, Route } from "react-router-dom";

import RecruiterLayout from "../Layouts/RecruiterLayout";

import Dashboard from "../Pages/Recruiter/Dashboard";
import PostJob from "../Pages/Recruiter/PostJob";
import Applicants from "../Pages/Recruiter/Applicants";
import Interviews from "../Pages/Recruiter/Interviews";
import Reports from "../Pages/Recruiter/Reports";
import Notifications from "../Pages/Recruiter/Notifications";
import PostedJobs from "../Pages/Recruiter/PostedJobs";
import ServicesPlans from "../Pages/Recruiter/ServicesPlans";

/*  AI SHORTLISTING PAGE */
import AIShortlisting from "@/Pages/Recruiter/AIShortlisting";

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<Dashboard />} />

        {/* POST JOB */}
        <Route path="post-job" element={<PostJob />} />

        {/* SERVICES & PLANS (PAID GATE) */}
        <Route path="services-plans" element={<ServicesPlans />} />

        {/* POSTED JOB LISTS */}
        <Route path="jobs/:type" element={<PostedJobs />} />

        {/* AI SHORTLISTING (ASSISTED HIRING) */}
        <Route
          path="ai-shortlisting"
          element={<AIShortlisting />}
        />

        {/* PIPELINE */}
        <Route path="applicants" element={<Applicants />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;

