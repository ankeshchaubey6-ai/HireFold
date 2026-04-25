import React from "react";

import RecruiterNavbar from "../../Components/Navbars/RecruiterNavbar";


const Reports = () => {
  return (
    <>
      <RecruiterNavbar />

      <main className="page">
        <h1>Hiring Reports</h1>

        <div className="grid">
          <div className="card">Time to Hire: 18 days</div>
          <div className="card">Offer Acceptance Rate: 72%</div>
          <div className="card">Bias-Free Score: High</div>
        </div>
      </main>

      
    </>
  );
};

export default Reports;
