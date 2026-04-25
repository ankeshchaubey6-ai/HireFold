import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

/* ================= BANNERS ================= */
import PublicHeroBanner from "../../Components/Banners/PublicHeroBanner";
import HiringWithoutBiasBanner from "../../Components/Cards/HiringWithoutBiasBanner";
import RotatingKeywords from "../../Components/Common/RotatingKeywords";

/* ================= CARDS ================= */
import CareerDomainCard from "../../Components/Cards/CareerDomainCard";
import InDemandRoleCard from "../../Components/Cards/InDemandRoleCard";
import OpportunityCard from "../../Components/Cards/OpportunityCard";

/* ================= PREMIUM STYLES ================= */
import "../../Styles/publicHomePremium.css";

// Animation variants for sections
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="home-premium__particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="home-premium__particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Scroll progress indicator
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-premium__scroll-progress">
      <div
        className="home-premium__scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

// Section header component
const SectionHeader = ({ badge, title, subtitle, alignment = "center" }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className={`section-header section-header--${alignment}`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="section-header__badge"
        >
          {badge}
        </motion.span>
      )}
      <h2 className="section-header__title">
        {title}
        {title.includes("Career") && (
          <span className="gradient-text"> Domains</span>
        )}
        {title.includes("In-Demand") && (
          <span className="gradient-text"> Roles</span>
        )}
        {title.includes("Opportunities") && (
          <span className="gradient-text"> That Match You</span>
        )}
      </h2>
      {subtitle && (
        <p className="section-header__subtitle">{subtitle}</p>
      )}
    </motion.div>
  );
};

// Stats counter component
const StatsCounter = ({ end, label, duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="stats-counter">
      <div className="stats-counter__value">{count}+</div>
      <div className="stats-counter__label">{label}</div>
    </div>
  );
};

const Home = () => {
  const mainRef = useRef(null);

  // Stats data
  const stats = [
    { value: 10000, label: "Active Jobs" },
    { value: 500, label: "Companies" },
    { value: 95, label: "Success Rate" },
    { value: 50, label: "Industries" },
  ];

  return (
    <main className="home-premium" ref={mainRef}>
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <PublicHeroBanner />
      </motion.div>

      {/* ROTATING KEYWORDS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <RotatingKeywords
          words={[
            "Smart Hiring",
            "Fair Interviews",
            "Bias-Free Evaluation",
            "ATS Optimized Resumes",
            "Skill-Based Hiring",
            "Verified Candidates",
            "Secure Assessments",
            "AI-Assisted Screening",
            "Transparent Hiring",
            "Hiring Without Noise",
            "Modern Recruitment",
            "Built for Candidates",
            "Trusted by Recruiters",
          ]}
          interval={2600}
        />
      </motion.div>

      {/* STATS SECTION - New Premium Addition */}
      <section className="home-premium__stats-section">
        <div className="container">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="stats-grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={sectionVariants}
                className="stat-card"
              >
                <StatsCounter end={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPLORE CAREER DOMAINS */}
      <motion.section
        className="home-premium__section home-premium__section--domains"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container">
          <SectionHeader
            badge=" Career Paths"
            title="Explore Career"
            subtitle="Discover your perfect career path with our curated domains"
          />
          <CareerDomainCard />
        </div>
      </motion.section>

      {/* IN-DEMAND ROLES */}
      <motion.section
        className="home-premium__section home-premium__section--roles home-premium__section--alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container">
          <SectionHeader
            badge=" Trending Now"
            title="In-Demand"
            subtitle="Most sought-after roles in today's market"
          />
          <InDemandRoleCard />
        </div>
      </motion.section>

      {/* OPPORTUNITIES */}
      <motion.section
        className="home-premium__section home-premium__section--opportunities"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container">
          <SectionHeader
            badge=" Smart Matches"
            title="Opportunities"
            subtitle="Personalized opportunities tailored just for you"
          />
          <OpportunityCard />
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION - New Premium Addition */}
      <motion.section
        className="home-premium__section home-premium__section--testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container">
          <SectionHeader
            badge=" Success Stories"
            title="What Our Users Say"
            subtitle="Join thousands of satisfied users who found their dream careers"
          />
          <div className="testimonials-grid">
            {/* Add your testimonial cards here */}
          </div>
        </div>
      </motion.section>

      {/* CTA BANNER */}
      <motion.section
        className="home-premium__section home-premium__section--banner"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          <HiringWithoutBiasBanner />
        </div>
      </motion.section>

      {/* BACK TO TOP BUTTON */}
      <motion.button
        className="home-premium__back-to-top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5L12 19M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.button>
    </main>
  );
};

export default Home;
