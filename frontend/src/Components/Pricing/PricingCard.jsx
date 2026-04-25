import React from "react";
import { openRazorpayCheckout } from "../../utils/razorpay";
import "./pricing.css";

const PricingCard = ({
  title,
  price,
  features,
  userType,
  highlighted,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`hf-pricing-card 
        ${highlighted ? "featured" : ""} 
        ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {highlighted && <span className="hf-badge">Most Popular</span>}

      <h3>{title}</h3>

      <div className="hf-price">
        {price}
        <span>/one-time</span>
      </div>

      <ul>
        {features.map((f, i) => (
          <li key={i}> {f}</li>
        ))}
      </ul>

      <button
        className="hf-buy-btn"
        onClick={(e) => {
          e.stopPropagation(); //  prevent card click conflict
          openRazorpayCheckout({
            amount: price,
            planName: title,
            userType,
          });
        }}
      >
        {isSelected ? "Proceed to Pay" : "Select Plan"}
      </button>
    </div>
  );
};

export default PricingCard;

