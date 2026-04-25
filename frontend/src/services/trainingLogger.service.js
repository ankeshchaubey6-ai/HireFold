import { executeTransaction } from "../db/indexedDb";
import { STORES } from "../db/stores.config";

/**
 * ATS Training Logger (Production Grade)
 * -------------------------------------
 * Purpose:
 *  - Persist anonymized ATS learning records
 *  - Zero PII
 *  - Deterministic & auditable
 *  - Backend-portable (IndexedDB  API later)
 *
 * This service NEVER computes scores or features.
 * It only records them.
 */

/* ============================
   CONFIG
============================ */

const TRAINING_SCHEMA_VERSION = "ats-training-v1";
const DEDUP_WINDOW_MS = 1000 * 60 * 5; // 5 minutes
const recentCache = new Map(); // resumeId -> timestamp

/* ============================
   VALIDATION
============================ */

function isValidFeatureVector(features) {
  return (
    features &&
    typeof features === "object" &&
    typeof features.experienceSignal === "number" &&
    typeof features.skillSignal === "number"
  );
}

/* ============================
   MAIN LOGGER
============================ */

/**
 * Log ATS training data (PII-safe)
 *
 * @param {Object} payload
 * @param {string} payload.resumeId
 * @param {Object} payload.features      // extracted ATS features
 * @param {number} payload.score         
 * @param {string} payload.source        // upload | builder | import
 * @param {string} payload.role          // frontend_engineer | backend_engineer | etc.
 * @param {boolean} payload.consentGiven // must be true
 */
export async function logATSTrainingData({
  resumeId,
  features,
  score,
  source = "unknown",
  role = "default",
  consentGiven = false,
}) {
  // --- Consent gate (LEGAL + ETHICAL) ---
  if (!consentGiven) return;

  // --- Validation ---
  if (!resumeId || typeof score !== "number") return;
  if (!isValidFeatureVector(features)) return;

  // --- Deduplication ---
  const now = Date.now();
  const lastLogged = recentCache.get(resumeId);
  if (lastLogged && now - lastLogged < DEDUP_WINDOW_MS) {
    return;
  }
  recentCache.set(resumeId, now);

  // --- Training Record (NO PII) ---
  const trainingRecord = {
    resumeId,            // optional foreign key (can be removed later)
    score,
    role,
    source,

    features,            // numeric signals only
    schemaVersion: TRAINING_SCHEMA_VERSION,

    createdAt: now,
    engine: "hirefold-ats",
    environment: "frontend-indexeddb",
  };

  // --- Persist (append-only) ---
  return executeTransaction(
    STORES.ATS_TRAINING,
    "readwrite",
    (store) => store.add(trainingRecord)
  );
}

