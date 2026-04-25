import { ResumeStorageService } from "../services/resumeStorage.service";
import { createResumeModel } from "../models/Resume.model";

async function runTest() {
  const resume = createResumeModel({
    resumeId: "test-resume-1",
    userId: "user-123",
    title: "Test Resume",
    source: "builder",
    isEditable: true,
  });

  await ResumeStorageService.saveResume(resume);

  const resumes = await ResumeStorageService.getResumesByUser("user-123");

  
}

runTest();

