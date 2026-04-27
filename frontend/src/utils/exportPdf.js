import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 *  HIREFOLD STABLE PDF EXPORT (OPTIMIZED)
 * Fixes:
 * - "Resume not found" error
 * - Preview freeze issues
 * - Memoized renderer mismatch
 * - Throttled preview timing bugs
 */
export const exportResumePDF = async (element = null) => {
  try {
    let resumeElement =
      element ||
      document.getElementById("resume-preview-root") ||
      document.querySelector(".resume-paper.full") ||
      document.querySelector(".resume-paper");

    if (!resumeElement) {
      alert("Resume preview not ready. Please wait 1 second and try again.");
      return;
    }

    await new Promise((resolve) =>
      requestAnimationFrame(() => resolve())
    );

    const paperElement =
      resumeElement.classList?.contains("resume-paper")
        ? resumeElement
        : resumeElement.querySelector(".resume-paper");

    const contentElement =
      paperElement?.querySelector(".resume-paper__content") || paperElement;

    if (!paperElement || !contentElement) {
      alert("Resume preview not ready. Please wait 1 second and try again.");
      return;
    }

    const previousTransform = contentElement.style.transform;
    const previousTransformOrigin = contentElement.style.transformOrigin;
    const previousWidth = contentElement.style.width;

    const availableHeight = paperElement.clientHeight;
    const contentHeight = contentElement.scrollHeight;
    const scaleFactor =
      contentHeight > availableHeight
        ? availableHeight / contentHeight
        : 1;

    let canvas;

    try {
      if (scaleFactor < 1) {
        contentElement.style.transform = `scale(${scaleFactor})`;
        contentElement.style.transformOrigin = "top left";
        contentElement.style.width = `${100 / scaleFactor}%`;
      }

      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve())
      );

      canvas = await html2canvas(paperElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: paperElement.scrollWidth,
        height: paperElement.scrollHeight,
        windowWidth: paperElement.scrollWidth,
        windowHeight: paperElement.scrollHeight,
      });
    } finally {
      contentElement.style.transform = previousTransform;
      contentElement.style.transformOrigin = previousTransformOrigin;
      contentElement.style.width = previousWidth;
    }

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("HireFold_Resume.pdf");
  } catch (error) {
    alert("Failed to export PDF. Try again.");
  }
};

