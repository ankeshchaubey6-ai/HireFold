import { useLocation } from "react-router-dom";
import Footer from "./Footer";

const RoleFooter = () => {
  const { pathname } = useLocation();

  let role = "public";

  if (pathname.startsWith("/candidate")) {
    role = "candidate";
  } else if (pathname.startsWith("/recruiter")) {
    role = "recruiter";
  }

  return (
    <footer className="app-footer">
      <Footer role={role} />
    </footer>
  );
};

export default RoleFooter;
