import React from "react";
import PricingTable from "../../Components/Pricing/PricingTable";

const ServicesPlans = () => {
  return (
    <PricingTable
      subtitle="Scale Your Hiring"
      title="Recruiter Service Plans"
      userType="Recruiter"
      plans={[
        {
          title: "Starter",
          price: 999,
          features: ["1 Job Post", "Basic ATS"],
        },
        {
          title: "Assisted",
          price: 2999,
          highlighted: true,
          features: [
            "Unlimited Jobs",
            "Assisted Hiring",
            "Interview Management",
          ],
        },
        {
          title: "Enterprise",
          price: 9999,
          features: [
            "Dedicated Team",
            "Advanced Analytics",
            "Custom Integrations",
          ],
        },
      ]}
    />
  );
};

export default ServicesPlans;
