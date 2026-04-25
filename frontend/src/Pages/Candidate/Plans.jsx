import React from "react";
import PricingTable from "../../Components/Pricing/PricingTable";

const Plans = () => {
  return (
    <PricingTable
      subtitle="Upgrade Your Career Tools"
      title="Candidate Plans"
      userType="Candidate"
      plans={[
        {
          title: "Free",
          price: 0,
          features: ["Resume Builder", "Job Matches"],
        },
        {
          title: "Pro",
          price: 499,
          highlighted: true,
          features: [
            "ATS Analysis",
            "Mock Interviews",
            "Resume Insights",
          ],
        },
        {
          title: "Elite",
          price: 999,
          features: [
            "Expert Review",
            "Interview Coaching",
            "Priority Support",
          ],
        },
      ]}
    />
  );
};

export default Plans;
