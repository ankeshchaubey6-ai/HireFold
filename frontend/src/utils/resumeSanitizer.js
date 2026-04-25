// src/utils/resumeSanitizer.js

import resumeSchema from "./resumeSchema";

/**
 * Ensures resume shape WITHOUT data loss
 */
export default function resumeSanitizer(input) {
  const safe = structuredClone(resumeSchema);

  const merge = (target, source) => {
    Object.keys(source || {}).forEach((key) => {
      if (Array.isArray(source[key])) {
        target[key] = source[key];
      } else if (
        typeof source[key] === "object" &&
        source[key] !== null
      ) {
        target[key] = target[key] || {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  };

  merge(safe, input);

  return safe;
}
