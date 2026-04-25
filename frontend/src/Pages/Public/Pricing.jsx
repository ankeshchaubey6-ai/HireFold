import React from "react";
import PricingTable from "../../Components/Pricing/PricingTable";

const Pricing = () => {
  return (
    <>
      <PricingTable
        subtitle="For Candidates"
        title="Build a Stronger Career"
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
              "ATS Optimization",
              "Mock Interviews",
              "Resume Analysis",
            ],
          },
          {
            title: "Elite",
            price: 999,
            features: [
              "Expert Resume Review",
              "Interview Prep",
              "Priority Support",
            ],
          },
        ]}
      />

      <PricingTable
        subtitle="For Recruiters"
        title="Hire Faster with Confidence"
        userType="Recruiter"
        plans={[
          {
            title: "Starter",
            price: 999,
            features: ["1 Job Post", "Basic Screening"],
          },
          {
            title: "Assisted",
            price: 2999,
            highlighted: true,
            features: [
              "Unlimited Jobs",
              "Assisted Hiring",
              "Interview Scheduling",
            ],
          },
          {
            title: "Enterprise",
            price: 9999,
            features: [
              "Dedicated Hiring Manager",
              "Advanced Reports",
              "Custom Workflow",
            ],
          },
        ]}
      />
    </>
  );
};

export default Pricing;
