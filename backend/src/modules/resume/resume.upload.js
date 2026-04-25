import pdfParse from "pdf-parse";
import streamifier from "streamifier";
import { ResumeModel } from "./resume.model.js";
import { uploadResumeToCloudinary } from "./cloudinary.service.js";



function extractBasicStructuredData(text) {
  if (!text) return {};

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  return {
    meta: {
      source: "upload",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetTemplate: "Modern01",
      layoutHints: {
        includePhoto: false,
        showBorders: false,
        accentColor: "#0ea5e9",
        fontFamily: "Inter",
        fontSize: 11,
        pageMargins: "18mm",
      },
    },
    basics: {
      fullName: lines[0] || "",
      email: text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "",
      phone: text.match(/(\+?\d[\d\s-]{7,})/)?.[0] || "",
      linkedin: "",
      github: "",
      portfolio: "",
      address: "",
      label: "",
      preferredName: "",
      photo: null,
    },
    summary: lines.slice(1, 4).join(" "),
    skills: [
      {
        category: "Extracted Skills",
        items: [],
      },
    ],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    courses: [],
    publications: [],
    awards: [],
    references: [],
    attachments: [],
    rawText: text, 
  };
}

export const ResumeUploadService = {
  async processUploadedResume({
    fileBuffer,
    fileMeta,
    userId,
    resumeId,
  }) {
    if (!fileBuffer) {
      throw new Error("File buffer missing");
    }

    // =====================================================
    // STEP 1: UPLOAD TO CLOUDINARY (FULL URL)
    // =====================================================
    let cloudUrl = null;
    let cloudPublicId = null;

    try {
      const uploadResult = await uploadResumeToCloudinary(
        fileBuffer,
        fileMeta?.name || "resume.pdf"
      );

      if (uploadResult?.url) {
        cloudUrl = uploadResult.url;
        cloudPublicId = uploadResult.publicId;
      }
    } catch (cloudError) {
      void cloudError;
    }

    // =====================================================
    // STEP 2: EXTRACT TEXT
    // =====================================================
    const extractedText = await this.parsePDFBuffer(fileBuffer);

    // =====================================================
    // STEP 3: CONVERT TO STRUCTURED RESUME
    // =====================================================
    const structuredData = extractBasicStructuredData(extractedText);

    /* Inject identity */
    structuredData.meta.resumeId = resumeId;
    structuredData.meta.userId = userId;

    // =====================================================
    // STEP 4: SAVE TO DB WITH CLOUDINARY URL
    // =====================================================
    const resumeDoc = await ResumeModel.findOneAndUpdate(
      { resumeId },
      {
        resumeId,
        userId: userId || "anonymous",
        title: fileMeta?.name?.replace(".pdf", "") || "Uploaded Resume",
        source: "upload",
        templateId: null,
        isEditable: false,
        isDraft: false,
        structuredData,
        originalFileMeta: {
          fileName: fileMeta?.name,
          fileSize: fileMeta?.size,
          mimeType: fileMeta?.type,
          cloudUrl, 
          cloudPublicId,
          uploadedAt: Date.now(),
        },
        updatedAt: Date.now(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    // =====================================================
    // STEP 5: VERIFY SAVE
    // =====================================================
    return {
      resume: resumeDoc,
      structuredData,
      extractedTextLength: extractedText.length,
    };
  },

  async parsePDFBuffer(fileBuffer) {
    const result = await pdfParse(fileBuffer);
    return result?.text || "";
  },
};

