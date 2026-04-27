import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";

const MAX_OCR_PAGES = 3;

function normalizeOCRText(text = "") {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function checkOCRSystem() {
  return true;
}

export async function extractTextFromPDFWithOCR(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return "";
  }

  const convert = fromBuffer(buffer, {
    density: 180,
    format: "png",
    width: 1600,
    height: 2200,
    preserveAspectRatio: true,
  });

  let combinedText = "";

  for (let pageNumber = 1; pageNumber <= MAX_OCR_PAGES; pageNumber += 1) {
    try {
      const pageImage = await convert(pageNumber, { responseType: "base64" });
      const base64 = pageImage?.base64;

      if (!base64) {
        break;
      }

      const { data } = await Tesseract.recognize(
        Buffer.from(base64, "base64"),
        "eng",
        {}
      );

      const pageText = normalizeOCRText(data?.text || "");
      if (!pageText) {
        continue;
      }

      combinedText += `${pageText}\n\n`;
    } catch (error) {
      if (pageNumber === 1) {
        return "";
      }
      break;
    }
  }

  return normalizeOCRText(combinedText);
}
