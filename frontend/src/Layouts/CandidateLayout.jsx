import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import CandidateNavbar from "../Components/Navbars/CandidateNavbar";
import RoleFooter from "../Components/Footers/RoleFooter";

const CandidateLayout = () => {
  return (
    <>
      <CandidateNavbar />

      <main className="content-area page-reveal page-enter">
        <Outlet />
      </main>

      <RoleFooter />
    </>
  );
};

export default memo(CandidateLayout);
