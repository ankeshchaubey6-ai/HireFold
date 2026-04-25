import React from "react";
import { motion } from "framer-motion";

/* =======================
   HERO
======================= */
import CandidateHeroBanner from "../../Components/Banners/CandidateHeroBanner";
import RotatingKeywords from "../../Components/Common/RotatingKeywords";

/* =======================
   CARDS / SECTIONS
======================= */
import RolesFitCard from "../../Components/Cards/RolesFitCard";
import HiringJourneyCard from "../../Components/Cards/HiringJourneyCard";
import SharpenSkillsCard from "../../Components/Cards/SharpenSkillsCard";

/* =======================
   BANNERS
======================= */
import DashboardBottomBanners from "../../Components/Banners/DashboardBottomBanners";

/* =======================
   STYLES
======================= */
import "../../Styles/candidateHome.css";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Dashboard = () => {
  return (
    <div className="candidate-landing">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CandidateHeroBanner />
      </motion.div>

      {/* ================= ROTATING KEYWORDS ================= */}
      <div className="rotating-keywords-wrapper">
        <RotatingKeywords
          words={[
            "Skill-Based Opportunities",
            "Fair Interview Process",
            "ATS-Friendly Resumes",
            "Real Interview Practice",
            "Verified Job Listings",
            "Bias-Free Hiring",
            "Career-Focused Matching",
            "Interview Readiness",
            "Grow With Confidence",
          ]}
          interval={2600}
        />
      </div>

      {/* ================= ROLES THAT FIT YOU ================= */}
      <motion.section
        className="candidate-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="candidate-container">
          <div className="candidate-section-header">
            <span className="candidate-section-header__badge"> Your Perfect Match</span>
            <h2 className="candidate-section-header__title">
              Roles That Fit
              <span className="gradient-text"> You</span>
            </h2>
            <p className="candidate-section-header__subtitle">
              Personalized opportunities based on your skills and experience
            </p>
          </div>
          <RolesFitCard />
        </div>
      </motion.section>

      {/* ================= YOUR HIRING JOURNEY ================= */}
      <motion.section
        className="candidate-section candidate-section--alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="candidate-container">
          <div className="candidate-section-header">
            <span className="candidate-section-header__badge"> Simple & Transparent</span>
            <h2 className="candidate-section-header__title">
              Your Hiring
              <span className="gradient-text"> Journey</span>
            </h2>
            <p className="candidate-section-header__subtitle">
              Four simple steps to your next career opportunity
            </p>
          </div>
          <HiringJourneyCard />
        </div>
      </motion.section>

      {/* ================= SHARPEN YOUR SKILLS ================= */}
      <motion.section
        className="candidate-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="candidate-container">
          <div className="candidate-section-header">
            <span className="candidate-section-header__badge"> Learn & Grow</span>
            <h2 className="candidate-section-header__title">
              Sharpen Your
              <span className="gradient-text"> Skills</span>
            </h2>
            <p className="candidate-section-header__subtitle">
              Free courses and resources to help you ace your interviews
            </p>
          </div>
          <SharpenSkillsCard />
        </div>
      </motion.section>

      {/* ================= BOTTOM BANNERS ================= */}
      <motion.div
        className="candidate-bottom-banners-wrapper"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="candidate-container">
          <DashboardBottomBanners />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
