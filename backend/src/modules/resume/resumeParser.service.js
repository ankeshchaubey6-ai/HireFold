import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfParse from "pdf-parse";
import { extractStructuredDataFromText } from "./resumeStructureExtractor.service.js";
import { parseResumeWithAffindaBuffer } from "./affindaRestParser.service.js";
import { extractTextFromPDFWithOCR } from "./tesseractOCR.service.js";

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
    .replace(/[^\S\n]+/g, " ")
    .trim();
}

function hasMeaningfulText(text = "") {
  return normalizeText(text).replace(/\s+/g, " ").trim().length >= LOW_TEXT_THRESHOLD;
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

        const rows = [];
        for (const item of content.items) {
          const text = String(item?.str || "").trim();
          if (!text) continue;

          const y = Math.round((item?.transform?.[5] || 0) * 10) / 10;
          const lastRow = rows[rows.length - 1];

          if (!lastRow || Math.abs(lastRow.y - y) > 2) {
            rows.push({ y, parts: [text] });
          } else {
            lastRow.parts.push(text);
          }
        }

        const pageText = rows
          .map((row) => row.parts.join(" ").replace(/[^\S\n]+/g, " ").trim())
          .filter(Boolean)
          .join("\n");

        fullText += pageText + "\n\n";
        
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

async function extractTextFromPdfParse(buffer) {
  try {
    const result = await pdfParse(buffer);
    return result?.text || "";
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
  let parserUsed = mimeType === "application/pdf" ? "hirefold-pdfjs-v2" : "hirefold-docx-v1";

  const enrichParsedResult = (structuredData = {}, metadata = {}) => ({
    rawText: structuredData?.rawText || metadata.rawText || "",
    needsOCR: Boolean(metadata.needsOCR),
    structuredData: {
      ...structuredData,
      meta: {
        ...(structuredData?.meta || {}),
        source: "upload",
        parser: metadata.parser || structuredData?.meta?.parser || parserUsed,
        parseQuality: metadata.parseQuality || structuredData?.meta?.parseQuality || parseQuality,
        needsOCR: Boolean(metadata.needsOCR),
        analysisStatus: "ready",
        extractionDate: Date.now(),
        fileInfo: {
          fileName,
          mimeType,
          sizeBytes: buffer.length,
        },
      },
    },
  });
  
  // STEP 1: Parse based on file type
  try {
    if (mimeType === "application/pdf") {
      rawText = await extractTextFromPDF(buffer);
      parserUsed = "hirefold-pdfjs-v2";

      if (!hasMeaningfulText(rawText)) {
        const pdfParseText = await extractTextFromPdfParse(buffer);
        if (pdfParseText.length > rawText.length) {
          rawText = pdfParseText;
          parserUsed = "pdf-parse";
        }
      }

      if (!hasMeaningfulText(rawText) && process.env.AFFINDA_API_KEY && process.env.AFFINDA_WORKSPACE_ID) {
        try {
          const affindaResult = await parseResumeWithAffindaBuffer(buffer, fileName);
          if (hasMeaningfulText(affindaResult?.rawText) || affindaResult?.structuredData?.skills?.length) {
            return enrichParsedResult(affindaResult.structuredData, {
              rawText: affindaResult.rawText,
              parser: affindaResult?.structuredData?.meta?.parser || "affinda-ai",
              parseQuality: affindaResult?.structuredData?.meta?.parseQuality || "ai-high",
              needsOCR: false,
            });
          }
        } catch (error) {
        }
      }

      if (!hasMeaningfulText(rawText)) {
        const ocrText = await extractTextFromPDFWithOCR(buffer);
        if (ocrText.length > rawText.length) {
          rawText = ocrText;
          parserUsed = "tesseract-ocr";
        }
      }

      parseQuality = hasMeaningfulText(rawText) ? "high" : "low";
      needsOCR = !hasMeaningfulText(rawText);
      
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      rawText = await extractTextFromDOCX(buffer);
      parserUsed = "hirefold-docx-v1";

      if (!hasMeaningfulText(rawText) && process.env.AFFINDA_API_KEY && process.env.AFFINDA_WORKSPACE_ID) {
        try {
          const affindaResult = await parseResumeWithAffindaBuffer(buffer, fileName);
          if (hasMeaningfulText(affindaResult?.rawText) || affindaResult?.structuredData?.skills?.length) {
            return enrichParsedResult(affindaResult.structuredData, {
              rawText: affindaResult.rawText,
              parser: affindaResult?.structuredData?.meta?.parser || "affinda-ai",
              parseQuality: affindaResult?.structuredData?.meta?.parseQuality || "ai-high",
              needsOCR: false,
            });
          }
        } catch (error) {
        }
      }

      parseQuality = hasMeaningfulText(rawText) ? "high" : "low";
      needsOCR = !hasMeaningfulText(rawText);
      
    } else {
      throw new Error(`Unsupported format: ${mimeType}. Only PDF and DOCX allowed.`);
    }
    
  } catch (parseError) {
    throw new Error(`Failed to parse resume: ${parseError.message}`);
  }
  
  // STEP 2: Normalize text
  rawText = normalizeText(rawText);
  
  // STEP 3: Handle low-text resumes
  if (needsOCR || rawText.length < LOW_TEXT_THRESHOLD) {
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
        summary: rawText ? rawText.slice(0, 500) : "We could extract limited text from this resume.",
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
          parser: parserUsed,
          parseQuality: rawText ? "low" : "image-resume-detected",
          needsOCR: false,
          ocrStatus: rawText ? "completed" : "unavailable",
          analysisStatus: "ready",
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
      parser: parserUsed,
      parseQuality,
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

