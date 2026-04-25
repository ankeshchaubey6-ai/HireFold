import React from "react";
import { motion } from "framer-motion";
import RotatingKeywords from "../../Components/Common/RotatingKeywords";

/* ================= BANNERS ================= */
import RecruiterHeroBanner from "../../Components/Banners/RecruiterHeroBanner";
import FairAndSecureBanner from "../../Components/Banners/FairAndSecureBanner";

/* ================= CARDS ================= */
import HiringSnapshotCard from "../../Components/Cards/HiringSnapshotCard";
import CandidateMatchCard from "../../Components/Cards/CandidateMatchCard";
import EvaluationToolCard from "../../Components/Cards/EvaluationToolCard";

/* ================= HIRING MODEL ================= */
import SelfManagedHiringCard from "../../Components/PostJob/HiringModel/SelfManagedHiringCard";
import AssistedHiringCard from "../../Components/PostJob/HiringModel/AssistedHiringCard";

/* ================= STYLES ================= */
import "../../Styles/recruiterHome.css";

/* ================= ASSETS ================= */
/* Hiring Snapshot */
import ActiveJobs from "../../Assets/Activejobopenings.png";
import CandidateScreening from "../../Assets/Candidatesscreening.png";
import InterviewScheduling from "../../Assets/Interviewscheduling.png";
import ShortlistedProfiles from "../../Assets/Shortlistedprofiles.png";

/* Top Match Candidates */
import SkillMatch from "../../Assets/Skillmatchpercentage.png";
import ResumeRank from "../../Assets/Resumeranking.png";
import InterviewReadiness from "../../Assets/Interviewreadinessscore.png";
import ATSCompatibilityScore from "../../Assets/ATScompatibilityscore.png";

/* Smart Evaluation Tools */
import SecureAssessment from "../../Assets/Secureassessments.png";
import MultiRound from "../../Assets/Multi-roundinterviews.png";
import AntiCheat from "../../Assets/Cheatingmonitoringsystem.png";
import Reports from "../../Assets/Detailedcandidatereports.png";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Dashboard = () => {
  return (
    <div className="recruiter-landing">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <RecruiterHeroBanner />
      </motion.div>

      {/* ================= ROTATING KEYWORDS ================= */}
      <div className="rotating-keywords-wrapper">
        <RotatingKeywords
          words={[
            "Verified Candidates",
            "Bias-Free Screening",
            "ATS-Compatible Hiring",
            "AI-Assisted Interviews",
            "Secure Evaluations",
            "Structured Hiring Flow",
            "Shortlist Faster",
            "Data-Driven Decisions",
            "Hire With Confidence",
          ]}
          interval={2600}
        />
      </div>

      {/* ================= HIRING SNAPSHOT ================= */}
      <motion.section
        className="recruiter-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="recruiter-container">
          <div className="recruiter-section-header">
            <span className="recruiter-section-header__badge"> Real-Time Metrics</span>
            <h2 className="recruiter-section-header__title">
              Hiring
              <span className="gradient-text"> Snapshot</span>
            </h2>
            <p className="recruiter-section-header__subtitle">
              Track your hiring progress at a glance
            </p>
          </div>
          <div className="section-surface">
            <motion.div 
              className="recruiter-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <HiringSnapshotCard title="Active Job Openings" image={ActiveJobs} to="/recruiter/post-job" />
              <HiringSnapshotCard title="Candidate Screening" image={CandidateScreening} to="/recruiter/applicants" />
              <HiringSnapshotCard title="Interview Scheduling" image={InterviewScheduling} to="/recruiter/interviews" />
              <HiringSnapshotCard title="Shortlisted Profiles" image={ShortlistedProfiles} to="/recruiter/post-job" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= TOP MATCHED CANDIDATES ================= */}
      <motion.section
        className="recruiter-section recruiter-section--alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="recruiter-container">
          <div className="recruiter-section-header">
            <span className="recruiter-section-header__badge"> Best Fit</span>
            <h2 className="recruiter-section-header__title">
              Top Matched
              <span className="gradient-text"> Candidates</span>
            </h2>
            <p className="recruiter-section-header__subtitle">
              AI-powered matching for the perfect hire
            </p>
          </div>
          <div className="section-surface">
            <motion.div 
              className="recruiter-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <CandidateMatchCard title="Skill Match Percentage" image={SkillMatch} to="/recruiter/applicants" />
              <CandidateMatchCard title="Resume Ranking" image={ResumeRank} to="/recruiter/applicants" />
              <CandidateMatchCard title="Interview Readiness Score" image={InterviewReadiness} to="/recruiter/applicants" />
              <CandidateMatchCard title="ATS Compatibility Score" image={ATSCompatibilityScore} to="/recruiter/applicants" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= CHOOSE HIRING MODEL ================= */}
      <motion.section
        className="recruiter-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="recruiter-container">
          <div className="recruiter-section-header">
            <span className="recruiter-section-header__badge"> Flexible Options</span>
            <h2 className="recruiter-section-header__title">
              Choose Your
              <span className="gradient-text"> Hiring Model</span>
            </h2>
            <p className="recruiter-section-header__subtitle">
              Self-managed or fully assisted  you decide
            </p>
          </div>
          <div className="section-surface">
            <motion.div 
              className="hiring-model-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SelfManagedHiringCard />
              <AssistedHiringCard />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= SMART EVALUATION TOOLS ================= */}
      <motion.section
        className="recruiter-section recruiter-section--alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="recruiter-container">
          <div className="recruiter-section-header">
            <span className="recruiter-section-header__badge"> Advanced Tools</span>
            <h2 className="recruiter-section-header__title">
              Smart Evaluation
              <span className="gradient-text"> Tools</span>
            </h2>
            <p className="recruiter-section-header__subtitle">
              Make data-driven hiring decisions
            </p>
          </div>
          <div className="section-surface">
            <motion.div 
              className="recruiter-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <EvaluationToolCard title="Secure Assessments" image={SecureAssessment} />
              <EvaluationToolCard title="Multi-round Interviews" image={MultiRound} />
              <EvaluationToolCard title="Anti-Cheat System" image={AntiCheat} />
              <EvaluationToolCard title="Detailed Candidate Reports" image={Reports} />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= FAIR & SECURE BANNER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="recruiter-banner-wrapper"
      >
        <div className="recruiter-container">
          <FairAndSecureBanner />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
