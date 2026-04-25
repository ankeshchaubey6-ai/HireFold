import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import PublicNavbar from "../Components/Navbars/PublicNavbar";
import RoleFooter from "../Components/Footers/RoleFooter";

import Home from "../Pages/Public/Home";
import Jobs from "../Pages/Public/Jobs";
import Pricing from "../Pages/Public/Pricing";

import LoginCandidate from "../Pages/Public/LoginCandidate";
import LoginRecruiter from "../Pages/Public/LoginRecruiter";
import RegisterCandidate from "../Pages/Public/RegisterCandidate";
import RegisterRecruiter from "../Pages/Public/RegisterRecruiter";

// Layout ONLY for normal public pages
const PublicLayout = () => (
  <>
    <PublicNavbar />
    <Outlet />
    <RoleFooter />
  </>
);

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Pages WITH navbar & footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>

      {/* Auth pages WITHOUT navbar & footer */}
      <Route path="/login/candidate" element={<LoginCandidate />} />
      <Route path="/login/recruiter" element={<LoginRecruiter />} />
      <Route path="/register/candidate" element={<RegisterCandidate />} />
      <Route path="/register/recruiter" element={<RegisterRecruiter />} />
    </Routes>
  );
};

export default PublicRoutes;
