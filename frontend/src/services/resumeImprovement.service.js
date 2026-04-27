const percent = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

export function generateResumeImprovements({ structuredData, ats }) {
  const score = percent(ats?.score ?? ats?.atsScore ?? ats?.overallScore ?? 0);
  const missingKeywords = ats?.keywordGap?.missingKeywords || [];
  const plan = [];

  if (score < 80) {
    plan.push({
      section: "Overall Resume",
      priority: score < 60 ? "high" : "medium",
      detail: "Improve alignment between resume content and the target role requirements.",
      estMinutes: 20,
    });
  }

  if (missingKeywords.length) {
    plan.push({
      section: "Keywords",
      priority: "high",
      detail: `Add or strengthen relevant terms such as ${missingKeywords.slice(0, 3).join(", ")}.`,
      estMinutes: 15,
    });
  }

  if (!structuredData?.summary) {
    plan.push({
      section: "Summary",
      priority: "medium",
      detail: "Add a concise professional summary to improve context for recruiters and ATS tools.",
      estMinutes: 10,
    });
  }

  const verdict =
    score >= 80 ? "Your resume is in strong shape." : score >= 60 ? "Your resume is competitive but can be improved." : "Your resume needs a few targeted updates.";

  return {
    verdict,
    summary: `Your resume scored ${score}/100 in ATS evaluation. ${verdict}`,
    plan,
  };
}
