
    const finalScore =
      ATS_SCORE_RANGE.min +
      rawScore * (ATS_SCORE_RANGE.max - ATS_SCORE_RANGE.min);

    const roundedScore = Math.round(finalScore);

    return {
      score: roundedScore,

      breakdown: {
        machineSignals: features,
        humanSignals,
        roleProfile: role,
        model: "hirefold-ml-v1",
      },

      meta: {
        evaluatedAt: Date.now(),
        version: "ml-scoring-v1",
        pipeline: [
          "feature-extractor",
          "human-ranker",
          "policy-weights",
          "risk-control",
        ],
      },

      engine: "hirefold-ml-engine",
    };
  } catch (error) {
    // Return fail-safe score on error
    return {
      score: 0,
      breakdown: {
        machineSignals: {},
        humanSignals: {},
        error: error.message,
      },
      meta: {
        evaluatedAt: Date.now(),
        failed: true,
      },
      engine: "hirefold-ml-fallback",
    };
  }
}
