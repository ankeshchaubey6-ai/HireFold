import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import { RoleProvider } from "./Context/RoleContext";
import { ResumeProvider } from "./Context/ResumeContext";
import { JobsFeedProvider } from "./Context/JobsFeedContext";
import { ApplicationsProvider } from "./Context/ApplicationsContext";
import { InterviewsProvider } from "@/Pages/Recruiter/Interviews/InterviewsContext";
import { NotificationsProvider } from "@/Context/NotificationsContext";
/* ================= GLOBAL STYLES ================= */
import "./Styles/global.css";
import "./Styles/theme.css";
import "./Styles/variables.css";
import "./Styles/animations.css";
import "./Styles/banner.css";
import "./Styles/sectionSurface.css";
import "./Styles/contentarea.css";
import "./Styles/resumePaper.css";
import "./Styles/pagesurface.css"; 
import "./Styles/pagesurface.guard.css";
import "./Styles/responsive-redesign-premium.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <ResumeProvider>
              <JobsFeedProvider>
                <ApplicationsProvider>
                  <InterviewsProvider>
                    <NotificationsProvider>
                      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                        <App />
                      </GoogleOAuthProvider>
                    </NotificationsProvider>
                  </InterviewsProvider>
                </ApplicationsProvider>
              </JobsFeedProvider>
            </ResumeProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
