import Application from "../application/application.model.js";
import Job from "../job/job.model.js";
import { ResumeModel } from "../resume/resume.model.js";

const buildVerdict = (score, rank, shortlistCount) => {
  if (rank < shortlistCount) {
    return "Shortlist";
  }

  if (score >= 60) {
    return "Review";
  }

  return "Reject";
};

export const AIShortlistingService = {
  async shortlistForJob(jobId, recruiterId) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    if (job.recruiter.toString() !== recruiterId.toString()) {
      throw new Error("Not authorized");
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .lean();

    if (!applications.length) {
      return {
        totalApplicants: 0,
        shortlistedCount: 0,
        shortlisted: [],
      };
    }

    const results = await Promise.all(
      applications.map(async (application) => {
        let atsScore = application.atsScore ?? 0;

        if (application.resumeId) {
          const resume = await ResumeModel.findOne({ resumeId: application.resumeId })
            .select("atsScore ats structuredData")
            .lean();

          atsScore = resume?.atsScore ?? atsScore;

          return {
            applicationId: application._id,
            candidateId: application.candidate?._id || null,
            candidateName: application.candidate?.name || "Candidate",
            candidateEmail: application.candidate?.email || "",
            atsScore,
            ats: resume?.ats || application.ats || null,
            structuredData: resume?.structuredData || null,
            finalScore: atsScore,
          };
        }

        return {
          applicationId: application._id,
          candidateId: application.candidate?._id || null,
          candidateName: application.candidate?.name || "Candidate",
          candidateEmail: application.candidate?.email || "",
          atsScore,
          ats: application.ats || null,
          structuredData: null,
          finalScore: atsScore,
        };
      })
    );

    results.sort((left, right) => right.finalScore - left.finalScore);

    const shortlistCount = Math.max(1, Math.ceil(results.length * 0.3));
    const shortlisted = results.slice(0, shortlistCount).map((result, index) => ({
      ...result,
      rank: index + 1,
      verdict: buildVerdict(result.finalScore, index, shortlistCount),
    }));

    await Promise.all(
      results.map((result, index) =>
        Application.updateOne(
          { _id: result.applicationId },
          {
            $set: {
              aiRank: index + 1,
              aiShortlisted: index < shortlistCount,
              atsScore: result.atsScore,
            },
          }
        )
      )
    );

    return {
      totalApplicants: results.length,
      shortlistedCount: shortlisted.length,
      shortlisted,
    };
  },
};
