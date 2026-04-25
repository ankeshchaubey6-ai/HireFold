import dotenv from "dotenv";

dotenv.config();

/* =========================================================
   ENV VARIABLES
========================================================= */

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

/* =========================================================
   VALIDATION (FAIL FAST)
========================================================= */

if (!MONGO_URI) {
  throw new Error(" MONGO_URI not defined in .env");
}

if (!JWT_SECRET) {
  throw new Error(" JWT_SECRET not defined in .env");
}

