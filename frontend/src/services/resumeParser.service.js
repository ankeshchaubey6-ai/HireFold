/**
 * resumeParser.service.js
 *
 * Parses uploaded resumes into raw text.
 * (PDF & DOCX supported  extendable)
 *
 * Vite-safe, production-grade implementation
 */

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ============================
   PDF PARSER
============================ */

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    text +=
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
  }

  return text.trim();
}

/* ============================
   DOCX PARSER
============================ */

async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/* ============================
   PUBLIC API
============================ */

export async function parseResumeFile(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  if (file.type === "application/pdf") {
    return parsePDF(file);
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return parseDOCX(file);
  }

  throw new Error("Unsupported file format");
}

