import React from "react";

import CandidateNavbar from "../../Components/Navbars/CandidateNavbar";

const Offers = () => {
  return (
    <>
      <CandidateNavbar />

      <main className="page">
        <h1>Offers Received</h1>

        <div className="card">
          <h3>Frontend Engineer</h3>
          <p>Company: Acme Corp</p>
          <strong>Status: Pending</strong>
        </div>
      </main>

    
    </>
  );
};

export default Offers;
