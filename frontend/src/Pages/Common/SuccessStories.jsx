import React from "react";
import "../../Styles/successStories.css";
import SuccessHero from "../../Assets/SuccessHero.png";
import CandidateAvatar from "../../Assets/CandidateAvatar.png";

const SuccessStories = () => {
  return (
    <section className="success">
      <div className="success-hero">
        <h1>Real Results. Real Impact.</h1>
        <img src={SuccessHero} alt="Success" />
      </div>

      <div className="testimonial">
        <img src={CandidateAvatar} alt="Candidate" />
        <p>
          HireFold helped me land a role based purely on my skills.
        </p>
      </div>
    </section>
  );
};

export default SuccessStories;

