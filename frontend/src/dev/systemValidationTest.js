// src/dev/systemValidationTest.js

import { ResumeStorageService } from "../services/resumeStorage.service";
import { createResumeModel } from "../models/Resume.model";
import sanitizeResume from "../utils/resumeSanitizer";
import resumeSchema from "../utils/resumeSchema";

export async function runSystemValidationTest() {
  console.group(" HireFold System Validation Test");

  try {
    /* 1 Resume Model */
    const resume = createResumeModel({
      resumeId: "validation-resume-1",
      userId: "user-123",
      title: "Validation Resume",
      source: "builder",
      isEditable: true,
    });

    console.assert(resume.resumeId, " resumeId missing");
    console.assert(resume.userId, " userId missing");
    

    /* 2 Save */
    await ResumeStorageService.saveResume(resume);
    

    /* 3 Fetch */
    const resumes =
      await ResumeStorageService.getResumesByUser("user-123");

    console.assert(resumes.length > 0, " No resumes found");

    const found = resumes.find(
      (r) => r.resumeId === "validation-resume-1"
    );

    console.assert(found, " Resume not retrieved");
    

    /* 4 Schema Safety */
    const sanitized = sanitizeResume(resumeSchema);

    console.assert(Array.isArray(sanitized.skills), " skills");
    console.assert(Array.isArray(sanitized.experience), " experience");
    console.assert(sanitized.basics, " basics");
  } catch (err) {
    
    
  } finally {
    console.groupEnd();
  }
}



