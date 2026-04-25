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
    /**
     *  PRIORITY SELECTORS (in order of stability)
     * 1. Passed element (best)
     * 2. Preview root (new optimized system)
     * 3. ResumePaper fallback (legacy templates)
     */
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

    const canvas = await html2canvas(resumeElement, {
      scale: 2, // High quality export
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: resumeElement.scrollWidth,
      windowHeight: resumeElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    // Multi-page support (long resumes)
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    pdf.save("HireFold_Resume.pdf");
  } catch (error) {
    
    alert("Failed to export PDF. Try again.");
  }
};

