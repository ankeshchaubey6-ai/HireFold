import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { parseResumeWithAffindaBuffer } from "./affindaRestParser.service.js";
import { extractStructuredDataFromText } from "./resumeStructureExtractor.service.js";
import {
  getEmptyStandardizedData,
  normalizeResumeData,
  inferParseQuality,
} from "./resumeStandardization.service.js";
import { extractTextWithOCRFromPDF } from "./tesseractOCR.service.js";

const OCR_WORD_THRESHOLD = 50;

export async function parseResumeBuffer(buffer, mimeType, fileName = "resume.pdf") {
  if (!buffer || !Buffer.isBuffer(buffer) || !buffer.length) {
    throw new Error("Invalid resume buffer");
  }

  console.log("[PARSER] Trying Affinda for:", fileName);

  try {
    const affindaResult = await parseResumeWithAffindaBuffer(buffer, fileName);
    const affindaData = normalizeResumeData(affindaResult.structuredData, {
      parser: "affinda",
      parseQuality: affindaResult.structuredData?.parseQuality || "high",
      meta: {
        source: "upload",
        extractionDate: Date.now(),
      },
    });

    console.log(
      "[PARSER] Affinda result: quality=",
      affindaData.parseQuality,
      "fields=",
      Object.keys(affindaData)
    );

    return {
      rawText: affindaData.rawText,
      needsOCR: false,
      structuredData: affindaData,
    };
  } catch (error) {
    console.error("[PARSER] Affinda failed:", error?.message || error);
  }

  console.log("[PARSER] Falling back to local parser");

  const rawText = await extractTextLocally(buffer, mimeType);
  let structuredData = normalizeResumeData(extractStructuredDataFromText(rawText), {
    parser: "pdfjs",
    parseQuality: inferParseQuality(rawText),
    meta: {
      source: "upload",
      extractionDate: Date.now(),
      fileInfo: {
        fileName,
        mimeType,
        sizeBytes: buffer.length,
      },
    },
  });

  if (getWordCount(rawText) < OCR_WORD_THRESHOLD && mimeType === "application/pdf") {
    console.log("[PARSER] OCR triggered for low text resume");
    try {
      const ocrText = await extractTextWithOCRFromPDF(buffer);
      if (getWordCount(ocrText) > getWordCount(rawText)) {
        structuredData = normalizeResumeData(extractStructuredDataFromText(ocrText), {
          parser: "ocr",
          parseQuality: inferParseQuality(ocrText),
          meta: {
            source: "upload",
            extractionDate: Date.now(),
            fileInfo: {
              fileName,
              mimeType,
              sizeBytes: buffer.length,
            },
          },
        });
      }
    } catch (error) {
      console.error("[PARSER] OCR failed:", error?.message || error);
    }
  }

  if (!structuredData.rawText) {
    structuredData = normalizeResumeData(getEmptyStandardizedData(), {
      parser: "fallback",
      parseQuality: "low",
      meta: {
        source: "upload",
        extractionDate: Date.now(),
      },
    });
  }

  return {
    rawText: structuredData.rawText,
    needsOCR: structuredData.parser === "ocr",
    structuredData,
  };
}

async function extractTextLocally(buffer, mimeType) {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer);
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return extractTextFromDOCX(buffer);
  }

  throw new Error(`Unsupported format: ${mimeType}`);
}

async function extractTextFromPDF(buffer) {
  const document = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    verbosity: 0,
  }).promise;

  const textByPage = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str || "").join(" ");
    textByPage.push(pageText.replace(/\s+/g, " ").trim());
  }

  return textByPage.join("\n").trim();
}

async function extractTextFromDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return String(result?.value || "").trim();
}

function getWordCount(text = "") {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

