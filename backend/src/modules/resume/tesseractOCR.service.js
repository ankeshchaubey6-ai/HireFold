import { createCanvas } from "canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Tesseract from "tesseract.js";

const OCR_SCALE = 2;
const MAX_OCR_PAGES = 3;

export async function checkOCRSystem() {
  return true;
}

export async function extractTextWithOCRFromPDF(buffer) {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    verbosity: 0,
  }).promise;

  const pages = Math.min(pdf.numPages, MAX_OCR_PAGES);
  let combinedText = "";

  for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: OCR_SCALE });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const image = canvas.toBuffer("image/png");
    const result = await Tesseract.recognize(image, "eng");
    combinedText += `\n${result?.data?.text || ""}`;
  }

  return combinedText.trim();
}

