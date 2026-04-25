// src/db/stores.config.js

/**
 * HireFold IndexedDB Configuration (LOCKED  Option A)
 * ----------------------------------------------------
 * SINGLE SOURCE OF TRUTH:
 * - One store: RESUMES
 * - structuredData is embedded INSIDE ResumeEntity
 *
 *  Do NOT add another resume-related store.
 *  Do NOT split structured data again.
 */

export const DB_NAME = "hirefold_indexed_db";
export const DB_VERSION = 2; //  bumped to reset old broken schema safely

/**
 * Object store names
 */
export const STORES = {
  RESUMES: "resumes",
  ATS_TRAINING: "ats_training_data",
};

/**
 * Store schema definitions
 */
export const STORE_SCHEMAS = {
  [STORES.RESUMES]: {
    keyPath: "resumeId",
    autoIncrement: false,
    indexes: [
      { name: "userId", keyPath: "userId", unique: false },
      { name: "source", keyPath: "source", unique: false },
      { name: "isDraft", keyPath: "isDraft", unique: false },
      { name: "updatedAt", keyPath: "updatedAt", unique: false },
    ],
  },

  [STORES.ATS_TRAINING]: {
    keyPath: "id",
    autoIncrement: true,
    indexes: [
      { name: "createdAt", keyPath: "createdAt", unique: false },
      { name: "source", keyPath: "source", unique: false },
    ],
  },
};

