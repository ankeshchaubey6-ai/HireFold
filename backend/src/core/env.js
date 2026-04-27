import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

/* =========================================================
   ENV VARIABLES
========================================================= */

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/* =========================================================
   VALIDATION (FAIL FAST)
========================================================= */

if (!MONGO_URI) {
  throw new Error(" MONGO_URI not defined in .env");
}

if (!JWT_SECRET) {
  throw new Error(" JWT_SECRET not defined in .env");
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(" Cloudinary environment variables not defined in .env");
}

/* =========================================================
   CONFIGURE CLOUDINARY (GLOBALLY ON STARTUP)
========================================================= */
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

