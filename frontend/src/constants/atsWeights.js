export const ATS_WEIGHTS = {
  skills: 0.35,
  experience: 0.3,
  education: 0.15,
  projects: 0.1,
  formatting: 0.1,
  gapPenaltyFactor: {
    perLargeGapYears: 0.97,
  },
};

export const BAND_IMPORTANCE = {
  CORE: 1,
  SUPPORTING: 0.75,
  SEMANTIC: 0.6,
};

export const BIAS_CONTROL = {
  capExperienceYears: true,
  maxExperienceYears: 40,
  dampenAgeSignals: true,
  ageKeywordPenalty: 0.9,
  enforceSkillCeiling: true,
  maxSkillAmplification: 1.3,
};

export function applyBandImportance(bands) {
  const scaled = {};

  for (const band in bands) {
    const importance = BAND_IMPORTANCE[band] || 1;
    scaled[band] = {};

    for (const signal in bands[band]) {
      scaled[band][signal] = bands[band][signal] * importance;
    }
  }

  return scaled;
}
