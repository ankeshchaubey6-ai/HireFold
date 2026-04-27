import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { extractStructuredDataFromText } from "./resumeStructureExtractor.service.js";

/**
 * =========================================================
 * HIREFOLD ENTERPRISE RESUME PARSER v2.0
 * =========================================================
 * Features:
 *  Section-aware parsing
 *  NER-style extraction
 *  Image/Canva detection
 *  Async OCR queueing
 *  Crash-proof error handling
 *  ML-ready feature extraction
 * =========================================================
 */

const LOW_TEXT_THRESHOLD = 30;
const MAX_PAGES = 50; // Safety limit

/**
 * Normalize text for consistent processing
 */
function normalizeText(text = "") {
  if (!text) return "";
  
  return text
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract text from PDF using pdfjs-dist
 * Handles both text-based and image-based PDFs
 */
async function extractTextFromPDF(buffer) {
  try {
    
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      verbosity: 0,
      disableFontFace: false,
      stopAtErrors: true
    });
    
    const pdf = await loadingTask.promise;
    const numPages = Math.min(pdf.numPages, MAX_PAGES);
    
    
    let fullText = "";
    
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        const pageText = content.items
          .map(item => item.str || "")
          .join(" ")
          .replace(/\s+/g, " ");
        
        fullText += pageText + "\n";
        
        // Progress indicator
        if (i % 10 === 0) {
        }
        
      } catch (pageError) {
        continue; // Skip problematic pages
      }
    }
    
    return fullText;
    
  } catch (error) {
    return "";
  }
}

/**
 * Extract text from DOCX using mammoth
 */
async function extractTextFromDOCX(buffer) {
  try {
    
    const result = await mammoth.extractRawText({ buffer });
    const text = result?.value || "";
    
    return text;
    
  } catch (error) {
    return "";
  }
}

/**
 * Main parsing function - returns structured data immediately
 * For image resumes, flags need for async OCR processing
 */
export async function parseResumeBuffer(buffer, mimeType, fileName = "resume.pdf") {
  // Input validation
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid resume buffer: must be a Buffer");
  }
  
  if (buffer.length === 0) {
    throw new Error("Empty file buffer");
  }
  
  if (!mimeType || typeof mimeType !== "string") {
    throw new Error("Missing or invalid MIME type");
  }
  
  let rawText = "";
  let needsOCR = false;
  let parseQuality = "unknown";
  
  // STEP 1: Parse based on file type
  try {
    if (mimeType === "application/pdf") {
      rawText = await extractTextFromPDF(buffer);
      parseQuality = rawText.length > LOW_TEXT_THRESHOLD ? "high" : "low";
      needsOCR = rawText.length < LOW_TEXT_THRESHOLD;
      
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      rawText = await extractTextFromDOCX(buffer);
      parseQuality = rawText.length > LOW_TEXT_THRESHOLD ? "high" : "low";
      needsOCR = rawText.length < LOW_TEXT_THRESHOLD;
      
    } else {
      throw new Error(`Unsupported format: ${mimeType}. Only PDF and DOCX allowed.`);
    }
    
  } catch (parseError) {
    throw new Error(`Failed to parse resume: ${parseError.message}`);
  }
  
  // STEP 2: Normalize text
  rawText = normalizeText(rawText);
  
  // STEP 3: Handle image/Canva resumes
  if (needsOCR || rawText.length < LOW_TEXT_THRESHOLD) {
    
    return {
      rawText: "",
      needsOCR: true,
      structuredData: {
        rawText: "",
        basics: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: ""
        },
        summary: "Processing resume with OCR. This may take a moment...",
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        features: {
          totalSkills: 0,
          experienceCount: 0,
          educationCount: 0,
          projectCount: 0,
          wordCount: 0
        },
        meta: {
          source: "upload",
          parser: "hirefold-pdfjs-v2",
          parseQuality: "image-resume-detected",
          needsOCR: true,
          ocrStatus: "pending",
          analysisStatus: "processing",
          extractionDate: Date.now()
        }
      }
    };
  }
  
  // STEP 4: High-quality text - run structured extraction
  
  try {
    const structuredData = extractStructuredDataFromText(rawText);
    
    // Add parsing metadata
    structuredData.meta = {
      ...structuredData.meta,
      source: "upload",
      parser: "hirefold-pdfjs-v2",
      parseQuality: "high",
      needsOCR: false,
      analysisStatus: "ready",
      extractionDate: Date.now(),
      fileInfo: {
        fileName,
        mimeType,
        sizeBytes: buffer.length
      }
    };

    return {
      rawText,
      needsOCR: false,
      structuredData
    };
    
  } catch (extractionError) {
    
    // Fallback: return basic structure with raw text
    return {
      rawText,
      needsOCR: false,
      structuredData: {
        rawText,
        basics: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: ""
        },
        summary: rawText.slice(0, 500),
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        features: {
          wordCount: rawText.split(/\s+/).length
        },
        meta: {
          source: "upload",
          parser: "hirefold-pdfjs-v2",
          parseQuality: "fallback",
          needsOCR: false,
          analysisStatus: "partial",
          extractionError: extractionError.message,
          extractionDate: Date.now()
        }
      }
    };
  }
}

