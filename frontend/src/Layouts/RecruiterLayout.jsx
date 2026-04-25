import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import RecruiterNavbar from "../Components/Navbars/RecruiterNavbar";
import RoleFooter from "../Components/Footers/RoleFooter";
import { JobProvider } from "../Context/JobContext";

const RecruiterLayout = () => {
  return (
    <JobProvider>
      <RecruiterNavbar />

      <main className="content-area page-reveal page-enter">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>

      <RoleFooter />
    </JobProvider>
  );
};

export default memo(RecruiterLayout);
