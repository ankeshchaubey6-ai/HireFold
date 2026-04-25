import htmlToDocx from "html-to-docx";

export async function exportResumeDOCX() {
  const element = document.getElementById("resume-print-root");
  if (!element) return;

  const html = element.outerHTML;

  const fileBuffer = await htmlToDocx(html, null, {
    table: { row: { cantSplit: true } },
  });

  const blob = new Blob([fileBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Resume.docx";
  link.click();
}
