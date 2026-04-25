import { generateResumeImprovements } from "../services/resumeImprovement.service";
import { ResumeStorageService } from "../services/resumeStorage.service";

(async function verify() {
  const all = await ResumeStorageService.getResumesByUser(null);

  const uploaded = all
    .filter(r => r.source === "upload" && r.ats)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];

  if (!uploaded) {
    
    console.table(
      all.filter(r => r.source === "upload").map(r => ({
        title: r.title,
        hasATS: !!r.ats,
        atsScore: r.atsScore,
        parsedBy: r.structuredData?.meta?.parsedBy,
      }))
    );
    return;
  }

  const report = generateResumeImprovements({
    structuredData: uploaded.structuredData,
    ats: uploaded.ats,
  });

  
})();

