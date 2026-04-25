/**
 * snapshot.service.js
 *
 * Responsible for generating stable HTML snapshots
 * that preserve resume layout for preview & download.
 */

export function generateResumeSnapshot(containerElement) {
  if (!containerElement) {
    throw new Error("Snapshot container missing");
  }

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${containerElement.innerHTML}
      </body>
    </html>
  `;
}
