

function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

/* ============================================================
   SIGNAL 1: Resume Readability & Structure (Human Scan Test)
   ============================================================ */

function formattingQuality(resume) {
  let score = 1;

  if (!resume.summary || resume.summary.length < 40) score -= 0.25;
  if (!resume.skills?.length) score -= 0.2;
  if (!resume.experience?.length) score -= 0.35;

  const excessiveSections =
    (resume.projects?.length || 0) > 6 ||
    (resume.certifications?.length || 0) > 6;

  if (excessiveSections) score -= 0.1;

  return clamp(score);
}

/* ============================================================
   SIGNAL 2: Career Narrative Coherence
   - Penalizes job hopping
   - Rewards logical progression
   ============================================================ */

function careerCoherence(experience = []) {
  if (experience.length < 2) return 0.6;

  let score = 1;

  for (let i = 1; i < experience.length; i++) {
    const prev = experience[i - 1];
    const curr = experience[i];

    if (curr.years && curr.years < 0.5) {
      score -= 0.12; // short tenure
    }

    if (
      prev.title &&
      curr.title &&
      prev.title.toLowerCase() === curr.title.toLowerCase()
    ) {
      score += 0.05; // stability
    }
  }

  return clamp(score);
}

/* ============================================================
   SIGNAL 3: Signal-to-Noise Ratio
   - Too short = thin
   - Too long = keyword stuffed
   ============================================================ */

function signalClarity(resume) {
  const size = JSON.stringify(resume).length;

  if (size < 800) return 0.4;
  if (size > 8000) return 0.6;

  return 1.0;
}

/* ============================================================
   SIGNAL 4: Ownership & Impact (Leadership Indicator)
   ============================================================ */

function leadershipSignal(experience = []) {
  let score = 0;

  experience.forEach((e) => {
    if (/lead|manager|head|architect|owner/i.test(e.title || "")) {
      score += 0.15;
    }

    if ((e.achievements || []).length >= 3) {
      score += 0.1;
    }

    if (
      e.achievements?.some((a) =>
        /improved|increased|reduced|optimized|led/i.test(a)
      )
    ) {
      score += 0.1;
    }
  });

  return clamp(score);
}

/* ============================================================
   SIGNAL 5: Resume Intent & Focus
   - Detects scatter vs direction
   ============================================================ */

function roleFocus(resume) {
  const titles = (resume.experience || [])
    .map((e) => (e.title || "").toLowerCase())
    .filter(Boolean);

  if (titles.length < 2) return 0.6;

  const uniqueTitles = new Set(titles);
  const focusRatio = 1 - uniqueTitles.size / titles.length;

  return clamp(focusRatio);
}

/* ============================================================
   SIGNAL 6: Authenticity Heuristic
   - Penalizes buzzword-only resumes
   ============================================================ */

function authenticitySignal(resume) {
  const text = JSON.stringify(resume).toLowerCase();

  const buzzwords = [
    "synergy",
    "dynamic",
    "innovative",
    "fast-paced",
    "self-starter",
    "disruptive",
  ];

  let penalty = 0;

  buzzwords.forEach((w) => {
    if (text.includes(w)) penalty += 0.05;
  });

  return clamp(1 - penalty);
}

/* ============================================================
   PUBLIC API
   ============================================================ */

export function rankResume(resume) {
  if (!resume) {
    throw new Error("Sanitized resume object is required");
  }

  return {
    // Core human signals
    formattingQuality: formattingQuality(resume),
    careerCoherence: careerCoherence(resume.experience || []),
    signalClarity: signalClarity(resume),
    leadershipSignal: leadershipSignal(resume.experience || []),
    roleFocus: roleFocus(resume),
    authenticitySignal: authenticitySignal(resume),

    // Metadata
    meta: {
      evaluatedAt: Date.now(),
      engine: "hirefold-human-ranker-v1",
      purpose: "qualitative-signal-generation",
    },
  };
}

