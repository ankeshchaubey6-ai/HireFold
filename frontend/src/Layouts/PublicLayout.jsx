import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../Components/Navbars/PublicNavbar";
import RoleFooter from "../Components/Footers/RoleFooter";

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />

      {/* CONTENT WRAPPER  APPLIES TO ALL PUBLIC PAGES */}
      <main className="content-area page-reveal page-enter">
        <Outlet />
      </main>

      <RoleFooter />
    </>
  );
};

export default memo(PublicLayout);

