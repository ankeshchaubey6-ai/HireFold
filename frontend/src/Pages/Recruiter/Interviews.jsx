import React from "react";
import { useLocation } from "react-router-dom";

import InterviewEvaluation from "./Interviews/InterviewEvaluation";
import InterviewsPage from "./Interviews/InterviewsPage";

const Interviews = () => {
  const { state } = useLocation();

  //  OLD FLOW (Interview evaluation by system / partner)
  if (state?.interviewId) {
    return <InterviewEvaluation interviewState={state} />;
  }

  //  NEW FLOW (Recruiter interview management)
  return <InterviewsPage />;
};

export default Interviews;

