import React, { useState } from "react";
import PricingCard from "./PricingCard";
import "./pricing.css";

const PricingTable = ({ title, subtitle, plans, userType }) => {
  const [selectedPlan, setSelectedPlan] = useState(
    plans.find(p => p.highlighted)?.title || plans[0].title
  );

  return (
    <section className="hf-pricing-section">
      <p className="hf-subtitle">{subtitle}</p>
      <h2 className="hf-title">{title}</h2>

      <div className="hf-pricing-grid">
        {plans.map((plan, i) => (
          <PricingCard
            key={i}
            {...plan}
            userType={userType}
            isSelected={selectedPlan === plan.title}
            onSelect={() => setSelectedPlan(plan.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default PricingTable;
